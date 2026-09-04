const fs = require('fs');
const assert = require('assert');

console.log('--- Verifying Case Study Fixes ---');

// 1. Check Image Asset
const imgPath = 'public/assets/case_study_monolith.jpg';
assert(fs.existsSync(imgPath), 'public/assets/case_study_monolith.jpg must exist');
const imgStat = fs.statSync(imgPath);
assert(imgStat.size > 10000, `Image file size too small: ${imgStat.size}`);
console.log(`✓ Image asset verified (${imgStat.size} bytes)`);

// 2. Check HTML
const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('src="/assets/case_study_detail_topological.jpg"') || html.includes('src="/assets/case_study_monolith.jpg"'), 'index.html must point to clean case study asset');
assert(html.includes('id="view-case-study-btn"'), 'index.html must contain id="view-case-study-btn"');
assert(html.includes('data-project-id="void-monolith"'), 'index.html must have data-project-id="void-monolith"');
assert(html.includes('href="#case-study/void-monolith"'), 'index.html must have href="#case-study/void-monolith"');
assert(html.includes('CASE STUDY // 001'), 'index.html must retain CASE STUDY // 001 badge');
console.log('✓ index.html markup correctly wired');

// 3. Check CSS
const css = fs.readFileSync('src/styles/main.css', 'utf8');
assert(css.includes('.case-study-overlay-badge'), 'main.css must contain .case-study-overlay-badge');
assert(css.includes('backdrop-filter: blur(8px)'), 'main.css must apply refined badge styling');
console.log('✓ main.css badge styling verified');

// 4. Check Data
const caseStudies = fs.readFileSync('src/data/case-studies.js', 'utf8');
assert(caseStudies.includes('"void-monolith": {'), 'case-studies.js must contain void-monolith entry');
assert(caseStudies.includes('aurel-brand'), 'case-studies.js must contain aurel-brand alias');
assert(caseStudies.includes('PROJECT: VOID MONOLITH'), 'case-studies.js must contain title');
console.log('✓ src/data/case-studies.js dossier data verified');

// 5. Check JS Handler
const mainJs = fs.readFileSync('src/main.js', 'utf8');
assert(mainJs.includes('view-case-study-btn'), 'main.js must attach listener to view-case-study-btn');
assert(mainJs.includes('openCaseStudy'), 'main.js must invoke openCaseStudy');
console.log('✓ src/main.js interaction binding verified');

console.log('>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY <<<');
