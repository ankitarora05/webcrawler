const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const topWebsites = [
    // { "name": "Google", "url": "https://www.google.com", "type": "Search Engine" },
    //{ "name": "YouTube", "url": "https://www.youtube.com", "type": "Video Sharing" },
    // { "name": "Amazon", "url": "https://www.amazon.com", "type": "E-commerce" },
    // { "name": "Facebook", "url": "https://www.facebook.com", "type": "Social Media" },
    // { "name": "Instagram", "url": "https://www.instagram.com", "type": "Social Media" },
    // { "name": "Wikipedia", "url": "https://www.wikipedia.org", "type": "Online Encyclopedia" },
    // { "name": "Netflix", "url": "https://www.netflix.com", "type": "Streaming Service" },
    // { "name": "Twitter", "url": "https://www.twitter.com", "type": "Social Media" },
    // { "name": "LinkedIn", "url": "https://www.linkedin.com", "type": "Professional Networking" },
    // { "name": "Reddit", "url": "https://www.reddit.com", "type": "Social Media" },
    // { "name": "eBay", "url": "https://www.ebay.com", "type": "E-commerce" },
    // { "name": "Yahoo", "url": "https://www.yahoo.com", "type": "Web Portal" },
    // { "name": "Baidu", "url": "https://www.baidu.com", "type": "Search Engine" },
    // { "name": "Tencent QQ", "url": "https://www.qq.com", "type": "Messaging" },
    // { "name": "Taobao", "url": "https://www.taobao.com", "type": "E-commerce" },
    // { "name": "Tmall", "url": "https://www.tmall.com", "type": "E-commerce" },
    // { "name": "Sina Weibo", "url": "https://www.weibo.com", "type": "Social Media" },
    // { "name": "Sohu", "url": "https://www.sohu.com", "type": "Web Portal" },
    // { "name": "Zoom", "url": "https://www.zoom.us", "type": "Video Conferencing" },
    // { "name": "PayPal", "url": "https://www.paypal.com", "type": "Finance" },
    // { "name": "VK", "url": "https://www.vk.com", "type": "Social Media" },
    // { "name": "Google India", "url": "https://www.google.co.in", "type": "Search Engine" },
    // { "name": "Amazon India", "url": "https://www.amazon.in", "type": "E-commerce" },
    // { "name": "Flipkart", "url": "https://www.flipkart.com", "type": "E-commerce" },
    // { "name": "Netflix India", "url": "https://www.netflix.com/in/", "type": "Streaming Service" },
    // { "name": "Hotstar", "url": "https://www.hotstar.com", "type": "Streaming Service" },
    // { "name": "Zomato", "url": "https://www.zomato.com", "type": "Food Delivery" },
    // { "name": "IRCTC", "url": "https://www.irctc.co.in", "type": "Travel" },
    // { "name": "Paytm", "url": "https://www.paytm.com", "type": "Finance" },
    // { "name": "ICICI Bank", "url": "https://www.icicibank.com", "type": "Finance" },
    // { "name": "HDFC Bank", "url": "https://www.hdfcbank.com", "type": "Finance" },
    // { "name": "Axis Bank", "url": "https://www.axisbank.com", "type": "Finance" },
    // { "name": "State Bank of India", "url": "https://www.onlinesbi.com", "type": "Finance" },
    // { "name": "Times of India", "url": "https://www.timesofindia.indiatimes.com", "type": "News" },
    // { "name": "NDTV", "url": "https://www.ndtv.com", "type": "News" },
    // { "name": "BBC India", "url": "https://www.bbc.com/india", "type": "News" },
    // { "name": "The Hindu", "url": "https://www.thehindu.com", "type": "News" },
    // { "name": "Indian Express", "url": "https://www.indianexpress.com", "type": "News" },
    // { "name": "Hindustan Times", "url": "https://www.hindustantimes.com", "type": "News" },
    // { "name": "Moneycontrol", "url": "https://www.moneycontrol.com", "type": "Finance" },
    // { "name": "Gadgets360", "url": "https://www.gadgets.ndtv.com", "type": "Technology" },
    // { "name": "Firstpost", "url": "https://www.firstpost.com", "type": "News" },
    // { "name": "Livemint", "url": "https://www.livemint.com", "type": "News" },
    // { "name": "Business Standard", "url": "https://www.business-standard.com", "type": "News" },
    // { "name": "Economic Times", "url": "https://www.economictimes.indiatimes.com", "type": "News" },
    // { "name": "Jabong", "url": "https://www.jabong.com", "type": "E-commerce" },
    // { "name": "ShopClues", "url": "https://www.shopclues.com", "type": "E-commerce" },
    // { "name": "BookMyShow", "url": "https://www.bookmyshow.com", "type": "Entertainment" },
    // { "name": "MakeMyTrip", "url": "https://www.makemytrip.com", "type": "Travel" },
    // { "name": "Yatra", "url": "https://www.yatra.com", "type": "Travel" },
    // { "name": "Cleartrip", "url": "https://www.cleartrip.com", "type": "Travel" },
    // { "name": "OYO Rooms", "url": "https://www.oyorooms.com", "type": "Travel" },
    // { "name": "Air India", "url": "https://www.airindia.in", "type": "Travel" },
    // { "name": "Indigo Airlines", "url": "https://www.goindigo.in", "type": "Travel" },
    // { "name": "GoAir", "url": "https://www.goair.in", "type": "Travel" },
    // { "name": "Vistara", "url": "https://www.airvistara.com", "type": "Travel" },
    // { "name": "SpiceJet", "url": "https://www.spicejet.com", "type": "Travel" },
    // { "name": "BSNL", "url": "https://www.bsnl.co.in", "type": "Telecommunications" },
    // { "name": "Airtel", "url": "https://www.airtel.in", "type": "Telecommunications" },
    // { "name": "Idea Cellular", "url": "https://www.ideacellular.com", "type": "Telecommunications" },
    // { "name": "Vodafone India", "url": "https://www.vodafone.in", "type": "Telecommunications" },
    // { "name": "Reliance Digital", "url": "https://www.reliancedigital.in", "type": "E-commerce" },
    // { "name": "Tata CLiQ", "url": "https://www.tatacliq.com", "type": "E-commerce" },
    // { "name": "BigBasket", "url": "https://www.bigbasket.com", "type": "E-commerce" },
    // { "name": "Grofers", "url": "https://www.grofers.com", "type": "E-commerce" },
    // { "name": "UrbanClap", "url": "https://www.urbanclap.com", "type": "Services" },
    // { "name": "Justdial", "url": "https://www.justdial.com", "type": "Services" },
    // { "name": "Sulekha", "url": "https://www.sulekha.com", "type": "Services" },
    // { "name": "OLX India", "url": "https://www.olx.in", "type": "Classifieds" },
    // { "name": "Quikr", "url": "https://www.quikr.com", "type": "Classifieds" },
    // { "name": "Naukri", "url": "https://www.naukri.com", "type": "Jobs" },
    // { "name": "Monster India", "url": "https://www.monsterindia.com", "type": "Jobs" },
    // { "name": "Shine", "url": "https://www.shine.com", "type": "Jobs" },
    // { "name": "TimesJobs", "url": "https://www.timesjobs.com", "type": "Jobs" },
    // { "name": "Freshersworld", "url": "https://www.freshersworld.com", "type": "Jobs" },
    // { "name": "Hike", "url": "https://www.hike.in", "type": "Social Media" },
    // { "name": "Gaana", "url": "https://www.gaana.com", "type": "Music Streaming" },
    // { "name": "Saavn", "url": "https://www.saavn.com", "type": "Music Streaming" },
    // { "name": "Wynk", "url": "https://www.wynk.in", "type": "Music Streaming" },
    // { "name": "Hungama", "url": "https://www.hungama.com", "type": "Music Streaming" },
    // { "name": "Bing", "url": "https://www.bing.com", "type": "Search Engine" },
    // { "name": "DuckDuckGo", "url": "https://www.duckduckgo.com", "type": "Search Engine" },
    // { "name": "GitHub", "url": "https://www.github.com", "type": "Code Repository" },
    // { "name": "Stack Overflow", "url": "https://www.stackoverflow.com", "type": "Q&A Platform" },
    // { "name": "WordPress", "url": "https://www.wordpress.com", "type": "Blogging" },
    // { "name": "Medium", "url": "https://www.medium.com", "type": "Blogging" },
    // { "name": "Pinterest", "url": "https://www.pinterest.com", "type": "Social Media" },
    // { "name": "Dropbox", "url": "https://www.dropbox.com", "type": "Cloud Storage" },
    // { "name": "OneDrive", "url": "https://www.onedrive.com", "type": "Cloud Storage" },
    // { "name": "Box", "url": "https://www.box.com", "type": "Cloud Storage" },
    // { "name": "iCloud", "url": "https://www.icloud.com", "type": "Cloud Storage" },
    // { "name": "SoundCloud", "url": "https://www.soundcloud.com", "type": "Music Streaming" },
    // { "name": "Spotify", "url": "https://www.spotify.com", "type": "Music Streaming" },
    // { "name": "Apple Music", "url": "https://www.music.apple.com", "type": "Music Streaming" },
    // { "name": "Deezer", "url": "https://www.deezer.com", "type": "Music Streaming" },
    // { "name": "Tidal", "url": "https://www.tidal.com", "type": "Music Streaming" },
    // { "name": "Pandora", "url": "https://www.pandora.com", "type": "Music Streaming" },
    // { "name": "Coursera", "url": "https://www.coursera.org", "type": "Education" },
    // { "name": "edX", "url": "https://www.edx.org", "type": "Education" },
    // { "name": "Udemy", "url": "https://www.udemy.com", "type": "Education" },
    // { "name": "Khan Academy", "url": "https://www.khanacademy.org", "type": "Education" },
    // { "name": "Duolingo", "url": "https://www.duolingo.com", "type": "Education" },
    // { "name": "Codecademy", "url": "https://www.codecademy.com", "type": "Education" },
    // { "name": "Coursera India", "url": "https://www.coursera.org", "type": "Education" },
    // { "name": "edX India", "url": "https://www.edx.org", "type": "Education" },
    // { "name": "Udemy India", "url": "https://www.udemy.com", "type": "Education" },
    // { "name": "Khan Academy India", "url": "https://www.khanacademy.org", "type": "Education" },
    // { "name": "Duolingo India", "url": "https://www.duolingo.com", "type": "Education" },
    // { "name": "Codecademy India", "url": "https://www.codecademy.com", "type": "Education" }
    {"name": "Reuters", "url": "https://www.reuters.com/", "type": "News Publishing"}
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
    if (visitedUrls.includes(url) || level > 2) return;
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