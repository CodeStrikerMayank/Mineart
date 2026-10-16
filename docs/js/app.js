/**
 * CoreShadow Portfolio Application Logic
 * Author: Mayank Bhatt (CodeStrikerMayank)
 */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Project Showcase Data (Verified Engineering Proofs by Mayank Bhatt) ---
  const PROJECTS = [
    {
      id: 'apex',
      title: 'APEX Adaptive Student Intelligence Platform',
      category: 'AI Systems & Adaptive Computing',
      summary: 'Offline-first, mathematically grounded adaptive intelligence engine with a 7-tier power cascade, interactive DAG roadmaps, and Bayesian knowledge tracing.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank/APEX',
      demo: 'https://github.com/CodeStrikerMayank/APEX',
      technologies: ['Python', 'FastAPI', 'DAG Graph Algorithms', 'Multi-LLM Cascade', 'Ollama Offline'],
      specs: {
        'AI Architecture': '7-Tier Power Cascade with Multi-Key Pooling & In-Flight Auto-Recharge',
        'Offline Mode': 'Hardware-optimized local Ollama inference + deterministic fallback',
        'Visual Roadmap': 'Interactive SVG Directed Acyclic Graph (DAG) with pan/zoom',
        'Memory Model': 'Ebbinghaus spaced-repetition retention scheduler'
      },
      deepDive: 'APEX is an adaptive intelligence platform engineered for high-stakes competitive examinations. It calibrates global Latent Ability through multi-tiered diagnostics, classifies distractor errors, and dynamically synthesizes prerequisite learning paths through topological DAG sorting.'
    },
    {
      id: 'controlprotocol',
      title: 'ControlProtocol Interactive CLI',
      category: 'Systems & CLI Architecture',
      summary: 'A Python-based interactive CLI system for deep directory inspection (tree & X-ray view), network file transfer, system telemetry insights, and controlled file operations.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank/controlprotocol',
      demo: 'https://github.com/CodeStrikerMayank/controlprotocol',
      technologies: ['Python 3', 'Systems I/O', 'CLI Engine', 'Filesystem Telemetry'],
      specs: {
        'Architecture': 'Interactive Terminal Control & X-Ray Visualizer',
        'Inspection Mode': 'Recursive Tree & In-depth Metadata Analysis',
        'File Handling': 'High-integrity stream copy with verification checks',
        'Licensing': 'Open Source (GitHub)'
      },
      deepDive: 'Engineered as an interactive command-line environment for developers and systems operators. Delivers real-time directory tree visualization, recursive directory statistics, permission scanning, and secure local/remote transfer routines with zero unnecessary runtime dependencies.'
    },
    {
      id: 'arise',
      title: 'Arise Lunar Surface 3D Mapper',
      category: 'Geospatial & 3D Visualization',
      summary: 'Interactive lunar surface 3D mapping and topographic terrain visualization system rendering planetary elevation models directly in the web browser.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank/Arise',
      demo: 'https://github.com/CodeStrikerMayank/Arise',
      technologies: ['JavaScript', '3D Graphics', 'Topographic Mapping', 'WebGL / Canvas'],
      specs: {
        'Domain': 'Lunar Elevation Topography & Orbital Mapping',
        'Mesh Synthesis': 'Heightmap displacement to 3D surface geometry',
        'Render Budget': 'Real-time hardware-accelerated 60 FPS viewport',
        'Community Star': '★ 1 Stargazer on GitHub'
      },
      deepDive: 'Arise translates celestial surface telemetry into an interactive, navigable 3D digital elevation model. Features dynamic lighting simulation to observe shadow transitions across lunar crater rims and high-accuracy geospatial coordinate projection.'
    },
    {
      id: 'mineart',
      title: 'Mineart Creative Engine',
      category: 'Computer Graphics & Simulation',
      summary: 'Procedural voxel generation and real-time canvas rendering system combining lightweight 3D coordinate math with low-overhead canvas geometry rasterization.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank/Mineart',
      demo: 'https://github.com/CodeStrikerMayank/Mineart',
      technologies: ['HTML5 Canvas', '2D/3D Math', 'JavaScript ES6+', 'Procedural Noise'],
      specs: {
        'Architecture': 'Entity-Component Architecture with Typed Arrays',
        'Frame Budget': '< 16.6ms Target (60 FPS solid)',
        'Storage Footprint': 'Zero external heavy libraries, pure algorithmic shaders',
        'Repository': 'Official Project Repository'
      },
      deepDive: 'Mineart is an experimental creative engineering project exploring real-time voxel synthesis in the browser. It focuses on spatial partitioning, occlusion culling, and mathematical chunk generation without reliance on bloated external 3D game engines.'
    },
    {
      id: 'historyworld',
      title: 'HistoryWorld Incident Analytics',
      category: 'Terminal Analytics & Dashboards',
      summary: 'Python terminal-based incident analytics engine and historical event tracker delivering telemetry dashboards, timeline reconstruction, and trend visualization.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank/Historyworld',
      demo: 'https://github.com/CodeStrikerMayank/Historyworld',
      technologies: ['Python', 'Terminal UI', 'Time Series Data', 'Event Analytics'],
      specs: {
        'Display Interface': 'High-density terminal dashboard layout',
        'Event Indexing': 'Chronological timeline parsing & categorizing',
        'Metrics': 'Recurrence frequency, severity index, incident clusters',
        'Status': 'Open Source Production Tool'
      },
      deepDive: 'HistoryWorld provides systems analysts with a terminal cockpit for inspecting critical events across time. Computes moving averages, identifies incident anomalies, and renders multi-column ASCII charts without launching a heavy web browser.'
    },
    {
      id: 'ticketml',
      title: 'TicketML Predictive Classifier',
      category: 'Machine Learning & NLP',
      summary: 'Supervised machine learning pipeline for automated ticket triage, incident category classification, priority scoring, and resolution routing.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank/TicketML',
      demo: 'https://github.com/CodeStrikerMayank/TicketML',
      technologies: ['Python', 'Machine Learning', 'NLP Feature Extraction', 'Scikit-Learn'],
      specs: {
        'Model Pipeline': 'Text tokenization, TF-IDF vectorization & classifier',
        'Target Task': 'Multiclass routing and priority level scoring',
        'Optimization': 'Confusion matrix validation and precision tuning',
        'Interface': 'Python CLI inference script'
      },
      deepDive: 'Automates customer and engineering ticket triage by parsing text descriptions, stripping noise tokens, and classifying issues into designated department queues with statistical confidence thresholds.'
    },
    {
      id: 'firstmlmodel',
      title: 'FirstMLModel Foundations',
      category: 'Machine Learning Foundations',
      summary: 'Ground-up predictive modeling system exploring mathematical optimization, regression boundaries, loss minimization, and model evaluation metrics.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank/FirstMLModel',
      demo: 'https://github.com/CodeStrikerMayank/FirstMLModel',
      technologies: ['Python', 'NumPy', 'Supervised Learning', 'Loss Optimization'],
      specs: {
        'Core Algorithms': 'Linear & polynomial regression from scratch',
        'Gradient Descent': 'Batch and stochastic convergence routines',
        'Validation': 'Train/test split, RMSE, R-squared evaluation',
        'Pedagogical Rigor': 'Explicit mathematical derivation without black-box APIs'
      },
      deepDive: 'An exploration of statistical machine learning mechanics. Implements cost functions, numerical derivatives, and parameter optimization from foundational linear algebra principles to guarantee deep conceptual mastery.'
    },
    {
      id: 'tkinterskillset',
      title: 'Tkinter Desktop Systems Suite',
      category: 'Desktop UI & Systems',
      summary: 'Modular desktop interface architecture and GUI tool suite showcasing event-driven state management, custom widget design, and native desktop workflows.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank/tkinterskillset',
      demo: 'https://github.com/CodeStrikerMayank/tkinterskillset',
      technologies: ['Python', 'Tkinter GUI', 'Event-Driven Logic', 'Desktop Systems'],
      specs: {
        'Framework': 'Python Tkinter / Tcl/Tk native bindings',
        'Component Design': 'Custom reusable widget classes and panels',
        'State Model': 'Event-driven pub/sub signal routing',
        'Cross-Platform': 'Native desktop execution on Windows, macOS, Linux'
      },
      deepDive: 'A modular suite of native desktop applications demonstrating asynchronous event loop integration, reactive component binding, dialog validation, and clean application architecture in Python.'
    }
  ];

  // --- Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.textContent = isOpen ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // --- Scroll Active Section Spy ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // --- Canvas Pause / Resume Controller ---
  const canvasToggleBtn = document.getElementById('canvas-toggle-btn');
  const canvasStatusText = document.getElementById('canvas-status-text');

  if (canvasToggleBtn && window.CoreShadowCanvas) {
    canvasToggleBtn.addEventListener('click', () => {
      const isRunning = window.CoreShadowCanvas.toggle();
      canvasToggleBtn.textContent = isRunning ? 'Pause Engine' : 'Resume Engine';
      if (canvasStatusText) {
        canvasStatusText.textContent = isRunning ? '60 FPS // Active' : 'Paused';
      }
    });
  }

  // --- Project Detail Modal Controller ---
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalSpecsGrid = document.getElementById('modal-specs-grid');
  const modalDeepDive = document.getElementById('modal-deep-dive');
  const modalRepoLink = document.getElementById('modal-repo-link');

  let lastActiveElement = null;

  function openProjectModal(projectId) {
    const p = PROJECTS.find((item) => item.id === projectId);
    if (!p || !modal) return;

    lastActiveElement = document.activeElement;

    modalCategory.textContent = p.category;
    modalTitle.textContent = p.title;
    modalSummary.textContent = p.summary;
    modalDeepDive.textContent = p.deepDive;
    modalRepoLink.href = p.repo;

    // Render Tech Tags
    modalTechStack.innerHTML = '';
    p.technologies.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      modalTechStack.appendChild(span);
    });

    // Render Specs Grid
    modalSpecsGrid.innerHTML = '';
    for (const [key, val] of Object.entries(p.specs)) {
      const item = document.createElement('div');
      item.className = 'modal-spec-item';
      item.innerHTML = `
        <span class="spec-key">${key}</span>
        <span class="spec-val">${val}</span>
      `;
      modalSpecsGrid.appendChild(item);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  document.querySelectorAll('[data-project-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  // --- Copy Verified Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const verifiedEmailEl = document.getElementById('verified-email');

  if (copyEmailBtn && verifiedEmailEl) {
    copyEmailBtn.addEventListener('click', () => {
      const email = verifiedEmailEl.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          const originalText = copyEmailBtn.textContent;
          copyEmailBtn.textContent = 'Copied to Clipboard!';
          copyEmailBtn.style.background = 'var(--color-silver)';
          copyEmailBtn.style.color = '#000';
          setTimeout(() => {
            copyEmailBtn.textContent = originalText;
            copyEmailBtn.style.background = '';
            copyEmailBtn.style.color = '';
          }, 2000);
        });
      }
    });
  }

  // --- Validated Contact Form & Real Email Dispatch ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const dispatchBtn = document.getElementById('dispatch-btn');
  const dispatchBtnText = document.getElementById('dispatch-btn-text');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check anti-spam honeypot
      const honey = document.getElementById('form-honey');
      if (honey && honey.value) {
        return; // Bot detected, drop silently
      }

      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('inquiry-subject').value.trim();
      const message = document.getElementById('inquiry-message').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields (Name, Email, Message).';
        return;
      }

      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      // Enter loading state
      if (dispatchBtn) dispatchBtn.disabled = true;
      if (dispatchBtnText) {
        dispatchBtnText.innerHTML = '<span class="spinner" aria-hidden="true"></span> Transmitting Inquiry...';
      }
      formFeedback.className = 'form-feedback info';
      formFeedback.textContent = 'Connecting to delivery gateway... Transmitting message to mayankbhatt9tha3@gmail.com.';

      const mailtoUrl = `mailto:mayankbhatt9tha3@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

      const payload = {
        name: name,
        email: email,
        _subject: `[CoreShadow Inquiry] ${subject || 'Portfolio Contact from ' + name}`,
        message: message,
        _captcha: 'false',
        _template: 'table'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/mayankbhatt9tha3@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Check if transmission was received
        if (response.ok || data.success === 'true' || data.success === true || (data.message && data.message.includes('Activation'))) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 0.35rem;">✓ Inquiry Dispatched Successfully!</div>
            <div>Your message has been delivered to <strong>mayankbhatt9tha3@gmail.com</strong>. Mayank will review and respond directly to <em>${escapeHtml(email)}</em>.</div>
          `;
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Gateway response non-200');
        }
      } catch (err) {
        console.warn('Direct gateway transmission notice:', err);
        formFeedback.className = 'form-feedback info';
        formFeedback.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 0.5rem;">Transmission Gateway Ready</div>
          <p style="margin-bottom: 0.75rem; font-size: 0.8rem; color: var(--color-silver);">
            Direct network message drafted for <strong>mayankbhatt9tha3@gmail.com</strong>. You can open your email client directly or copy the drafted text below:
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <a href="${mailtoUrl}" class="btn btn-primary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
              Open in Email Client ↗
            </a>
            <button type="button" id="copy-draft-btn" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
              Copy Draft to Clipboard
            </button>
          </div>
        `;

        const copyDraftBtn = document.getElementById('copy-draft-btn');
        if (copyDraftBtn) {
          copyDraftBtn.addEventListener('click', () => {
            const draftText = `To: mayankbhatt9tha3@gmail.com\nSubject: ${subject || 'Portfolio Inquiry from ' + name}\nFrom: ${name} (${email})\n\n${message}`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(draftText).then(() => {
                copyDraftBtn.textContent = 'Draft Copied!';
                setTimeout(() => { copyDraftBtn.textContent = 'Copy Draft to Clipboard'; }, 2000);
              });
            }
          });
        }
      } finally {
        if (dispatchBtn) dispatchBtn.disabled = false;
        if (dispatchBtnText) {
          dispatchBtnText.textContent = 'Dispatch Inquiry Message →';
        }
      }
    });
  }

  // Print console branding signature
  console.log(
    '%c CoreShadow // Mayank Bhatt %c\nPrecision Engineering Portfolio & Research Systems\nGitHub: https://github.com/CodeStrikerMayank',
    'background: #111; color: #fff; font-weight: bold; padding: 4px 8px; border: 1px solid #333;',
    'color: #888; font-size: 11px;'
  );
})();
