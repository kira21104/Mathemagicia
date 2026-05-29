const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

// Serve files from WebGame/ AND parent MathGame/ (for jsx assets)
const ROOTS = [
  path.join(__dirname),
  path.join(__dirname, '..'),
];

const mimeTypes = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.jsx':  'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
};

function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Try each root
  for (const root of ROOTS) {
    const filePath = path.join(root, urlPath);
    // Security: stay inside roots
    if (!filePath.startsWith(root) && !filePath.startsWith(ROOTS[1])) continue;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Cross-Origin-Opener-Policy': 'same-origin',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found: ' + urlPath);
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('   ✦  Mathemagicia — Книга Магии Математики');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  💻  Компьютер:  http://localhost:' + PORT);
  console.log('  📱  Телефон:    http://' + ip + ':' + PORT);
  console.log('');
  console.log('  (телефон и ПК должны быть в одной Wi-Fi)');
  console.log('  Ctrl+C — остановить');
  console.log('');
});
