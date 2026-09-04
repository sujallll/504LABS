const { execSync } = require('child_process');
const path = require('path');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

// Use headless chrome with full page screenshot
console.log('Capturing full page bottom...');
const outFooter = path.join(artifactDir, 'qa_color_system_footer_actual.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,7500 --virtual-time-budget=4000 "--screenshot=${outFooter}" "http://localhost:5173/"`, { stdio: 'inherit' });
console.log('Done!');
