// Zero-dependency local dev server for static files and api proxies
// Run: node server.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const weatherHandler = require('./api/weather');
const searchHandler = require('./api/search');
const aqiHandler = require('./api/aqi');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Route API requests to serverless handlers
  if (pathname === '/api/weather') {
    req.query = parsedUrl.query;
    return weatherHandler(req, res);
  }
  if (pathname === '/api/search') {
    req.query = parsedUrl.query;
    return searchHandler(req, res);
  }
  if (pathname === '/api/aqi') {
    req.query = parsedUrl.query;
    return aqiHandler(req, res);
  }

  // Handle clean URLs: /lahore -> /lahore.html, /about -> /about.html
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // If path doesn't have extension and exists with .html
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 page
    const notFoundPath = path.join(__dirname, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Weather Tomorrow dev server running at http://localhost:${PORT}`);
});

