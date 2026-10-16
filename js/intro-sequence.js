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

  let startTime = null;
  let rafId = null;
  let isCompleted = false;

  const DURATION_TOTAL = 2500; // 2.5 seconds total cinematic sequence

  function instantBypass() {
    isCompleted = true;
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

  // Fail-safe circuit breaker: guaranteed completion within 3.2s (disabled in holdIntro inspection mode)
  if (!holdIntro) {
    setTimeout(() => {
      if (!isCompleted) finishIntro();
    }, 3200);
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
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
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

    if (elapsed > 600) {
      const rotProgress = Math.min((elapsed - 600) / 1400, 1.0);
      const easedRot = easeOutCubic(rotProgress);
      rotSpeed1 = easedRot * 0.42;  // Outer ring rotation
      rotSpeed2 = -easedRot * 0.84; // Inner pinion rotation (2x counter-rotation)
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
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; // Cyan-blue indicator highlight
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

    // Reticle Crosshairs with Restrained Cyan Glow
    if (elapsed > 700) {
      const laserAlpha = Math.min((elapsed - 700) / 400, 0.65);
      ctx.strokeStyle = `rgba(56, 189, 248, ${laserAlpha})`;
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

    // Transition out at 1.9s - 2.5s (unless holdIntro is enabled for inspection)
    if (!holdIntro) {
      if (elapsed >= 1900 && !introEl.classList.contains('intro-transitioning')) {
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
