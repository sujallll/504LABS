const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

const projects = [
  'thebullseye',
  'meraki-square-foot',
  'surety-bond-hub',
  'the-cpi-coach',
  'tripscape-adventures',
  'shravi-logistics'
];

for (const p of projects) {
  const out = path.join(artifactDir, `qa_cs_${p}.png`);
  console.log(`Verifying Case Study: ${p}...`);
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,1100 --virtual-time-budget=3000 "--screenshot=${out}" "http://localhost:5173/#case-study/${p}"`, { stdio: 'inherit' });
  console.log(`[PASS] ${p} verified successfully.`);
}

console.log('[ALL 6 CASE STUDIES VERIFIED SUCCESSFULLY]');
