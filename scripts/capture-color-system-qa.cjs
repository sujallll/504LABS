const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

console.log('Capturing Color System Hero + Portfolio...');
const outHero = path.join(artifactDir, 'qa_color_system_hero_portfolio.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,2400 --virtual-time-budget=3000 "--screenshot=${outHero}" "http://localhost:5173/"`, { stdio: 'inherit' });

console.log('Capturing Color System Case Study Dossier...');
const outCS = path.join(artifactDir, 'qa_color_system_case_study.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,2000 --virtual-time-budget=3000 "--screenshot=${outCS}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });

console.log('Capturing Color System Contact & Footer...');
const outFooter = path.join(artifactDir, 'qa_color_system_footer.png');
execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,1600 --virtual-time-budget=3000 "--screenshot=${outFooter}" "http://localhost:5173/#contact"`, { stdio: 'inherit' });

console.log('All QA captures completed!');
