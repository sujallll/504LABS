const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

const defaultOut = path.join(artifactDir, 'qa_default_grid.png');
console.log('Capturing default state grid...');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,1100 --virtual-time-budget=3000 "--screenshot=${defaultOut}" "http://localhost:5173/#work"`, { stdio: 'inherit' });

console.log('Capture complete!');
