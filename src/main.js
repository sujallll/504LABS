import { studioData, portfolioProjects, servicesData, processSteps, testimonials, experiments } from './data/projects.js';
import { caseStudiesData } from './data/case-studies.js';
import { audioFx } from './components/audio-fx.js';
import { PlaygroundCanvas } from './components/playground-canvas.js';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Components
  initNavigation();
  initGridToggle();
  initAudioToggle();
  initPortfolio();
  initServices();
  initProcess();
  initTestimonials();
  initPlayground();
  initConfigurator();
  initCaseStudy();
  initFooterForm();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      audioFx.playClick();
      navMenu.classList.toggle('open');
      menuBtn.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        audioFx.playClick();
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('open');
          menuBtn.textContent = '☰';
        }
      });
    });
  }

  // Active section spy on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. BLUEPRINT GRID & AUDIO CONTROLS
   ========================================================================== */
function initGridToggle() {
  const gridBtn = document.getElementById('grid-toggle-btn');
  const gridStatus = document.getElementById('grid-status-text');
  const gridGuides = document.getElementById('blueprint-guides');

  let gridActive = false;

  if (gridBtn && gridGuides) {
    gridBtn.addEventListener('click', () => {
      audioFx.playClick();
      gridActive = !gridActive;
      gridGuides.classList.toggle('hidden', !gridActive);
      gridBtn.classList.toggle('active', gridActive);
      gridStatus.textContent = gridActive ? '[ON]' : '[OFF]';
    });
  }
}

function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioStatus = document.getElementById('audio-status-text');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const enabled = audioFx.toggle();
      audioBtn.classList.toggle('active', enabled);
      audioStatus.textContent = enabled ? '[ON]' : '[OFF]';
    });
  }

  // Attach subtle click SFX to buttons & links
  document.querySelectorAll('button, .btn-brutalist, .filter-btn, .service-row, .project-card, .footer-btn').forEach(el => {
    el.addEventListener('click', () => audioFx.playClick());
  });
}

/* ==========================================================================
   3. PORTFOLIO & FILTERING
   ========================================================================== */
/* ==========================================================================
   3. PORTFOLIO & FILTERING (3x2 EDITORIAL ARCHIVE)
   ========================================================================== */
function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentFilter = 'ALL';
  let isTransitioning = false;

  function renderProjects(filter = 'ALL') {
    if (!grid) return;

    const filtered = filter === 'ALL'
      ? portfolioProjects
      : portfolioProjects.filter(p => p.category === filter);

    grid.innerHTML = '';

    filtered.forEach((project, index) => {
      const card = document.createElement('a');
      card.href = project.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'project-card';
      card.setAttribute('data-id', project.id);
      card.setAttribute('aria-label', `${project.title} — ${project.subtitle} (Opens live website in new tab)`);

      // First 3 items load eager for fast LCP/TTFB
      const loadingAttr = index < 3 ? 'eager' : 'lazy';

      card.innerHTML = `
        <div class="card-media" data-style="${project.visualStyle || 'editorial'}">
          <div class="card-img-wrapper">
            <img src="${project.image}" alt="${project.title} live interface presentation" class="card-img" loading="${loadingAttr}">
          </div>
          <span class="card-tag" data-num="${project.number}">// ${project.number}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <div class="card-category">${project.subtitle}</div>
          <p class="card-desc">${project.shortDesc || project.description}</p>
          <div class="card-action">
            <span class="cta-label">VIEW PROJECT</span>
            <span class="arrow" aria-hidden="true">→</span>
          </div>
        </div>
      `;

      // Micro-interactions on Card
      const tagEl = card.querySelector('.card-tag');
      const imgEl = card.querySelector('.card-img');

      // 1. Mouse move subtle frame pan on image
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

        const panX = Math.round(normX * 6); // subtle 6px shift
        const panY = Math.round(normY * 6); // subtle 6px shift

        card.style.setProperty('--pan-x', `${panX}px`);
        card.style.setProperty('--pan-y', `${panY}px`);
      });

      // 2. Mouse enter: tag update & focus state
      card.addEventListener('mouseenter', () => {
        if (tagEl) {
          tagEl.textContent = '// OPEN ↗';
        }
        grid.classList.add('has-active-card');
        card.classList.add('is-active');
      });

      // 3. Mouse leave: reset tag & pan
      card.addEventListener('mouseleave', () => {
        if (tagEl) {
          tagEl.textContent = `// ${project.number}`;
        }
        card.style.setProperty('--pan-x', '0px');
        card.style.setProperty('--pan-y', '0px');
        card.classList.remove('is-active');

        // Check if no cards are hovered
        if (!grid.querySelector('.project-card:hover')) {
          grid.classList.remove('has-active-card');
        }
      });

      // 4. Click opens full editorial case study with subtle scale transition
      card.addEventListener('click', (e) => {
        e.preventDefault();
        card.classList.add('is-expanding');
        setTimeout(() => {
          openCaseStudy(project.id);
          card.classList.remove('is-expanding');
        }, 120);
      });

      grid.appendChild(card);
    });
  }

  // Filter button handlers with silky transition
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.dataset.filter;
      if (selectedFilter === currentFilter || isTransitioning) return;

      audioFx.playClick();
      isTransitioning = true;
      currentFilter = selectedFilter;

      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      grid.classList.add('filtering');

      setTimeout(() => {
        renderProjects(selectedFilter);
        grid.classList.remove('filtering');
        isTransitioning = false;
      }, 180);
    });
  });

  renderProjects('ALL');

  // Case study dossier button listener
  const caseStudyBtn = document.getElementById('view-case-study-btn');
  if (caseStudyBtn) {
    caseStudyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCaseStudy(caseStudyBtn.dataset.projectId || 'thebullseye');
    });
  }
}

