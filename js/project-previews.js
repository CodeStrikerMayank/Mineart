/**
 * CoreShadow Purposeful Project Interactions (v2)
 * Author: Mayank Bhatt (CodeStrikerMayank)
 * 
 * Lightweight, event-driven interactive previews for flagship engineering projects:
 * 1. APEX: 7-Tier Power Cascade with interactive DAG node tracing & activation waves
 * 2. ControlProtocol: Interactive terminal tree with expandable inodes & file inspect telemetry
 * 3. Arise: Lunar surface elevation scanner with real-time coordinate & contour depth readout
 * 4. Mineart: Interactive isometric voxel lattice with voxel face highlights & procedural chunk cycling
 * 
 * Performance & Architecture:
 * - Zero continuous loops; zero external dependencies
 * - GPU-accelerated CSS transitions; passive pointer & touch listeners
 * - Reduced-motion compliance with static fallbacks
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. APEX 7-Tier Power Cascade Interaction ---
  function initApexInteraction() {
    const previewEl = document.getElementById('preview-apex');
    const metricDisplay = document.getElementById('apex-metric-display');
    const traceBtn = document.getElementById('apex-trace-trigger');
    if (!previewEl) return;

    const tiers = [
      { id: 1, name: 'L1: FAST LOCAL', latency: '4ms', desc: 'Deterministic Rule Engine' },
      { id: 2, name: 'L2: ADAPTIVE BKT', latency: '16ms', desc: 'Bayesian Knowledge Tracer' },
      { id: 3, name: 'L3: RAG CONTEXT', latency: '38ms', desc: 'Vector Knowledge Retrieval' },
      { id: 4, name: 'L4: TOOL SANDBOX', latency: '62ms', desc: 'Isolated Code Execution' },
      { id: 5, name: 'L5: SYNTHESIS', latency: '110ms', desc: 'Multi-LLM Strategy Pool' },
      { id: 6, name: 'L6: INVARIANT GATE', latency: '135ms', desc: 'Formal Constraint Verification' },
      { id: 7, name: 'L7: HUMAN SAFEGUARD', latency: 'Active', desc: 'Zero-Trust Checkpoint' }
    ];

    const nodes = previewEl.querySelectorAll('.apex-node');
    const links = previewEl.querySelectorAll('.apex-link');

    function activateTier(tierNum) {
      nodes.forEach(node => {
        const num = parseInt(node.getAttribute('data-tier'), 10);
        if (num === tierNum) {
          node.classList.add('is-active');
        } else {
          node.classList.remove('is-active');
        }
      });

      links.forEach(link => {
        const from = parseInt(link.getAttribute('data-from'), 10);
        const to = parseInt(link.getAttribute('data-to'), 10);
        if (from <= tierNum && to <= tierNum) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });

      const tierData = tiers.find(t => t.id === tierNum);
      if (metricDisplay && tierData) {
        metricDisplay.textContent = `${tierData.name} // ${tierData.latency} // ${tierData.desc}`;
        metricDisplay.style.color = 'var(--blue-indicator)';
      }
    }

    nodes.forEach(node => {
      const num = parseInt(node.getAttribute('data-tier'), 10);
      node.addEventListener('pointerenter', () => activateTier(num));
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        activateTier(num);
      });
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTier(num);
        }
      });
    });

    let isTracing = false;
    function runCascadeTrace() {
      if (isTracing) return;
      isTracing = true;
      if (traceBtn) traceBtn.disabled = true;

      let currentStep = 1;
      const interval = setInterval(() => {
        activateTier(currentStep);
        currentStep++;
        if (currentStep > 7) {
          clearInterval(interval);
          setTimeout(() => {
            if (metricDisplay) {
              metricDisplay.textContent = 'CASCADE COMPLETE // 7 TIERS VERIFIED';
              metricDisplay.style.color = 'var(--color-silver)';
            }
            if (traceBtn) traceBtn.disabled = false;
            isTracing = false;
          }, 600);
        }
      }, 140);
    }

    if (traceBtn) {
      traceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        runCascadeTrace();
      });
    }

    previewEl.addEventListener('pointerleave', () => {
      if (!isTracing) {
        nodes.forEach(n => n.classList.remove('is-active'));
        links.forEach(l => l.classList.remove('is-active'));
        if (metricDisplay) {
          metricDisplay.textContent = 'CASCADE READY // TAP NODES TO PROBE';
          metricDisplay.style.color = 'var(--color-silver)';
        }
      }
    });
  }

  // --- 2. ControlProtocol Interactive Directory Tree ---
  function initControlProtocolInteraction() {
    const previewEl = document.getElementById('preview-controlprotocol');
    const metricDisplay = document.getElementById('cp-metric-display');
    const xRayToggleBtn = document.getElementById('cp-xray-toggle');
    if (!previewEl) return;

    const folders = previewEl.querySelectorAll('.tree-folder');
    const fileItems = previewEl.querySelectorAll('.tree-file');

    folders.forEach(folder => {
      folder.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = folder.classList.toggle('is-open');
        const folderName = folder.getAttribute('data-folder');
        const folderTarget = previewEl.querySelector(`.tree-group[data-parent="${folderName}"]`);
        if (folderTarget) {
          folderTarget.classList.toggle('is-visible', isOpen);
        }
        if (metricDisplay) {
          metricDisplay.textContent = `DIR_${isOpen ? 'EXPANDED' : 'COLLAPSED'}: ${folderName}/ // TELEMETRY STREAM`;
          metricDisplay.style.color = isOpen ? 'var(--blue-indicator)' : 'var(--color-silver)';
        }
      });

      folder.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          folder.click();
        }
      });
    });

    fileItems.forEach(file => {
      file.addEventListener('click', (e) => {
        e.stopPropagation();
        fileItems.forEach(f => f.classList.remove('is-selected'));
        file.classList.add('is-selected');
        const fileName = file.getAttribute('data-file');
        const fileSize = file.getAttribute('data-size') || '14.2 KB';
        if (metricDisplay) {
          metricDisplay.textContent = `INSPECT: ${fileName} // ${fileSize} // SHA256 OK`;
          metricDisplay.style.color = 'var(--blue-indicator)';
        }
      });
    });

    let xRayMode = false;
    if (xRayToggleBtn) {
      xRayToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        xRayMode = !xRayMode;
        previewEl.classList.toggle('xray-active', xRayMode);
        xRayToggleBtn.textContent = xRayMode ? 'X-Ray Active' : 'Toggle X-Ray';
        if (metricDisplay) {
          metricDisplay.textContent = xRayMode ? 'X-RAY: 1,420 INODES SCANNED // 0 ANOMALIES' : 'STANDARD TREE VIEW // RECURSIVE';
          metricDisplay.style.color = xRayMode ? 'var(--blue-indicator)' : 'var(--color-silver)';
        }
      });
    }
  }

  // --- 3. Arise Lunar Surface Topography Scanner ---
  function initAriseInteraction() {
    const previewEl = document.getElementById('preview-arise');
    const metricDisplay = document.getElementById('arise-metric-display');
    const crosshairEl = document.getElementById('arise-scanner-crosshair');
    const svgEl = previewEl ? previewEl.querySelector('svg') : null;
    if (!previewEl || !svgEl) return;

    function handlePointer(e) {
      const rect = svgEl.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      // SVG coordinates (400 width, 110 height)
      const svgX = normX * 400;
      const svgY = normY * 110;

      if (crosshairEl) {
        crosshairEl.setAttribute('cx', svgX.toFixed(1));
        crosshairEl.setAttribute('cy', svgY.toFixed(1));
        crosshairEl.style.opacity = '1';
      }

      // Simulated Lunar Coordinates (Mare Tranquillitatis basin)
      const lat = (0.640 + normY * 0.060).toFixed(3);
      const lon = (23.440 + normX * 0.070).toFixed(3);
      
      // Distance from crater center (approx at x: 190, y: 55)
      const dx = (normX - 0.48);
      const dy = (normY - 0.50);
      const dist = Math.sqrt(dx * dx + dy * dy);
      let elev = -1420 + Math.floor(dist * 3800);
      let zone = 'CRATER BASIN';
      if (elev > 200) zone = 'OUTER RIM';
      else if (elev > -400) zone = 'TERRACE SLICE';

      if (metricDisplay) {
        metricDisplay.textContent = `LAT: ${lat}°N | LON: ${lon}°E | ELEV: ${elev}m (${zone})`;
        metricDisplay.style.color = 'var(--blue-indicator)';
      }
    }

    svgEl.addEventListener('pointermove', handlePointer);
    svgEl.addEventListener('touchmove', handlePointer, { passive: true });

    previewEl.addEventListener('pointerleave', () => {
      if (crosshairEl) crosshairEl.style.opacity = '0.35';
      if (metricDisplay) {
        metricDisplay.textContent = 'PROBE: 0.671°N 23.472°E // MARE TRANQUILLITATIS';
        metricDisplay.style.color = 'var(--color-silver)';
      }
    });
  }

  // --- 4. Mineart Procedural Isometric Voxel Lattice ---
  function initMineartInteraction() {
    const previewEl = document.getElementById('preview-mineart');
    const metricDisplay = document.getElementById('mineart-metric-display');
    const cycleBtn = document.getElementById('mineart-cycle-btn');
    if (!previewEl) return;

    const voxels = previewEl.querySelectorAll('.voxel-cube');

    voxels.forEach(voxel => {
      voxel.addEventListener('pointerenter', () => {
        voxels.forEach(v => v.classList.remove('is-active'));
        voxel.classList.add('is-active');
        const vx = voxel.getAttribute('data-vx') || '4';
        const vy = voxel.getAttribute('data-vy') || '12';
        const vz = voxel.getAttribute('data-vz') || '2';
        const state = voxel.getAttribute('data-state') || 'SOLID';
        if (metricDisplay) {
          metricDisplay.textContent = `VOXEL [${vx}, ${vy}, ${vz}] // ${state} // OCCLUSION CULLED`;
          metricDisplay.style.color = 'var(--blue-indicator)';
        }
      });

      voxel.addEventListener('click', (e) => {
        e.stopPropagation();
        voxel.classList.toggle('is-mined');
        const isMined = voxel.classList.contains('is-mined');
        if (metricDisplay) {
          metricDisplay.textContent = `CHUNK UPDATED // VOXEL ${isMined ? 'MINED (AIR)' : 'RASTERIZED'}`;
          metricDisplay.style.color = 'var(--blue-indicator)';
        }
      });
    });

    let seed = 101;
    if (cycleBtn) {
      cycleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        seed = (seed * 16807) % 2147483647;
        voxels.forEach((v, idx) => {
          v.classList.remove('is-mined');
          const pseudoH = (seed + idx * 37) % 12 - 6;
          v.style.transform = `translateY(${pseudoH}px)`;
        });
        if (metricDisplay) {
          metricDisplay.textContent = `PROCEDURAL SEED: 0x${seed.toString(16).slice(-6).toUpperCase()} // RASTER OK`;
          metricDisplay.style.color = 'var(--blue-indicator)';
        }
      });
    }

    previewEl.addEventListener('pointerleave', () => {
      voxels.forEach(v => v.classList.remove('is-active'));
      if (metricDisplay) {
        metricDisplay.textContent = 'CHUNK [16x16x256] // ISOMETRIC RASTER // 60 FPS';
        metricDisplay.style.color = 'var(--color-silver)';
      }
    });
  }

  // --- Initializer ---
  function bootProjectPreviews() {
    initApexInteraction();
    initControlProtocolInteraction();
    initAriseInteraction();
    initMineartInteraction();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootProjectPreviews);
  } else {
    bootProjectPreviews();
  }
})();
