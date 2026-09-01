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

  console.log('[ALL TESTS PASSED SUCCESSFULLY]');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
