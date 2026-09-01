import { studioData, portfolioProjects, servicesData, processSteps, testimonials, experiments } from './data/projects.js';
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
  initModal();
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
        <div class="card-media">
          <div class="card-img-wrapper">
            <img src="${project.image}" alt="${project.title} live interface preview" class="card-img" loading="${loadingAttr}">
          </div>
          <span class="card-tag" data-num="${project.number}">// ${project.number}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <div class="card-category">${project.subtitle}</div>
          <div class="card-action">
            <span class="cta-label">VIEW PROJECT</span>
            <span class="arrow" aria-hidden="true">→</span>
          </div>
        </div>
      `;

      // Micro-interactions on Card
      const tagEl = card.querySelector('.card-tag');
      const imgEl = card.querySelector('.card-img');

      // 1. Mouse move parallax pan on image
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

        const panX = Math.round(normX * 8); // max 8px shift
        const panY = Math.round(normY * 8); // max 8px shift

        card.style.setProperty('--pan-x', `${panX}px`);
        card.style.setProperty('--pan-y', `${panY}px`);
      });

      // 2. Mouse enter: transform number to // OPEN ↗ & handle editorial focus
      card.addEventListener('mouseenter', () => {
        if (tagEl) {
          tagEl.textContent = '// OPEN ↗';
        }
        grid.classList.add('has-active-card');
        card.classList.add('is-active');
      });

      // 3. Mouse leave: reset tag & parallax
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

      // 4. Click sound telemetry
      card.addEventListener('click', () => {
        audioFx.playClick();
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
    caseStudyBtn.addEventListener('click', () => {
      audioFx.playClick();
      openProjectModal(caseStudyBtn.dataset.projectId || 'thebullseye');
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
        terminalStatus.style.color = '#DFFF00';
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
   9. PROJECT QUICK-VIEW MODAL / DRAWER
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => closeModal());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = portfolioProjects.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-project-title');
  const bodyEl = document.getElementById('modal-content-body');

  if (!modal || !titleEl || !bodyEl) return;

  titleEl.textContent = `// PROJECT DOSSIER: ${project.title}`;

  bodyEl.innerHTML = `
    <div class="modal-media">
      <img src="${project.image}" alt="${project.title}">
    </div>

    <div class="modal-meta-grid">
      <div class="modal-meta-cell">
        <h5>CLIENT</h5>
        <p>${project.client}</p>
      </div>
      <div class="modal-meta-cell">
        <h5>YEAR</h5>
        <p>${project.year}</p>
      </div>
      <div class="modal-meta-cell">
        <h5>ROLE</h5>
        <p>${project.role}</p>
      </div>
      <div class="modal-meta-cell">
        <h5>LIVE URL</h5>
        <p><a href="${project.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-yellow); text-decoration: underline;">${project.url.replace('https://', '')} ↗</a></p>
      </div>
    </div>

    <div>
      <div class="modal-section-title">// BRIEF & OBJECTIVE</div>
      <p class="modal-desc-p">${project.description}</p>

      <div class="modal-section-title">// THE CHALLENGE</div>
      <p class="modal-desc-p">${project.challenge}</p>

      <div class="modal-section-title">// THE ARCHITECTURAL SOLUTION</div>
      <p class="modal-desc-p">${project.solution}</p>

      <div class="modal-section-title">// KEY DELIVERABLES</div>
      <ul class="capability-list" style="margin-bottom: 20px;">
        ${project.deliverables.map(d => `<li class="capability-item">${d}</li>`).join('')}
      </ul>

      <div class="modal-section-title">// IMPACT & METRICS</div>
      <p class="modal-desc-p" style="color: var(--accent-yellow); font-family: var(--font-mono); font-weight: bold;">
        ${project.metrics}
      </p>

      <div style="margin-top: 24px; border-top: 1px solid var(--border-subtle); padding-top: 20px; display: flex; gap: 14px; flex-wrap: wrap;">
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn-brutalist btn-primary" style="flex: 1; min-width: 220px; text-decoration: none; text-align: center;">
          LAUNCH LIVE WEBSITE ↗
        </a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  audioFx.playClick();
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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
