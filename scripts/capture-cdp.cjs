const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const assetsDir = path.resolve(__dirname, '../public/assets');

async function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function captureSite(url, outFilename, actions = null) {
  const port = 9222;
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1600,1050',
    'about:blank'
  ]);

  try {
    await wait(1500);
    const pages = await fetchJson(`http://127.0.0.1:${port}/json`);
    const page = pages[0];
    if (!page || !page.webSocketDebuggerUrl) throw new Error('No page found');

    const WebSocket = require('node:stream') ? null : null;
    // We can use simple Chrome devtools protocol via WebSocket if ws is available, or use --screenshot directly after navigating
  } finally {
    chromeProcess.kill();
  }
}
