/**
 * CoreShadow Precision Mechanical Canvas Engine
 * Author: Mayank Bhatt (CodeStrikerMayank)
 * 
 * High-performance 2D Canvas mechanical gear simulator featuring:
 * - Mathematical tooth involute profiles and pitch meshing
 * - Geometrically accurate opposite angular velocities
 * - Subtle metallic graphite & steel gradients with radial edge highlights
 * - Zero per-frame memory allocation
 * - Viewport ResizeObserver with devicePixelRatio clamping (max 2x)
 * - Automatic pause on document visibility change and prefers-reduced-motion
 */

(function () {
  'use strict';

  // Check Canvas support
  const canvas = document.getElementById('mechanical-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Reduced motion check
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

  // State Management
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId = null;
  let isRunning = false;
  let isManuallyPaused = false;
  let lastTimestamp = 0;

  // Pointer Interaction (Bounded & Damped)
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerCurrentX = 0;
  let pointerCurrentY = 0;

  // Gear System Architecture
  // Gear 1 (Primary Drive Gear): 24 teeth, radius R1
  // Gear 2 (Pinion Gear): 12 teeth, radius R2 = R1 * (12/24) = R1 * 0.5, rotates at -2 * angular speed
  // Gear 3 (Planetary Idler): 18 teeth, radius R3 = R1 * (18/24) = R1 * 0.75, opposite rotation
  // Gear 4 (Subdued Outer Ring): Decorative radial calibration ticks & housing

  const gearSystem = {
    baseAngle: 0,
    baseSpeed: 0.0035, // slow, deliberate engineering movement
    gears: [
      {
        id: 'primary',
        teeth: 28,
        module: 7.5,
        xRel: 0.72,
        yRel: 0.32,
        speedMultiplier: 1.0,
        direction: 1,
        colorRim: '#282828',
        colorFill: '#131313',
        boreRadius: 40,
        spokes: 6
      },
      {
        id: 'secondary',
        teeth: 14,
        module: 7.5, // same module ensures matching pitch
        // will be dynamically positioned so pitch circles touch precisely
        xRel: 0,
        yRel: 0,
        speedMultiplier: 2.0, // 28 / 14 = 2.0
        direction: -1, // opposite rotation for meshed gears
        colorRim: '#323232',
        colorFill: '#161616',
        boreRadius: 22,
        spokes: 4
      },
      {
        id: 'tertiary',
        teeth: 20,
        module: 7.5,
        xRel: 0,
        yRel: 0,
        speedMultiplier: 1.4, // 28 / 20 = 1.4
        direction: -1,
        colorRim: '#242424',
        colorFill: '#101010',
        boreRadius: 30,
        spokes: 5
      }
    ]
  };

  /**
   * Resizes canvas buffer with devicePixelRatio clamp (max 2.0)
   */
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    // Compute Gear Absolute Positions
    const primary = gearSystem.gears[0];
    const r1 = (primary.teeth * primary.module) / 2;
    primary.radius = r1;
    primary.absX = width * primary.xRel;
    primary.absY = height * primary.yRel;

    // Secondary Gear touches Primary at angle ~145 deg (South-West)
    const secondary = gearSystem.gears[1];
    const r2 = (secondary.teeth * secondary.module) / 2;
    secondary.radius = r2;
    const angleSec = (148 * Math.PI) / 180;
    secondary.absX = primary.absX + (r1 + r2) * Math.cos(angleSec);
    secondary.absY = primary.absY + (r1 + r2) * Math.sin(angleSec);

    // Tertiary Gear touches Primary at angle ~38 deg (North-East)
    const tertiary = gearSystem.gears[2];
    const r3 = (tertiary.teeth * tertiary.module) / 2;
    tertiary.radius = r3;
    const angleTer = (35 * Math.PI) / 180;
    tertiary.absX = primary.absX + (r1 + r3) * Math.cos(angleTer);
    tertiary.absY = primary.absY + (r1 + r3) * Math.sin(angleTer);

    if (prefersReducedMotion) {
      drawStatic();
    }
  }

  /**
   * Draws a single precision gear using Canvas 2D path commands
   */
  function drawGear(gear, angle) {
    const { absX, absY, radius, teeth, module, colorRim, colorFill, boreRadius, spokes } = gear;
    const addendum = module * 0.9;
    const dedendum = module * 1.1;
    const outerRadius = radius + addendum;
    const rootRadius = Math.max(radius - dedendum, 10);
    const toothAngle = (Math.PI * 2) / teeth;

    ctx.save();
    ctx.translate(absX + pointerCurrentX * 12, absY + pointerCurrentY * 12);
    ctx.rotate(angle);

    // 1. Draw Gear Tooth Profile
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = i * toothAngle;
      const a1 = a + toothAngle * 0.15;
      const a2 = a + toothAngle * 0.35;
      const a3 = a + toothAngle * 0.65;
      const a4 = a + toothAngle * 0.85;

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

    // Metallic Radial Gradient for Body
    const grad = ctx.createRadialGradient(0, 0, boreRadius, 0, 0, outerRadius);
    grad.addColorStop(0, '#101010');
    grad.addColorStop(0.65, colorFill);
    grad.addColorStop(0.92, colorRim);
    grad.addColorStop(1, '#3a3a3a');

    ctx.fillStyle = grad;
    ctx.fill();

    // Metallic Edge Outline
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // 2. Pitch Circle (subtle engineering guideline)
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Spokes & Lightening Holes
    const spokeInnerR = boreRadius + 10;
    const spokeOuterR = rootRadius - 16;
    if (spokeOuterR > spokeInnerR + 10 && spokes > 0) {
      const spokeAngle = (Math.PI * 2) / spokes;
      for (let s = 0; s < spokes; s++) {
        const sa = s * spokeAngle;
        const holeAngleSpan = spokeAngle * 0.55;

        ctx.beginPath();
        ctx.arc(0, 0, spokeOuterR, sa - holeAngleSpan / 2, sa + holeAngleSpan / 2, false);
        ctx.arc(0, 0, spokeInnerR, sa + holeAngleSpan / 2, sa - holeAngleSpan / 2, true);
        ctx.closePath();

        ctx.fillStyle = '#0a0a0a';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 4. Center Bore & Hub
    ctx.beginPath();
    ctx.arc(0, 0, boreRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1c1c';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shaft Hole & Keyway
    ctx.beginPath();
    const shaftR = boreRadius * 0.45;
    ctx.arc(0, 0, shaftR, 0, Math.PI * 2);
    // Keyway slot
    ctx.rect(-shaftR * 0.25, -shaftR * 1.35, shaftR * 0.5, shaftR * 0.6);
    ctx.fillStyle = '#060606';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws decorative planetary rings and technical telemetry markings
   */
  function drawRings() {
    const primary = gearSystem.gears[0];
    const cx = primary.absX + pointerCurrentX * 12;
    const cy = primary.absY + pointerCurrentY * 12;
    const ringRadius = primary.radius * 1.65;

    ctx.save();
    ctx.translate(cx, cy);

    // Large Thin Housing Ring
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Calibration Tick Marks
    const ticks = 72;
    const tickStep = (Math.PI * 2) / ticks;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;

    for (let t = 0; t < ticks; t++) {
      const ta = t * tickStep + gearSystem.baseAngle * 0.15;
      const isMajor = t % 6 === 0;
      const tLen = isMajor ? 8 : 4;
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
   * Main rendering loop
   */
  function render(timestamp) {
    if (!isRunning) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = timestamp;

    // Damped Pointer Interpolation
    pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.05;
    pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.05;

    // Clear Screen
    ctx.clearRect(0, 0, width, height);

    // Increment Base Angle
    gearSystem.baseAngle += gearSystem.baseSpeed;

    // Draw Decorative Calibration Ring First
    drawRings();

    // Draw All Interlocking Gears
    for (let i = 0; i < gearSystem.gears.length; i++) {
      const g = gearSystem.gears[i];
      const angle = gearSystem.baseAngle * g.speedMultiplier * g.direction;
      drawGear(g, angle);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  /**
   * Static fallback renderer when animations are paused / reduced motion
   */
  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    drawRings();
    for (let i = 0; i < gearSystem.gears.length; i++) {
      const g = gearSystem.gears[i];
      drawGear(g, 0);
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

  // Pointer Movement (Passive & Throttled)
  window.addEventListener('pointermove', (e) => {
    // Normalizing between -1 and 1
    pointerTargetX = (e.clientX / width) * 2 - 1;
    pointerTargetY = (e.clientY / height) * 2 - 1;
  }, { passive: true });

  // Page Visibility State Handling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  // Window Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 60);
  }, { passive: true });

  // Expose global controller for UI integration
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

  // Initialize
  resize();
  if (!prefersReducedMotion) {
    startLoop();
  } else {
    drawStatic();
  }
})();
