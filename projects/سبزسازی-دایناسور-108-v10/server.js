const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number.parseInt(process.env.PORT || '3000', 10);
const indexPath = path.join(__dirname, 'index.html');

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  const requestPath = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
  if (requestPath !== '/' && requestPath !== '/index.html') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  fs.readFile(indexPath, (error, content) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Unable to load the game');
      return;
    }

    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': content.length
    });
    if (request.method === 'GET') response.end(content);
    else response.end();
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`دایناسور برو در http://127.0.0.1:${port} اجرا شد`);
});
