/**
 * CoreShadow Portfolio Application Logic
 * Author: Mayank Bhatt (CodeStrikerMayank)
 */

(function () {
  'use strict';

  // --- Project Showcase Data (Verified Engineering Proofs) ---
  const PROJECTS = [
    {
      id: 'mineart',
      title: 'Mineart Creative Engine',
      category: 'Computer Graphics & Simulation',
      summary: 'Procedural voxel generation and real-time canvas rendering system combining lightweight 3D coordinate math with low-overhead canvas geometry rasterization.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank/Mineart',
      demo: '#',
      technologies: ['HTML5 Canvas', 'WebGL / 2D Math', 'JavaScript ES6+', 'Procedural Noise'],
      specs: {
        'Architecture': 'Entity-Component Architecture with Typed Arrays',
        'Frame Budget': '< 16.6ms Target (60 FPS solid)',
        'Storage Footprint': 'Zero external heavy libraries, pure algorithmic shaders',
        'Licensing': 'MIT Open Source'
      },
      deepDive: 'Mineart is an experimental creative engineering project exploring lightweight real-time voxel synthesis in the browser. It focuses on spatial partitioning, occlusion culling, and mathematical chunk generation without reliance on bloated 3D game engines.'
    },
    {
      id: 'safety-governance',
      title: 'AgentShield Zero-Trust Firewall',
      category: 'AI Security & Runtime Governance',
      summary: 'Active Model Context Protocol (MCP) interception firewall preventing catastrophic terminal commands, secret leaks, and race conditions across multi-agent AI coding sessions.',
      featured: true,
      repo: 'https://github.com/CodeStrikerMayank',
      demo: '#',
      technologies: ['TypeScript', 'Model Context Protocol', 'Node.js', 'Deterministic Gates'],
      specs: {
        'Interception Latency': '< 1.8ms per command evaluation',
        'Ruleset': '12 Secret Regex Invariants + Destructive Shell Interceptor',
        'Concurrency': 'Decentralized TTL Mesh File Locks',
        'Compatibility': 'Claude Desktop, Cursor, Antigravity, Windsurf'
      },
      deepDive: 'Engineered as a pre-execution safety hypervisor for autonomous coding agents. Evaluates shell commands against strict deterministic safety contracts, quarantine leaked API keys before persistence, and synchronizes overlapping file edits across multiple agent processes.'
    },
    {
      id: 'systems-compilers',
      title: 'CoreLex Bytecode Virtual Machine',
      category: 'Systems & Compilers',
      summary: 'Stack-based virtual machine and bytecode interpreter exploring instruction dispatch optimizations, register allocation, and garbage collection invariants.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank',
      demo: '#',
      technologies: ['C / C++', 'Assembly', 'Virtual Machines', 'Memory Profiling'],
      specs: {
        'Dispatch Style': 'Direct Threaded Code Dispatch',
        'Word Size': '64-bit Uniform Value Representation',
        'Memory Model': 'Generational Mark-Sweep Collector',
        'Status': 'Active Research & Benchmark Harness'
      },
      deepDive: 'CoreLex investigates minimal interpreter overheads on modern superscalar CPU architectures, analyzing branch prediction miss rates, cache locality of bytecode streams, and memory barrier synchronization.'
    },
    {
      id: 'algorithmic-viz',
      title: 'GraphTopology Visualizer',
      category: 'Algorithms & Data Structures',
      summary: 'High-density interactive graph network layout engine utilizing Barnes-Hut quadtree n-body force simulation to layout large topological graphs in real time.',
      featured: false,
      repo: 'https://github.com/CodeStrikerMayank',
      demo: '#',
      technologies: ['JavaScript', 'Canvas 2D', 'Barnes-Hut Simulation', 'Spatial Indexing'],
      specs: {
        'Complexity': 'O(N log N) N-body force calculation',
        'Capacity': 'Up to 5,000 live interactive graph nodes',
        'Physics': 'Verlet numerical integration with velocity damping',
        'Telemetry': 'Live FPS, node count, and potential energy calculation'
      },
      deepDive: 'Provides real-time topological analysis of complex software dependencies and network graphs with smooth hardware-accelerated 2D projection and spatial querying.'
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

  // --- Validated Contact Form ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

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

      // Generate mailto link as direct authentic fallback
      const mailtoUrl = `mailto:mayankbhatt9tha3@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `Message validated! Launching direct mail client to deliver your inquiry... If it does not open automatically, <a href="${mailtoUrl}" style="text-decoration: underline; color: inherit; font-weight: bold;">click here</a>.`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }

  // Print console branding signature
  console.log(
    '%c CoreShadow // Mayank Bhatt %c\nPrecision Engineering Portfolio & Research Systems\nGitHub: https://github.com/CodeStrikerMayank',
    'background: #111; color: #fff; font-weight: bold; padding: 4px 8px; border: 1px solid #333;',
    'color: #888; font-size: 11px;'
  );
})();
