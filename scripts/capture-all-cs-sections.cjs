const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

async function main() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--window-size=1440,1200'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  function getJSON(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const list = await getJSON('http://localhost:9223/json');
  const target = list[0];
  const wsUrl = target.webSocketDebuggerUrl;

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  await new Promise(r => ws.on('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5173/#case-study/thebullseye' });
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 1: Upper section (Approach & Challenge)
  await send('Runtime.evaluate', { expression: 'document.getElementById("case-study-overlay").scrollTop = 800;' });
  await new Promise(r => setTimeout(r, 600));
  let res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_cs_section_approach.png'), Buffer.from(res.data, 'base64'));

  // Screenshot 2: Middle section (Design Direction & Full-Width)
  await send('Runtime.evaluate', { expression: 'document.getElementById("case-study-overlay").scrollTop = 2100;' });
  await new Promise(r => setTimeout(r, 600));
  res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_cs_section_direction.png'), Buffer.from(res.data, 'base64'));

  // Screenshot 3: Lower section (Detail Shots & Mobile)
  await send('Runtime.evaluate', { expression: 'document.getElementById("case-study-overlay").scrollTop = 3500;' });
  await new Promise(r => setTimeout(r, 600));
  res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_cs_section_mobile.png'), Buffer.from(res.data, 'base64'));

  // Screenshot 4: Bottom section (Result, CTA & Next Project)
  await send('Runtime.evaluate', { expression: 'document.getElementById("case-study-overlay").scrollTop = 5000;' });
  await new Promise(r => setTimeout(r, 600));
  res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_cs_section_next.png'), Buffer.from(res.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('All 4 section scroll screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
