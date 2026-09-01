const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

const viewports = [
  { name: 'qa_desktop_1440.png', width: 1440, height: 1100 },
  { name: 'qa_desktop_1920.png', width: 1920, height: 1200 },
  { name: 'qa_tablet_1024.png', width: 1024, height: 1000 },
  { name: 'qa_mobile_390.png', width: 390, height: 844 }
];

for (const vp of viewports) {
  const outPath = path.join(artifactDir, vp.name);
  console.log(`[QA] Capturing ${vp.name} (${vp.width}x${vp.height})...`);
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${vp.width},${vp.height} --virtual-time-budget=3000 "--screenshot=${outPath}" "http://localhost:5173/#work"`;
    execSync(cmd, { stdio: 'ignore', timeout: 15000 });
    if (fs.existsSync(outPath)) {
      console.log(`[OK] Saved ${vp.name}`);
    }
  } catch (err) {
    console.error(`[FAIL] ${vp.name}:`, err.message);
  }
}
console.log('QA Screenshots finished!');