/* ==========================================================================
   4. SERVICES ACCORDION
   ========================================================================== */
function initServices() {
  const list = document.getElementById('services-list');
  if (!list) return;

  list.innerHTML = '';

  servicesData.forEach((service, idx) => {
    const row = document.createElement('div');
    row.className = `service-row ${idx === 0 ? 'open' : ''}`;

    row.innerHTML = `
      <div class="service-header">
        <div class="service-num">${service.number}</div>
        <div class="service-name">${service.name}</div>
        <div class="service-tagline">${service.tagline}</div>
        <div class="service-toggle-icon">+</div>
      </div>
      <div class="service-details">
        <div>
          <p class="service-desc">${service.description}</p>
          <ul class="capability-list">
            ${service.capabilities.map(cap => `<li class="capability-item">${cap}</li>`).join('')}
          </ul>
        </div>
        <div class="tools-box">
          <div class="tools-title">// TOOLCHAIN & STACK</div>
          <div class="tool-tags">
            ${service.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    row.querySelector('.service-header').addEventListener('click', () => {
      audioFx.playClick();
      const wasOpen = row.classList.contains('open');
      // Collapse others
      document.querySelectorAll('.service-row').forEach(r => r.classList.remove('open'));
      if (!wasOpen) {
        row.classList.add('open');
      }
    });

    list.appendChild(row);
  });
}

/* ==========================================================================
   5. HOW WE WORK (PROCESS)
   ========================================================================== */
function initProcess() {
  const grid = document.getElementById('process-grid');
  if (!grid) return;

  grid.innerHTML = '';

  processSteps.forEach(step => {
    const card = document.createElement('div');
    card.className = 'process-card';
    card.innerHTML = `
      <div class="process-number">${step.number}</div>
      <h3 class="process-title">${step.title}</h3>
      <div class="process-subtitle">${step.subtitle}</div>
      <p class="process-desc">${step.description}</p>
    `;
    grid.appendChild(card);
  });
}

/* ==========================================================================
   6. CLIENT TESTIMONIALS
   ========================================================================== */
function initTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = '';

  testimonials.forEach(item => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div>
        <div class="quote-mark">“</div>
        <p class="testimonial-text">${item.quote}</p>
      </div>
      <div class="testimonial-author">
        <div class="author-name">${item.author}</div>
        <div class="author-role">${item.role} // ${item.location}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ==========================================================================
   7. PLAYGROUND EXPERIMENTS & GENERATIVE CANVAS
   ========================================================================== */
function initPlayground() {
  const canvas = new PlaygroundCanvas('playground-canvas');

  const modeBtns = document.querySelectorAll('.canvas-mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playClick();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      canvas.setMode(btn.dataset.mode);
    });
  });

  const expGrid = document.getElementById('experiments-grid');
  if (expGrid) {
    expGrid.innerHTML = '';
    experiments.forEach(exp => {
      const card = document.createElement('div');
      card.className = 'experiment-card';
      card.innerHTML = `
        <div class="experiment-tag">${exp.tag}</div>
        <h4 class="experiment-title">${exp.title}</h4>
        <p class="experiment-desc">${exp.desc}</p>
      `;

      card.addEventListener('click', () => {
        audioFx.playGlitch();
        // Change canvas mode randomly or trigger visual burst
        const modes = ['ascii', 'wireframe', 'matrix'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];
        canvas.setMode(randomMode);
        modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === randomMode));
      });

      expGrid.appendChild(card);
    });
  }
}

/* ==========================================================================
   8. PROJECT CONFIGURATOR & TERMINAL
   ========================================================================== */
function initConfigurator() {
  const form = document.getElementById('project-inquiry-form');
  const budgetOptions = document.querySelectorAll('.budget-option');
  const terminalJson = document.getElementById('terminal-json-output');
  const terminalStatus = document.getElementById('terminal-status');

  let selectedBudget = '$50K - $100K';

  function updateTerminal(customStatus = 'READY_FOR_INPUT') {
    if (!terminalJson) return;

    const checkedBoxes = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value);
    const clientName = document.getElementById('client-name')?.value || 'ANONYMOUS_CLIENT';
    const clientEmail = document.getElementById('client-email')?.value || 'PENDING_INPUT';

    const payload = {
      system: "504LABS_TELEMETRY",
      status: customStatus,
      client: clientName,
      email: clientEmail,
      budget_tier: selectedBudget,
      selected_capabilities: checkedBoxes,
      timestamp: new Date().toISOString()
    };

    terminalJson.textContent = JSON.stringify(payload, null, 2);
  }

  budgetOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      audioFx.playClick();
      budgetOptions.forEach(b => b.classList.remove('active'));
      opt.classList.add('active');
      selectedBudget = opt.dataset.budget;
      updateTerminal();
    });
  });

  const checkboxes = document.querySelectorAll('input[name="services"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      audioFx.playClick();
      cb.closest('.brutalist-checkbox')?.classList.toggle('checked', cb.checked);
      updateTerminal();
    });
  });

  document.querySelectorAll('#client-name, #client-email').forEach(inp => {
    inp.addEventListener('input', () => updateTerminal());
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      audioFx.playGlitch();

      if (terminalStatus) {
        terminalStatus.textContent = 'TRANSMITTING_TELEMETRY...';
        terminalStatus.style.color = 'var(--accent-yellow)';
      }

      updateTerminal('DISPATCH_ENCRYPTED_OK');

      setTimeout(() => {
        if (terminalStatus) {
          terminalStatus.textContent = 'TRANSMISSION_CONFIRMED [SYS_01]';
        }
        alert('// 504LABS: BRIEF RECEIVED. A LEAD ARCHITECT WILL RESPOND WITHIN 24 HOURS.');
        form.reset();
        updateTerminal('STANDBY');
      }, 700);
    });
  }
}

/* ==========================================================================
   9. EDITORIAL PROJECT CASE STUDY SYSTEM (12-SECTION DOSSIER)
   ========================================================================== */
let currentCaseStudyId = null;

function initCaseStudy() {
  const overlay = document.getElementById('case-study-overlay');
  const closeBtn = document.getElementById('cs-close-btn');

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', () => closeCaseStudy());

  // Reading scroll progress tracker
  overlay.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('cs-scroll-progress');
    if (!scrollProgress) return;
    const maxScroll = overlay.scrollHeight - overlay.clientHeight;
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (overlay.scrollTop / maxScroll) * 100));
      scrollProgress.style.width = `${pct}%`;
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeCaseStudy();
    } else if (e.key === 'ArrowRight' && currentCaseStudyId) {
      const current = caseStudiesData[currentCaseStudyId];
      if (current && current.nextProject) {
        openCaseStudy(current.nextProject.id);
      }
    }
  });

  // Handle Hash on Load / Navigation
  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();
}

function checkUrlHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#case-study/')) {
    const pId = hash.replace('#case-study/', '');
    if (caseStudiesData[pId]) {
      openCaseStudy(pId, false);
    }
  }
}

function openCaseStudy(projectId, updateHash = true) {
  const data = caseStudiesData[projectId];
  if (!data) return;

  currentCaseStudyId = projectId;
  audioFx.playClick();

  const overlay = document.getElementById('case-study-overlay');
  const headerTitle = document.getElementById('cs-header-project-name');
  const liveLinkBtn = document.getElementById('cs-header-live-link');
  const contentContainer = document.getElementById('case-study-content');

  if (!overlay || !contentContainer) return;

  if (headerTitle) headerTitle.textContent = data.title;
  if (liveLinkBtn) {
    liveLinkBtn.href = data.liveUrl;
    liveLinkBtn.title = `Visit live ${data.title} website: ${data.displayUrl}`;
  }

  // Render 12 structured editorial sections
  contentContainer.innerHTML = renderCaseStudyHtml(data);

  // Wire Next Project button
  const nextCard = contentContainer.querySelector('.cs-next-card');
  if (nextCard) {
    nextCard.addEventListener('click', (e) => {
      e.preventDefault();
      const nextId = nextCard.dataset.nextId;
      if (nextId) {
        openCaseStudy(nextId);
      }
    });
  }

  // Show overlay & reset scroll
  overlay.scrollTop = 0;
  const scrollProgress = document.getElementById('cs-scroll-progress');
  if (scrollProgress) scrollProgress.style.width = '0%';

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (updateHash) {
    history.pushState(null, '', `#case-study/${projectId}`);
  }
}

function closeCaseStudy() {
  const overlay = document.getElementById('case-study-overlay');
  if (!overlay) return;

  audioFx.playClick();
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentCaseStudyId = null;

  if (window.location.hash.startsWith('#case-study/')) {
    history.pushState(null, '', '#work');
  }
}

function renderCaseStudyHtml(data) {
  return `
    <!-- 01 — MINIMAL CASE STUDY HERO -->
    <section class="cs-hero">
      <div class="cs-hero-top">
        <span class="cs-hero-number">// ${data.number}</span>
        <span class="cs-hero-status">[ ${data.meta.status} ]</span>
      </div>
      <h1 class="cs-hero-title">${data.title}</h1>
      <div class="cs-hero-category">${data.category}</div>
      <p class="cs-hero-oneliner">${data.oneLiner}</p>

      <div class="cs-hero-media">
        <img src="${data.heroImage}" alt="${data.title} Editorial Project Visual" class="cs-hero-img" loading="eager">
      </div>

      <div class="cs-hero-actions">
        <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="cs-live-btn" style="padding: 10px 20px; font-size: 0.8rem;">
          VISIT LIVE WEBSITE ↗
        </a>
      </div>
    </section>

    <!-- 02 — PROJECT META STRIP -->
    <section class="cs-meta-strip">
      <div class="cs-meta-cell">
        <div class="cs-meta-label">CLIENT</div>
        <div class="cs-meta-value">${data.meta.client}</div>
      </div>
      <div class="cs-meta-cell">
        <div class="cs-meta-label">INDUSTRY</div>
        <div class="cs-meta-value">${data.meta.industry}</div>
      </div>
      <div class="cs-meta-cell">
        <div class="cs-meta-label">SERVICES</div>
        <div class="cs-meta-value">${data.meta.services.join(' // ')}</div>
      </div>
      <div class="cs-meta-cell">
        <div class="cs-meta-label">YEAR</div>
        <div class="cs-meta-value">${data.meta.year}</div>
      </div>
      <div class="cs-meta-cell">
        <div class="cs-meta-label">STATUS</div>
        <div class="cs-meta-value" style="color: var(--accent-yellow); font-weight: 700;">${data.meta.status}</div>
      </div>
    </section>

    <!-- 03 — THE CHALLENGE -->
    <section class="cs-challenge-section">
      <div class="cs-split-left">
        <div class="cs-split-tag">// THE PROBLEM</div>
      </div>
      <div class="cs-split-right">
        <p>${data.challenge}</p>
      </div>
    </section>

    <!-- 04 — THE APPROACH -->
    <section class="cs-approach-section">
      <div class="cs-approach-eyebrow">// DESIGN PHILOSOPHY & ARCHITECTURE</div>
      <h2 class="cs-approach-headline">${data.approach.headline}</h2>
      <p class="cs-approach-summary">${data.approach.summary}</p>

      <div class="cs-annotations-grid">
        ${data.approach.annotations.map(ann => `
          <div class="cs-annotation-card">
            <span class="cs-ann-tag">${ann.tag}</span>
            <h3 class="cs-ann-title">${ann.title}</h3>
            <p class="cs-ann-desc">${ann.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 05 — DESIGN DIRECTION -->
    <section class="cs-direction-section">
      <div class="cs-section-header-bar">
        <h2 class="cs-section-title">DESIGN DIRECTION</h2>
        <span class="cs-section-badge">// 04 STRUCTURAL PILLARS</span>
      </div>
      <div class="cs-direction-grid">
        ${data.designDirection.map(dir => `
          <div class="cs-direction-card">
            <div class="cs-dir-num">${dir.number}</div>
            <h3 class="cs-dir-title">${dir.title}</h3>
            <div class="cs-dir-subtitle">${dir.subtitle}</div>
            <p class="cs-dir-desc">${dir.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 06 — FULL-WIDTH VISUAL -->
    <section class="cs-cinematic-section">
      <div class="cs-cinematic-frame">
        <img src="${data.fullWidthVisual.image}" alt="${data.title} Interface Full Width" class="cs-cinematic-img" loading="lazy">
        <div class="cs-cinematic-meta">
          <div>${data.fullWidthVisual.caption}</div>
          <div>${data.fullWidthVisual.telemetry}</div>
        </div>
      </div>
    </section>

    <!-- 07 — DETAIL SHOTS -->
    <section class="cs-details-section">
      <div class="cs-details-grid">
        ${data.detailShots.map((shot, idx) => `
          <div class="cs-detail-item ${idx % 2 === 1 ? 'offset-top' : ''}">
            <div class="cs-detail-media">
              <img src="${shot.image}" alt="${shot.title}" class="cs-detail-img" loading="lazy">
            </div>
            <div class="cs-detail-info">
              <span class="cs-detail-tag">// ${shot.number} UI DETAIL</span>
              <h3 class="cs-detail-title">${shot.title}</h3>
              <p class="cs-detail-desc">${shot.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 08 — MOBILE EXPERIENCE -->
    <section class="cs-mobile-section">
      <div class="cs-mobile-grid">
        <div>
          <div class="cs-mobile-tag">// RESPONSIVE TOUCH ARCHITECTURE</div>
          <h2 class="cs-mobile-heading">${data.mobileExperience.headline}</h2>
          <p class="cs-mobile-desc">${data.mobileExperience.desc}</p>
          <div class="cs-mobile-highlights">
            ${data.mobileExperience.highlights.map(h => `
              <div class="cs-highlight-item">
                <span style="color: var(--accent-yellow);">→</span>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="cs-mobile-visual">
          <img src="${data.fullWidthVisual.image}" alt="${data.title} Mobile Responsive Composition" loading="lazy">
        </div>
      </div>
    </section>

    <!-- 09 — BUILD / TECH STACK -->
    <section class="cs-build-section">
      <div class="cs-build-title">BUILT WITH</div>
      <div class="cs-tech-tags">
        ${data.techStack.map(tech => `
          <span class="cs-tech-badge">${tech}</span>
        `).join('')}
      </div>
    </section>

    <!-- 10 — THE RESULT -->
    <section class="cs-result-section">
      <div class="cs-result-tag">// THE RESULT</div>
      <div class="cs-result-statement">${data.result}</div>
    </section>

    <!-- 11 — LIVE PROJECT CTA -->
    <section class="cs-live-cta-section">
      <div class="cs-live-cta-left">
        <div>SEE IT</div>
        <div>IN THE WILD →</div>
        <div class="cs-live-cta-url">${data.displayUrl}</div>
      </div>
      <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="cs-live-cta-btn">
        <span>VISIT LIVE WEBSITE</span>
        <span>→</span>
      </a>
    </section>

    <!-- 12 — NEXT PROJECT LOOP -->
    <section class="cs-next-section">
      <div class="cs-next-card" data-next-id="${data.nextProject.id}">
        <div class="cs-next-info">
          <div class="cs-next-tag">NEXT PROJECT // ${data.nextProject.number}</div>
          <h2 class="cs-next-title">${data.nextProject.title}</h2>
          <div class="cs-next-cat">${data.nextProject.category}</div>
          <div class="cs-next-action">
            <span>VIEW CASE STUDY</span>
            <span class="cs-next-arrow">→</span>
          </div>
        </div>
        <div class="cs-next-preview">
          <img src="${data.nextProject.image}" alt="${data.nextProject.title} Preview" class="cs-next-preview-img" loading="lazy">
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   10. FOOTER NEWSLETTER FORM
   ========================================================================== */
function initFooterForm() {
  const form = document.getElementById('footer-newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      audioFx.playBeep(660, 0.1, 'sine');
      alert('// 504LABS: EMAIL REGISTERED TO TELEMETRY DISPATCH.');
      form.reset();
    });
  }
}
