/**
 * CoreShadow Cinematic Mechanical Intro Sequence
 * Author: Mayank Bhatt (CodeStrikerMayank)
 * 
 * Timeline Specifications:
 * - 0.0–0.6s: Mechanical chassis outline, concentric pitch circles, gear teeth outline fade in.
 * - 0.6–1.3s: Dual-ring counter-rotation engages, radial graduation ticks, cyan-blue telemetry sweep.
 * - 1.3–1.9s: CORESHADOW wordmark reveal, technical descriptor, specular light sweep line.
 * - 1.9–2.5s: Cinematic iris transition into hero, handoff to background mechanical canvas, hero stagger reveal.
 * 
 * Invariants:
 * - Plays only on first session entry or explicit ?intro=1 override.
 * - Direct hash links (#projects, #contact) bypass immediately without delay.
 * - Prefers-reduced-motion bypasses immediately.
 * - [ESC] key and on-screen button provide accessible instantaneous skip.
 * - 3.2s fail-safe circuit breaker guarantees full page access under all circumstances.
 */

(function () {
  'use strict';

  const introEl = document.getElementById('cinematic-intro');
  if (!introEl) return;

  const introCanvas = document.getElementById('intro-gear-canvas');
  const skipBtn = document.getElementById('intro-skip-btn');
  const mainContent = document.getElementById('main-content');
  const encoderTextEl = document.getElementById('intro-encoder-text');
  const sweepBeamEl = document.getElementById('intro-sweep-beam');

  let startTime = null;
  let rafId = null;
  let isCompleted = false;
  let activeScrambleRaf = null;
  let step1Started = false;
  let step2Started = false;
  const DURATION_TOTAL = 3800; // 3.8 seconds calibrated cinematic sequence
  const GLYPHS = '0123456789ABCDEF#_></[]*+=§%';

  const urlParams = new URLSearchParams(window.location.search);
  const forceIntro = urlParams.has('intro') || urlParams.has('replay_intro') || urlParams.has('intro_hold');
  const holdIntro = urlParams.has('intro_hold');
  const hasDirectHash = Boolean(window.location.hash && window.location.hash.length > 1);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem('coreshadow_intro_completed') === 'true';

  // Instant bypass policy
  if ((alreadySeen && !forceIntro) || (hasDirectHash && !forceIntro) || (prefersReduced && !forceIntro)) {
    instantBypass();
    return;
  }

  // Lock scroll during introductory sequence
  document.body.classList.add('intro-active');

  let ctx = null;
  if (introCanvas && introCanvas.getContext) {
    ctx = introCanvas.getContext('2d', { alpha: true });
  }

  function runTextEncoder(element, fromText, toText, duration, onComplete) {
    if (!element) return;
    if (activeScrambleRaf) {
      cancelAnimationFrame(activeScrambleRaf);
      activeScrambleRaf = null;
    }

    const start = performance.now();
    const maxLen = Math.max(fromText.length, toText.length);

    function frame(now) {
      if (isCompleted) return;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1.0);

      const resolvedCount = Math.floor(progress * (maxLen + 1));

      let result = '';
      for (let i = 0; i < maxLen; i++) {
        if (i < resolvedCount) {
          if (i < toText.length) {
            result += toText[i];
          }
        } else {
          if (i < toText.length && toText[i] === ' ') {
            result += ' ';
          } else {
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
      }

      element.textContent = result;

      if (progress < 1.0) {
        activeScrambleRaf = requestAnimationFrame(frame);
      } else {
        element.textContent = toText;
        activeScrambleRaf = null;
        if (onComplete) onComplete();
      }
    }

    activeScrambleRaf = requestAnimationFrame(frame);
  }

  function instantBypass() {
    isCompleted = true;
    if (activeScrambleRaf) {
      cancelAnimationFrame(activeScrambleRaf);
      activeScrambleRaf = null;
    }
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-finished');
    if (introEl) {
      introEl.style.display = 'none';
      introEl.setAttribute('aria-hidden', 'true');
    }
    sessionStorage.setItem('coreshadow_intro_completed', 'true');
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
  }

  function finishIntro() {
    if (isCompleted) return;
    isCompleted = true;

    if (activeScrambleRaf) {
      cancelAnimationFrame(activeScrambleRaf);
      activeScrambleRaf = null;
    }

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    introEl.classList.add('intro-fade-out');
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-finished');
    sessionStorage.setItem('coreshadow_intro_completed', 'true');

    setTimeout(() => {
      introEl.style.display = 'none';
      introEl.setAttribute('aria-hidden', 'true');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus({ preventScroll: true });
      }
    }, 550);
  }

  // Keyboard skip on Escape
  function handleKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      finishIntro();
    }
  }
  window.addEventListener('keydown', handleKeydown);

  if (skipBtn) {
    skipBtn.addEventListener('click', finishIntro);
  }

  // Fail-safe circuit breaker: guaranteed completion within 4.6s (disabled in holdIntro inspection mode)
  if (!holdIntro) {
    setTimeout(() => {
      if (!isCompleted) finishIntro();
    }, 4600);
  }

  // Setup canvas resolution
  let canvasSize = 560;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeIntroCanvas() {
    if (!introCanvas || !ctx) return;
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    canvasSize = Math.min(Math.max(viewportMin * 0.72, 320), 580);
    introCanvas.width = Math.floor(canvasSize * dpr);
    introCanvas.height = Math.floor(canvasSize * dpr);
    introCanvas.style.width = canvasSize + 'px';
    introCanvas.style.height = canvasSize + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  resizeIntroCanvas();
  window.addEventListener('resize', resizeIntroCanvas, { passive: true });

  // Kinematic Involute Teeth Calculation Helper
  function drawKinematicGear(centerX, centerY, radius, teeth, toothDepth, angle, strokeColor, fillColor) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    const step = (Math.PI * 2) / teeth;
    const rOuter = radius + toothDepth / 2;
    const rInner = radius - toothDepth / 2;

    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const a1 = a + step * 0.22;
      const a2 = a + step * 0.52;
      const a3 = a + step * 0.74;
      const aNext = (i + 1) * step;

      const x0 = Math.cos(a) * rInner;
      const y0 = Math.sin(a) * rInner;
      const x1 = Math.cos(a1) * rOuter;
      const y1 = Math.sin(a1) * rOuter;
      const x2 = Math.cos(a2) * rOuter;
      const y2 = Math.sin(a2) * rOuter;
      const x3 = Math.cos(a3) * rInner;
      const y3 = Math.sin(a3) * rInner;

      if (i === 0) {
        ctx.moveTo(x0, y0);
      } else {
        ctx.lineTo(x0, y0);
      }
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
    }
    ctx.closePath();

    if (fillColor) {
      const metalSheen = ctx.createRadialGradient(0, 0, rInner * 0.15, 0, 0, rOuter);
      metalSheen.addColorStop(0, 'rgba(85, 88, 96, 0.45)');
      metalSheen.addColorStop(0.35, 'rgba(38, 40, 45, 0.65)');
      metalSheen.addColorStop(0.85, 'rgba(22, 23, 26, 0.85)');
      metalSheen.addColorStop(1, 'rgba(12, 13, 15, 0.95)');
      ctx.fillStyle = metalSheen;
      ctx.fill();
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Milled lathe groove ring for machined metallic feel
    ctx.beginPath();
    ctx.arc(0, 0, (rInner + rOuter) / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Animation Loop
  function render(timestamp) {
    if (isCompleted) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION_TOTAL, 1.0);

    const center = canvasSize / 2;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // 0.0 - 0.6s: Chassis & Pitch Outlines Fade In
    const phase1Alpha = Math.min(elapsed / 600, 1.0);

    ctx.save();
    ctx.globalAlpha = phase1Alpha;

    // Outer Chassis Concentric Guide Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.94, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(center, center, center * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // Radial Degree Ticks (36 Ticks around circumference)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    const rTickOuter = center * 0.92;
    const rTickInnerMajor = center * 0.86;
    const rTickInnerMinor = center * 0.89;

    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const rIn = isMajor ? rTickInnerMajor : rTickInnerMinor;

      const x1 = center + Math.cos(rad) * rTickOuter;
      const y1 = center + Math.sin(rad) * rTickOuter;
      const x2 = center + Math.cos(rad) * rIn;
      const y2 = center + Math.sin(rad) * rIn;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 0.6s - 1.3s: Coordinated Mechanical Rotation Engages
    let rotSpeed1 = 0;
    let rotSpeed2 = 0;

    if (elapsed > 500) {
      const rotProgress = Math.min((elapsed - 500) / 2700, 1.0);
      const easedRot = easeOutCubic(rotProgress);
      rotSpeed1 = easedRot * 0.68;  // Outer ring rotation
      rotSpeed2 = -easedRot * 1.36; // Inner pinion rotation (2x counter-rotation)
    }

    // Outer Planetary Ring Gear (Teeth facing inward/outward)
    const outerGearR = center * 0.68;
    drawKinematicGear(
      center,
      center,
      outerGearR,
      32,
      14,
      rotSpeed1,
      'rgba(200, 200, 200, 0.45)',
      'rgba(18, 18, 18, 0.72)'
    );

    // Inner Mechanical Ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'; // Precision silver metallic highlight
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.46, 0, Math.PI * 2);
    ctx.stroke();

    // Central Sun Pinion Gear
    const innerGearR = center * 0.34;
    drawKinematicGear(
      center,
      center,
      innerGearR,
      16,
      11,
      rotSpeed2,
      'rgba(240, 240, 240, 0.75)',
      'rgba(24, 24, 24, 0.9)'
    );

    // Lathe Grooves & Central Core Hub
    ctx.fillStyle = 'rgba(12, 12, 12, 0.95)';
    ctx.beginPath();
    ctx.arc(center, center, center * 0.20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.stroke();

    // Reticle Crosshairs with Restrained Silver Specular Lines
    if (elapsed > 700) {
      const laserAlpha = Math.min((elapsed - 700) / 400, 0.45);
      ctx.strokeStyle = `rgba(255, 255, 255, ${laserAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      // Horizontal Reticle
      ctx.beginPath();
      ctx.moveTo(center - center * 0.75, center);
      ctx.lineTo(center + center * 0.75, center);
      ctx.stroke();

      // Vertical Reticle
      ctx.beginPath();
      ctx.moveTo(center, center - center * 0.75);
      ctx.lineTo(center, center + center * 0.75);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    ctx.restore();

    // Mechanical Text Encoder Scramble Sequence
    // Phase 1: Scramble into CORESHADOW at 500ms -> resolves at ~1050ms
    if (elapsed >= 500 && !step1Started) {
      step1Started = true;
      if (encoderTextEl) {
        encoderTextEl.classList.add('is-active');
        runTextEncoder(encoderTextEl, '__________', 'CORESHADOW', 550, () => {
          if (sweepBeamEl) {
            sweepBeamEl.classList.add('is-sweeping');
          }
        });
      }
    }

    // Phase 2: Dwells on CORESHADOW until 1850ms, then scrambles into MAYANK BHATT -> resolves at ~2400ms
    if (elapsed >= 1850 && !step2Started) {
      step2Started = true;
      if (encoderTextEl) {
        if (sweepBeamEl) {
          sweepBeamEl.classList.remove('is-sweeping');
          void sweepBeamEl.offsetWidth; // re-trigger beam sweep
          sweepBeamEl.classList.add('is-sweeping');
        }
        runTextEncoder(encoderTextEl, 'CORESHADOW', 'MAYANK BHATT', 550);
      }
    }

    // Phase 3: Dwells on MAYANK BHATT until 3200ms, then iris expands and transitions into hero
    if (!holdIntro) {
      if (elapsed >= 3200 && !introEl.classList.contains('intro-transitioning')) {
        introEl.classList.add('intro-transitioning');
      }

      if (elapsed >= DURATION_TOTAL) {
        finishIntro();
        return;
      }
    }

    rafId = requestAnimationFrame(render);
  }

  // Start sequence
  rafId = requestAnimationFrame(render);
})();
