const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

console.log('Testing clean build...');
execSync('npm run build', { stdio: 'inherit' });
console.log('Build OK!');
