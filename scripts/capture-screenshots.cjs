const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const assetsDir = path.resolve(__dirname, '../public/assets');

const sites = [
  { id: 'thebullseye', url: 'https://thebullseye.in/', out: 'thebullseye_real.png' },
  { id: 'meraki', url: 'https://www.merakisquarefootsllp.co.in/', out: 'meraki_real.png' },
  { id: 'surety', url: 'https://suretybondhub.in/', out: 'surety_real.png' },
  { id: 'cpi_coach', url: 'https://the-cpi-coach.vercel.app/', out: 'cpi_coach_real.png' },
  { id: 'tripscape', url: 'https://www.tripscapeadventures.in/', out: 'tripscape_real.png' },
  { id: 'shravi', url: 'https://www.shravilogistics.com/', out: 'shravi_real.png' }
];

for (const s of sites) {
  const outPath = path.join(assetsDir, s.out);
  console.log(`[CAPTURE] ${s.id} -> ${s.url}`);
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1600,1050 --virtual-time-budget=6000 "--screenshot=${outPath}" "${s.url}"`;
    execSync(cmd, { stdio: 'ignore', timeout: 35000 });
    if (fs.existsSync(outPath)) {
      const stats = fs.statSync(outPath);
      console.log(`[SUCCESS] Saved ${s.out} (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`[FAILED] File not found: ${outPath}`);
    }
  } catch (err) {
    console.error(`[ERROR] ${s.id}:`, err.message);
  }
}
console.log('Capture finished!');
