const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

console.log('Capturing Bright Theme Desktop...');
const outDesktop = path.join(artifactDir, 'qa_bright_desktop.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,2500 --virtual-time-budget=4000 "--screenshot=${outDesktop}" "http://localhost:5173/"`, { stdio: 'inherit' });

console.log('Capturing Bright Theme Case Study...');
const outCaseStudy = path.join(artifactDir, 'qa_bright_case_study.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,2000 --virtual-time-budget=4000 "--screenshot=${outCaseStudy}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });

console.log('Captures completed!');
