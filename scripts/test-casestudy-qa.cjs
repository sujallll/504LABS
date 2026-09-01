const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = path.resolve('C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\80f8ad22-efa9-4e47-a13a-6d623408b6ae');

async function run() {
  console.log('[QA] Capturing Case Study 01 (THEBULLSEYE) Hero & Meta...');
  const cs1HeroOut = path.join(artifactDir, 'qa_cs_bullseye_hero.png');
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,1200 --virtual-time-budget=4000 "--screenshot=${cs1HeroOut}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });

  console.log('[QA] Capturing Case Study 02 (MERAKI)...');
  const cs2Out = path.join(artifactDir, 'qa_cs_meraki.png');
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=1440,1200 --virtual-time-budget=4000 "--screenshot=${cs2Out}" "http://localhost:5173/#case-study/meraki-square-foot"`, { stdio: 'inherit' });

  console.log('[QA] Capturing Case Study Mobile (390px)...');
  const csMobileOut = path.join(artifactDir, 'qa_cs_mobile_390.png');
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=390,844 --virtual-time-budget=4000 "--screenshot=${csMobileOut}" "http://localhost:5173/#case-study/thebullseye"`, { stdio: 'inherit' });

  console.log('[QA] All Case Study captures complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
