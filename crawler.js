const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const topWebsites = [
    { "name": "Wikipedia", "url": "https://www.wikipedia.org", "type": "Online Encyclopedia" }
]

const crawledWebsitesFile = path.join(__dirname, 'crawledWebsites.json');
const visitedUrlsFile = path.join(__dirname, 'visitedUrls.json');

let crawledWebsites = [];
if (fs.existsSync(crawledWebsitesFile)) {
    crawledWebsites = JSON.parse(fs.readFileSync(crawledWebsitesFile, 'utf-8'));
}

let visitedUrls = [];
if (fs.existsSync(visitedUrlsFile)) {
    visitedUrls = JSON.parse(fs.readFileSync(visitedUrlsFile, 'utf-8'));
}

async function downloadResource(url, folderPath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const urlPath = new URL(url).pathname;
        const resourcePath = path.join(folderPath, urlPath);
        const resourceDir = path.dirname(resourcePath);
        fs.mkdirSync(resourceDir, { recursive: true });
        fs.writeFileSync(resourcePath, response.data);
        return resourcePath;
    } catch (error) {
        console.error(`Failed to download ${url}:`, error);
        return null;
    }
}

async function savePageContent(page, url, folderPath, level) {
    if (visitedUrls.includes(url) || level > 1) return;
    visitedUrls.push(url);
    fs.writeFileSync(visitedUrlsFile, JSON.stringify(visitedUrls, null, 2));

    try {
        await page.goto(url, { waitUntil: 'networkidle0' });
        let content = await page.content();

        const urlPath = new URL(url).pathname === '/' ? 'index.html' : new URL(url).pathname + '.html';
        const filePath = path.join(folderPath, urlPath);
        const folder = path.dirname(filePath);
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(filePath, content);

        console.log(`Saved ${url} to ${filePath}`);

        const staticAssets = await page.evaluate(() => {
            const assets = [];
            document.querySelectorAll('link[rel="stylesheet"], script[src], img[src]').forEach((element) => {
                if (element.href) {
                    assets.push(element.href);
                } else if (element.src) {
                    assets.push(element.src);
                }
            });
            return assets;
        });

        for (const asset of staticAssets) {
            const assetPath = await downloadResource(asset, folderPath);
            if (assetPath) {
                const relativePath = path.relative(folderPath, assetPath);
                content = content.replace(new RegExp(asset, 'g'), relativePath.replace(/\\/g, '/'));
            }
        }

        fs.writeFileSync(filePath, content);

        const links = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href]'), a => a.href).filter(href => href.startsWith('http'))
        );

        for (const link of links) {
            await savePageContent(page, link, folderPath, level + 1);
        }
    } catch (error) {
        console.error(`Failed to save page content for ${url}:`, error);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let website of topWebsites) {
        const domain = new URL(website.url).hostname;

        if (crawledWebsites.includes(domain)) {
            console.log(`Skipping already scraped website: ${domain}`);
            continue;
        }

        const folderPath = path.join(__dirname, 'websites', domain);
        fs.mkdirSync(folderPath, { recursive: true });

        await savePageContent(page, website.url, folderPath, 0);

        crawledWebsites.push(domain);
        fs.writeFileSync(crawledWebsitesFile, JSON.stringify(crawledWebsites, null, 2));
    }

    await browser.close();
})();