const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');
const out = path.join(artifactDir, 'qa_cs_mobile_390_v2.png');

execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=390,844 --virtual-time-budget=3000 "--screenshot=${out}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });
console.log('Mobile screenshot generated.');
