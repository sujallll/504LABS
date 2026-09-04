async function test() {
  console.log('[TEST] Checking HTML structure, projects data and assets...');

  const { portfolioProjects } = await import('../src/data/projects.js');
  console.log(`[TEST] Total projects configured: ${portfolioProjects.length}`);

  if (portfolioProjects.length !== 6) {
    throw new Error(`Expected 6 projects, found ${portfolioProjects.length}`);
  }

  const requiredProjects = [
    { id: 'thebullseye', url: 'https://thebullseye.in/' },
    { id: 'meraki-square-foot', url: 'https://www.merakisquarefootsllp.co.in/' },
    { id: 'surety-bond-hub', url: 'https://suretybondhub.in/' },
    { id: 'the-cpi-coach', url: 'https://the-cpi-coach.vercel.app/' },
    { id: 'tripscape-adventures', url: 'https://www.tripscapeadventures.in/' },
    { id: 'shravi-logistics', url: 'https://www.shravilogistics.com/' }
  ];

  for (const req of requiredProjects) {
    const found = portfolioProjects.find(p => p.id === req.id);
    if (!found) {
      throw new Error(`Missing project: ${req.id}`);
    }
    if (found.url !== req.url) {
      throw new Error(`Project URL mismatch for ${req.id}: expected ${req.url}, got ${found.url}`);
    }
    console.log(`[PASS] Verified ${found.title} (${found.category}) -> ${found.url}`);
  }

  // Verify Contact section updates in index.html
  const fs = await import('fs');
  const path = await import('path');
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

  console.log('[TEST] Checking Contact Section (Calendly + WhatsApp)...');

  if (!html.includes('GET IN TOUCH')) {
    throw new Error('Expected eyebrow label "GET IN TOUCH" in contact section');
  }
  if (!html.includes("LET'S BUILD SOMETHING")) {
    throw new Error('Missing heading "LET\'S BUILD SOMETHING"');
  }
  if (!html.includes('// 01. BOOK A CALL')) {
    throw new Error('Missing "// 01. BOOK A CALL" label');
  }
  if (!html.includes('// SCHEDULE A 30-MIN INTRO CALL')) {
    throw new Error('Missing "// SCHEDULE A 30-MIN INTRO CALL" label');
  }
  if (!html.includes('https://calendly.com/gsujal02/30min')) {
    throw new Error('Missing Calendly URL link');
  }
  if (!html.includes('calendly-inline-widget')) {
    throw new Error('Missing calendly-inline-widget element');
  }
  if (!html.includes('assets.calendly.com/assets/external/widget.js')) {
    throw new Error('Missing Calendly widget script embed');
  }
  if (!html.includes('// 02. MESSAGE US DIRECTLY')) {
    throw new Error('Missing "// 02. MESSAGE US DIRECTLY" label');
  }
  if (!html.includes('https://wa.me/917506829020?text=Hi%20504LABS%2C%20I%27d%20like%20to%20discuss%20a%20project')) {
    throw new Error('Missing WhatsApp click dispatch URL');
  }
  if (!html.includes('MESSAGE ON WHATSAPP')) {
    throw new Error('Missing "MESSAGE ON WHATSAPP" button text');
  }
  if (!html.includes('504L4BS@GMAIL.COM')) {
    throw new Error('Missing direct email line "504L4BS@GMAIL.COM"');
  }
  if (html.includes('id="project-inquiry-form"') || html.includes('id="terminal-preview"')) {
    throw new Error('Old form or terminal preview was not removed');
  }

  console.log('[PASS] Contact section verified: Calendly embed, WhatsApp CTA & 504L4BS@GMAIL.COM verified.');
  console.log('[ALL TESTS PASSED SUCCESSFULLY]');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
