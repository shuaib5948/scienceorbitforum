/**
 * Science Orbit Forum — server (Node).
 *
 * Phase 1 delivers the design system only; this is a minimal production-grade
 * static-file server that will serve the built website from Phase 2 onward.
 * It is intentionally minimal and does not build any site pages yet.
 */
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync, readFileSync } from 'node:fs';
import { join, extname, normalize, resolve } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const config = JSON.parse(readFileSync(join(HERE, 'config.json'), 'utf8'));

const DIST = resolve(join(HERE, '..', 'dist'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendFile(res, filePath) {
  const mime = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
  res.writeHead(200, { 'content-type': mime, 'cache-control': 'public, max-age=3600' });
  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const pathname = normalize(decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  const rootPath = normalize(resolve(join(DIST, pathname)));

  // Prevent path traversal outside the dist directory.
  if (!rootPath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const candidate =
    existsSync(rootPath) && statSync(rootPath).isFile()
      ? rootPath
      : join(DIST, 'index.html');
  sendFile(res, candidate);
}).listen(config.server.port, config.server.host, () => {
  console.log(`\n  Science Orbit Forum static server → http://localhost:${config.server.port}\n`);
});