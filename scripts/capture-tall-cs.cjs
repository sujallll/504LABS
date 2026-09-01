const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

const outTall = path.join(artifactDir, 'qa_cs_bullseye_full_tall.png');
console.log('Capturing tall full view of Case Study 01 (THEBULLSEYE)...');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,4200 --virtual-time-budget=4000 "--screenshot=${outTall}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });

console.log('Capture completed successfully!');
