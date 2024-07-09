# Web Crawler with PageRank and Search API

This Node.js project is a web crawler that crawls websites, saves their HTML content along with static assets, and builds a graph of the web pages it visits. It includes an API to search through the crawled content using a basic PageRank-inspired algorithm to rank search results.

## Features

- **Web crawling**: Recursively crawls web pages up to a specified depth, saves HTML content, and downloads static assets (CSS, JS, images).
- **PageRank Calculation**: Builds a graph of the links between pages and calculates a basic PageRank for each page.
- **Search API**: Allows searching through the crawled content and ranks results based on the search term frequency combined with the PageRank.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ankitarora05/webcrawler.git
   cd webcrawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. **Start the server**:
   ```bash
   node crawlr.js
   ```

2. **crawl a website**:
   - Send a POST request to `http://localhost:3000/crawl` with the JSON body:
     ```json
     {
       "url": "https://example.com",
       "maxDepth": 10
     }
     ```
   This will start crawling from the specified URL up to the given depth and save the content in the `crawled-sites` directory.

3. **Search for content**:
   - Send a POST request to `http://localhost:3000/search` with the JSON body:
     ```json
     {
       "query": "search term"
     }
     ```
   This will search through the saved HTML files for the specified term and return the files where the term is found, ranked by a combination of term frequency and PageRank.

## Project Structure

- `crawlr.js`: Main file containing the crawlr and API logic.
- `crawled-sites/`: Directory where the crawled content is saved.
- `graph.json`: JSON file storing the graph of the crawled web pages and their links.

## Dependencies

- `express`: Web framework for Node.js.
- `puppeteer`: Headless browser for crawling web pages.
- `fs-extra`: Module for working with the file system.

## Contributing

Feel free to submit issues and pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.
