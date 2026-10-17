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
  const introSubtitleEl = document.getElementById('intro-subtitle');

  let startTime = null;
  let rafId = null;
  let isCompleted = false;
  let activeScrambleRaf = null;
  let step1Started = false;
  let sweepStarted = false;
  const DURATION_TOTAL = 2600; // Calibrated 2.6s cinematic mechanical sequence (2–3s target)
  const GLYPHS = '0123456789ABCDEF#_></[]*+=§%';

  const urlParams = new URLSearchParams(window.location.search);
  const skipIntro = urlParams.get('intro') === '0' || urlParams.has('skip_intro');
  const forceIntro = !skipIntro && (urlParams.get('intro') === '1' || urlParams.has('replay_intro') || urlParams.has('intro_hold'));
  const holdIntro = urlParams.has('intro_hold');
  const hasDirectHash = Boolean(window.location.hash && window.location.hash.length > 1);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem('coreshadow_intro_completed') === 'true';

  // Instant bypass policy
  if (skipIntro || (alreadySeen && !forceIntro) || (hasDirectHash && !forceIntro) || (prefersReduced && !forceIntro)) {
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

      // Controlled linear glyph resolution without indefinite random cycling
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

  // Fail-safe circuit breaker: guaranteed completion within 3.4s (disabled in holdIntro inspection mode)
  if (!holdIntro) {
    setTimeout(() => {
      if (!isCompleted) finishIntro();
    }, 3400);
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

  // Animation Loop
  function render(timestamp) {
    if (isCompleted) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION_TOTAL, 1.0);

    const center = canvasSize / 2;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // 1. Fade in dark instrument-like background & concentric guide rings
    const phase1Alpha = Math.min(elapsed / 450, 1.0);

    ctx.save();
    ctx.globalAlpha = phase1Alpha;

    // Outer Chassis Concentric Guide Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.94, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(center, center, center * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // Radial Degree Calibration Marks (36 Ticks around circumference)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
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

    // 2. Coordinated Kinematic Multi-Gear Rotation
    let rotSpeed1 = 0;
    let rotSpeed2 = 0;
    let rotSpeed3 = 0;

    if (elapsed > 400) {
      const rotProgress = Math.min((elapsed - 400) / 2000, 1.0);
      const easedRot = easeOutCubic(rotProgress);
      rotSpeed1 = easedRot * 0.72;   // Outer planetary ring (clockwise)
      rotSpeed2 = -easedRot * 1.44;  // Intermediate ring (counter-clockwise, 2x)
      rotSpeed3 = easedRot * 2.16;   // Sun pinion (clockwise, 3x)
    }

    // Outer Planetary Ring Gear
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

    // Intermediate Pitch Circle Track
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.48, 0, Math.PI * 2);
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

    // Core Hub & Spline Keyway
    ctx.fillStyle = 'rgba(12, 12, 12, 0.95)';
    ctx.beginPath();
    ctx.arc(center, center, center * 0.20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.stroke();

    // Precision Reticle Crosshairs with restrained silver specular lines
    if (elapsed > 550) {
      const laserAlpha = Math.min((elapsed - 550) / 400, 0.45);
      ctx.strokeStyle = `rgba(255, 255, 255, ${laserAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      ctx.beginPath();
      ctx.moveTo(center - center * 0.75, center);
      ctx.lineTo(center + center * 0.75, center);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(center, center - center * 0.75);
      ctx.lineTo(center, center + center * 0.75);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Radial Metallic Sweep Highlight (occurs when wordmark resolves ~1100ms)
    if (elapsed > 1100 && elapsed < 2000) {
      const sweepProgress = (elapsed - 1100) / 900;
      const sweepAngle = -Math.PI * 0.5 + (sweepProgress * Math.PI * 2);
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(sweepAngle);
      const sweepGradient = ctx.createLinearGradient(0, 0, outerGearR * 1.1, 0);
      sweepGradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      sweepGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = sweepGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(innerGearR * 0.5, 0);
      ctx.lineTo(outerGearR * 1.05, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // 3. Controlled Character Scramble & Wordmark Resolution
    if (elapsed >= 450 && !step1Started) {
      step1Started = true;
      if (encoderTextEl) {
        encoderTextEl.classList.add('is-active');
        // Resolves cleanly from glyphs into CORESHADOW over 600ms
        runTextEncoder(encoderTextEl, '__________', 'CORESHADOW', 600, () => {
          if (sweepBeamEl) {
            sweepBeamEl.classList.add('is-sweeping');
          }
          if (introSubtitleEl) {
            introSubtitleEl.classList.add('is-visible');
          }
        });
      }
    }

    // 4. Transition into Hero (Visual Continuity Handoff)
    if (!holdIntro) {
      if (elapsed >= 2100 && !introEl.classList.contains('intro-transitioning')) {
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
