/**
 * CoreShadow Precision Mechanical Canvas Engine (v2 - Cinematic Edition)
 * Author: Mayank Bhatt (CodeStrikerMayank)
 * 
 * High-performance 2D Canvas mechanical simulation featuring:
 * - Mathematical tooth involute profiles and pitch-circle meshing
 * - Verified relative gear ratio kinematics & tooth phase synchronization
 * - Directional metallic specular highlights & chamfered rim illumination
 * - Concentric lathe-turned metallic surface micro-textures
 * - Restrained scroll-linked vertical parallax & rotational inertia
 * - Soft-damped pointer depth on desktop; simplified single-loop on mobile
 * - Automatic visibility pause, reduced-motion fallback, and zero-allocation frame loop
 */

(function () {
  'use strict';

  const canvas = document.getElementById('mechanical-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Media & Device Capabilities
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = mediaQuery.matches;
  mediaQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      stopLoop();
      drawStatic();
    } else {
      startLoop();
    }
  });

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Viewport & State Management
  let width = 0;
  let height = 0;
  let dpr = 1;
  let isMobile = false;
  let animationFrameId = null;
  let isRunning = false;
  let isManuallyPaused = false;
  let lastTimestamp = 0;

  // Parallax & Inertia State
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerCurrentX = 0;
  let pointerCurrentY = 0;

  let scrollTargetY = 0;
  let scrollCurrentY = 0;

  // Kinematic System Definition
  // Module m = 7.5 mm pitch equivalent
  // Primary Drive (Gear 1): 28 teeth, R = 105px
  // Secondary Pinion (Gear 2): 14 teeth, R = 52.5px, Ratio = -2.0
  // Tertiary Idler (Gear 3): 21 teeth, R = 78.75px, Ratio = -1.3333
  const gearSystem = {
    baseAngle: 0,
    baseSpeed: 0.0028, // Deliberate, smooth engineering motion
    scrollRotFactor: 0.00045,
    gears: [
      {
        id: 'primary',
        teeth: 28,
        module: 7.5,
        xRel: 0.74,
        yRel: 0.28,
        speedMultiplier: 1.0,
        direction: 1,
        phaseOffset: 0,
        colorRim: '#303030',
        colorFill: '#141414',
        boreRadius: 42,
        spokes: 6
      },
      {
        id: 'secondary',
        teeth: 14,
        module: 7.5,
        xRel: 0,
        yRel: 0,
        speedMultiplier: 2.0, // 28 / 14
        direction: -1,
        phaseOffset: 0,
        contactAngle: (146 * Math.PI) / 180,
        colorRim: '#383838',
        colorFill: '#171717',
        boreRadius: 22,
        spokes: 4
      },
      {
        id: 'tertiary',
        teeth: 21,
        module: 7.5,
        xRel: 0,
        yRel: 0,
        speedMultiplier: 1.33333, // 28 / 21
        direction: -1,
        phaseOffset: 0,
        contactAngle: (34 * Math.PI) / 180,
        colorRim: '#2b2b2b',
        colorFill: '#121212',
        boreRadius: 32,
        spokes: 5
      }
    ]
  };

  /**
   * Recalculates canvas dimensions and pitch circle contact coordinates
   */
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    isMobile = width <= 768;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    // Primary Gear Positioning
    const primary = gearSystem.gears[0];
    const r1 = (primary.teeth * primary.module) / 2;
    primary.radius = r1;
    primary.absX = width * (isMobile ? 0.85 : primary.xRel);
    primary.absY = height * (isMobile ? 0.22 : primary.yRel);

    // Secondary Pinion Gear Contact Alignment
    const secondary = gearSystem.gears[1];
    const r2 = (secondary.teeth * secondary.module) / 2;
    secondary.radius = r2;
    const angSec = secondary.contactAngle;
    secondary.absX = primary.absX + (r1 + r2) * Math.cos(angSec);
    secondary.absY = primary.absY + (r1 + r2) * Math.sin(angSec);
    // Correct tooth phase offset for seamless interlocking
    secondary.phaseOffset = angSec * (1 + primary.teeth / secondary.teeth) + (Math.PI / secondary.teeth);

    // Tertiary Idler Gear Contact Alignment
    const tertiary = gearSystem.gears[2];
    const r3 = (tertiary.teeth * tertiary.module) / 2;
    tertiary.radius = r3;
    const angTer = tertiary.contactAngle;
    tertiary.absX = primary.absX + (r1 + r3) * Math.cos(angTer);
    tertiary.absY = primary.absY + (r1 + r3) * Math.sin(angTer);
    tertiary.phaseOffset = angTer * (1 + primary.teeth / tertiary.teeth) + (Math.PI / tertiary.teeth);

    if (prefersReducedMotion) {
      drawStatic();
    }
  }

  /**
   * Draws a precision tooth profile with directional metallic specular shading
   */
  function drawGear(gear, angle, parallaxX, parallaxY) {
    const { absX, absY, radius, teeth, module, colorRim, colorFill, boreRadius, spokes } = gear;
    const addendum = module * 0.88;
    const dedendum = module * 1.12;
    const outerRadius = radius + addendum;
    const rootRadius = Math.max(radius - dedendum, 12);
    const toothAngle = (Math.PI * 2) / teeth;

    const posX = absX + parallaxX;
    const posY = absY + parallaxY;

    ctx.save();
    ctx.translate(posX, posY);

    // 0. Soft Backing Drop Shadow for mechanical depth
    ctx.beginPath();
    ctx.arc(0, 8, outerRadius + 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    ctx.rotate(angle);

    // 1. Involute Tooth Geometry Profile
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = i * toothAngle;
      const a1 = a + toothAngle * 0.16;
      const a2 = a + toothAngle * 0.36;
      const a3 = a + toothAngle * 0.64;
      const a4 = a + toothAngle * 0.84;

      const x0 = Math.cos(a) * rootRadius;
      const y0 = Math.sin(a) * rootRadius;
      const x1 = Math.cos(a1) * rootRadius;
      const y1 = Math.sin(a1) * rootRadius;
      const x2 = Math.cos(a2) * outerRadius;
      const y2 = Math.sin(a2) * outerRadius;
      const x3 = Math.cos(a3) * outerRadius;
      const y3 = Math.sin(a3) * outerRadius;
      const x4 = Math.cos(a4) * rootRadius;
      const y4 = Math.sin(a4) * rootRadius;

      if (i === 0) {
        ctx.moveTo(x0, y0);
      } else {
        ctx.lineTo(x0, y0);
      }
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
    }
    ctx.closePath();

    // Metallic Body Radial Gradient
    const bodyGrad = ctx.createRadialGradient(0, 0, boreRadius * 0.8, 0, 0, outerRadius);
    bodyGrad.addColorStop(0, '#0e0e0e');
    bodyGrad.addColorStop(0.55, colorFill);
    bodyGrad.addColorStop(0.88, colorRim);
    bodyGrad.addColorStop(1.0, '#383838');

    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Chamfered Metallic Edge
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
    ctx.stroke();

    // 2. Fine Lathe Concentric Grooves (Machined Finish)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.beginPath();
    ctx.arc(0, 0, (rootRadius + boreRadius) * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, (rootRadius + boreRadius) * 0.68, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Pitch Circle Engineering Marker
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Weight-Reduction Spokes & Lightening Voids
    const spokeInnerR = boreRadius + 9;
    const spokeOuterR = rootRadius - 15;
    if (spokeOuterR > spokeInnerR + 8 && spokes > 0) {
      const spokeAngle = (Math.PI * 2) / spokes;
      for (let s = 0; s < spokes; s++) {
        const sa = s * spokeAngle;
        const voidSpan = spokeAngle * 0.54;

        ctx.beginPath();
        ctx.arc(0, 0, spokeOuterR, sa - voidSpan / 2, sa + voidSpan / 2, false);
        ctx.arc(0, 0, spokeInnerR, sa + voidSpan / 2, sa - voidSpan / 2, true);
        ctx.closePath();

        ctx.fillStyle = '#070707';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 5. Hub Collar & Fastener Bolt Ring
    ctx.beginPath();
    ctx.arc(0, 0, boreRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1c1c';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center Bore & Spline Keyway
    ctx.beginPath();
    const shaftR = boreRadius * 0.44;
    ctx.arc(0, 0, shaftR, 0, Math.PI * 2);
    ctx.rect(-shaftR * 0.22, -shaftR * 1.35, shaftR * 0.44, shaftR * 0.6);
    ctx.fillStyle = '#050505';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws decorative telemetry housing and calibration rings
   */
  function drawRings(parallaxX, parallaxY) {
    const primary = gearSystem.gears[0];
    const cx = primary.absX + parallaxX;
    const cy = primary.absY + parallaxY;
    const ringRadius = primary.radius * 1.62;

    ctx.save();
    ctx.translate(cx, cy);

    // Planetary Outer Frame Ring
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner Reference Track
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius - 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.stroke();

    // Precision Vernier Calibration Ticks
    const ticks = 72;
    const tickStep = (Math.PI * 2) / ticks;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;

    for (let t = 0; t < ticks; t++) {
      const ta = t * tickStep + gearSystem.baseAngle * 0.12;
      const isMajor = t % 6 === 0;
      const tLen = isMajor ? 9 : 4;
      const rInner = ringRadius - tLen;
      const rOuter = ringRadius;

      ctx.beginPath();
      ctx.moveTo(Math.cos(ta) * rInner, Math.sin(ta) * rInner);
      ctx.lineTo(Math.cos(ta) * rOuter, Math.sin(ta) * rOuter);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Main Controlled Animation Loop
   */
  function render(timestamp) {
    if (!isRunning) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.08);
    lastTimestamp = timestamp;

    // Smooth Parallax Interpolation
    if (!isTouchDevice && !isMobile) {
      pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.05;
      pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.05;
    } else {
      pointerCurrentX = 0;
      pointerCurrentY = 0;
    }

    // Scroll Damping
    scrollCurrentY += (scrollTargetY - scrollCurrentY) * 0.08;

    // Clear Canvas Viewport
    ctx.clearRect(0, 0, width, height);

    // Compute Base Velocity & Scroll Inertia
    const scrollInertia = (scrollTargetY - scrollCurrentY) * gearSystem.scrollRotFactor;
    gearSystem.baseAngle += gearSystem.baseSpeed + scrollInertia;

    // Coordinate Parallax Offsets (Restrained & Architectural)
    const parallaxX = pointerCurrentX * 8;
    const parallaxY = pointerCurrentY * 8 - (scrollCurrentY * 0.07);

    // 1. Draw Housing Ring & Vernier Ticks
    drawRings(parallaxX, parallaxY);

    // 2. Draw Mechanical Interlocking Gears
    const activeGearsCount = isMobile ? 1 : gearSystem.gears.length;
    for (let i = 0; i < activeGearsCount; i++) {
      const g = gearSystem.gears[i];
      const gearAngle = (gearSystem.baseAngle * g.speedMultiplier * g.direction) + g.phaseOffset;
      drawGear(g, gearAngle, parallaxX, parallaxY);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  /**
   * Static Fallback Renderer (Reduced Motion / Power Save)
   */
  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    drawRings(0, 0);
    const activeGearsCount = isMobile ? 1 : gearSystem.gears.length;
    for (let i = 0; i < activeGearsCount; i++) {
      const g = gearSystem.gears[i];
      drawGear(g, g.phaseOffset, 0, 0);
    }
  }

  function startLoop() {
    if (isRunning || prefersReducedMotion || isManuallyPaused) return;
    isRunning = true;
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(render);
  }

  function stopLoop() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Pointer Interaction (Desktop Only, Clamped & Damped)
  if (!isTouchDevice) {
    window.addEventListener('pointermove', (e) => {
      pointerTargetX = (e.clientX / width) * 2 - 1;
      pointerTargetY = (e.clientY / height) * 2 - 1;
    }, { passive: true });
  }

  // Scroll Tracking for Vertical Parallax
  window.addEventListener('scroll', () => {
    scrollTargetY = window.scrollY || window.pageYOffset || 0;
  }, { passive: true });

  // Page Visibility State Handling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  // Window Resize Debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 60);
  }, { passive: true });

  // Global Engine Controls for Telemetry Panel
  window.CoreShadowCanvas = {
    toggle: function () {
      isManuallyPaused = !isManuallyPaused;
      if (isManuallyPaused) {
        stopLoop();
        drawStatic();
      } else {
        startLoop();
      }
      return !isManuallyPaused;
    },
    isPaused: function () {
      return isManuallyPaused || prefersReducedMotion;
    }
  };

  // Initial Boot
  resize();
  scrollTargetY = window.scrollY || 0;
  scrollCurrentY = scrollTargetY;

  if (!prefersReducedMotion) {
    startLoop();
  } else {
    drawStatic();
  }
})();
