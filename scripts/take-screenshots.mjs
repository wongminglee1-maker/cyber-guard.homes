import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const PORT = 3990;
const ROOT_DIR = process.cwd();
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\USERR\\.gemini\\antigravity\\brain\\99dde5aa-6ac7-4a23-bcf5-3b589e0ceeea';
const PREVIEWS_DIR = path.resolve('preview-screenshots');

if (!fs.existsSync(PREVIEWS_DIR)) fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  
  let filePath = path.join(ROOT_DIR, reqPath);
  
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function runEdgeScreenshot(args) {
  return new Promise((resolve) => {
    const child = spawn(EDGE_PATH, args);
    child.on('close', (code) => resolve(code));
    child.on('error', (err) => {
      console.warn('Spawn error:', err.message);
      resolve(1);
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server started at http://127.0.0.1:${PORT}`);

  const TARGETS = [
    { name: 'desktop-full-home.png', url: `http://127.0.0.1:${PORT}/`, width: 1440, height: 4800 },
    { name: 'desktop-nodes-48.png', url: `http://127.0.0.1:${PORT}/#nodes`, width: 1440, height: 1200 },
    { name: 'mobile-full-home.png', url: `http://127.0.0.1:${PORT}/`, width: 390, height: 6000 }
  ];

  const tempUserDir = path.join(os.tmpdir(), 'edge-preview-' + Date.now());

  for (const t of TARGETS) {
    const localShot = path.join(PREVIEWS_DIR, t.name);
    const artifactShot = path.join(ARTIFACT_DIR, t.name);

    console.log(`Capturing ${t.name}...`);
    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=3000',
      `--user-data-dir=${tempUserDir}`,
      `--window-size=${t.width},${t.height}`,
      `--screenshot=${localShot}`,
      t.url
    ];
    
    await runEdgeScreenshot(args);
    await sleep(200);

    if (fs.existsSync(localShot)) {
      fs.copyFileSync(localShot, artifactShot);
      const stats = fs.statSync(localShot);
      console.log(`Success: ${t.name} (${stats.size} bytes)`);
    } else {
      console.log(`Failed: ${t.name}`);
    }
  }

  server.close(() => {
    console.log('Finished capturing screenshots.');
    process.exit(0);
  });
});
