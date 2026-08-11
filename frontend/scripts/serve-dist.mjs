import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const port = Number(process.env.PORT ?? 4173);
const distDir = resolve('dist');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const requestedPath = cleanPath === '' ? 'index.html' : cleanPath;
  const filePath = join(distDir, requestedPath);
  const safePath = existsSync(filePath) ? filePath : join(distDir, 'index.html');

  response.setHeader('Content-Type', contentTypes[extname(safePath)] ?? 'application/octet-stream');
  createReadStream(safePath).pipe(response);
}).listen(port, () => {
  console.log(`Placement Roadmap frontend: http://localhost:${port}`);
});
