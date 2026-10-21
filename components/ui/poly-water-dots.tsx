'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  row: number;
  col: number;
}

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
}

export function PolyWaterDots() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid configuration
    const SPACING = 28; // Spacing between dots in pixels
    let points: Point[] = [];
    let cols = 0;
    let rows = 0;

    // Mouse tracking & momentum
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      active: false,
      lastMoveTime: 0,
    };

    // Expanding concentric water ripples (from hand wakes)
    const ripples: WaveRipple[] = [];
    let lastRippleTime = 0;

    // Theme check
    let isDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;

      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      points = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * SPACING;
          const originY = offsetY + r * SPACING;
          points.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            radius: 1.05,
            row: r,
            col: c,
          });
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (mouse.prevX !== -9999) {
        const dt = Math.max(16, now - mouse.lastMoveTime);
        mouse.vx = ((currentX - mouse.prevX) / dt) * 16;
        mouse.vy = ((currentY - mouse.prevY) / dt) * 16;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);

        // Spawn gentle circular water wake if moving fast enough
        if (mouse.speed > 3.0 && now - lastRippleTime > 90 && ripples.length < 12) {
          ripples.push({
            x: currentX,
            y: currentY,
            radius: 4,
            maxRadius: Math.min(220, 80 + mouse.speed * 10),
            strength: Math.min(1.2, mouse.speed * 0.1),
            speed: 3.0 + Math.min(2.0, mouse.speed * 0.15),
          });
          lastRippleTime = now;
        }
      }

      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      mouse.lastMoveTime = now;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.speed = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', initGrid);

    initGrid();

    // Physics parameters (Softened, fluid, non-distracting)
    const SPRING_K = 0.052; // Gentle elastic restoring tension
    const DAMPING = 0.895; // Viscous liquid damping
    const INFLUENCE_RADIUS = 135; // Cursor interaction field
    const INFLUENCE_RADIUS_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      // Decay mouse velocity
      mouse.vx *= 0.90;
      mouse.vy *= 0.90;
      mouse.speed *= 0.90;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.speed;
        ripple.strength *= 0.96;
        if (ripple.radius >= ripple.maxRadius || ripple.strength < 0.01) {
          ripples.splice(i, 1);
        }
      }

      // Update point physics
      const pointCount = points.length;
      for (let i = 0; i < pointCount; i++) {
        const p = points[i];

        // 1. Direct cursor displacement (Hand parting the water)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < INFLUENCE_RADIUS_SQ && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normX = dx / dist;
            const normY = dy / dist;
            const factor = (1 - dist / INFLUENCE_RADIUS);
            const repelForce = factor * factor * 3.4;

            p.vx += normX * repelForce;
            p.vy += normY * repelForce;

            // Momentum transfer (drag water along with hand motion)
            p.vx += mouse.vx * factor * 0.28;
            p.vy += mouse.vy * factor * 0.28;
          }
        }

        // 2. Ripple wave perturbations
        for (let j = 0; j < ripples.length; j++) {
          const r = ripples[j];
          const rx = p.x - r.x;
          const ry = p.y - r.y;
          const rDist = Math.hypot(rx, ry);
          const diff = Math.abs(rDist - r.radius);

          if (diff < 28 && rDist > 1) {
            const wave = Math.sin((diff / 28) * Math.PI) * r.strength;
            const progress = 1 - r.radius / r.maxRadius;
            const intensity = wave * progress * 1.3;
            p.vx += (rx / rDist) * intensity;
            p.vy += (ry / rDist) * intensity;
          }
        }

        // 3. Surface tension restoring spring
        const springX = (p.originX - p.x) * SPRING_K;
        const springY = (p.originY - p.y) * SPRING_K;

        // Apply damping & velocity
        p.vx = (p.vx + springX) * DAMPING;
        p.vy = (p.vy + springY) * DAMPING;

        p.x += p.vx;
        p.y += p.vy;
      }

      // 4. Render Poly Mesh Connecting Lines (Delicate poly net - faded)
      ctx.lineWidth = 0.45;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const p = points[idx];
          if (!p) continue;

          // Connect to right neighbor
          if (c < cols - 1) {
            const right = points[idx + 1];
            if (right) {
              const disp = Math.hypot(p.x - p.originX, p.y - p.originY) + Math.hypot(right.x - right.originX, right.y - right.originY);
              const alpha = Math.min(0.08, (isDark ? 0.025 : 0.018) + disp * 0.008);
              ctx.strokeStyle = isDark
                ? `rgba(99, 102, 241, ${alpha})`
                : `rgba(83, 58, 253, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(right.x, right.y);
              ctx.stroke();
            }
          }

          // Connect to bottom neighbor
          if (r < rows - 1) {
            const bottom = points[idx + cols];
            if (bottom) {
              const disp = Math.hypot(p.x - p.originX, p.y - p.originY) + Math.hypot(bottom.x - bottom.originX, bottom.y - bottom.originY);
              const alpha = Math.min(0.08, (isDark ? 0.025 : 0.018) + disp * 0.008);
              ctx.strokeStyle = isDark
                ? `rgba(99, 102, 241, ${alpha})`
                : `rgba(83, 58, 253, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(bottom.x, bottom.y);
              ctx.stroke();
            }
          }
        }
      }

      // 5. Render Dotted Particles (Liquid droplet grid - subtle & faded)
      for (let i = 0; i < pointCount; i++) {
        const p = points[i];
        const disp = Math.hypot(p.x - p.originX, p.y - p.originY);

        // Dot size swells dynamically when waving (gentle)
        const currentRadius = p.radius + Math.min(0.55, disp * 0.08);

        // Faded, non-distracting alpha modulation
        let alpha = isDark ? 0.13 : 0.09;
        let fillColor: string;

        if (disp > 0.4) {
          // Excited liquid state (soft shimmer)
          alpha = Math.min(0.38, (isDark ? 0.16 : 0.12) + disp * 0.035);
          fillColor = isDark
            ? `rgba(56, 189, 248, ${alpha})` // Soft radiant cyan in dark mode
            : `rgba(99, 102, 241, ${alpha})`; // Soft radiant indigo in light mode
        } else {
          // Resting state (subtle & calm)
          fillColor = isDark
            ? `rgba(129, 140, 248, ${alpha})`
            : `rgba(83, 58, 253, ${alpha})`;
        }

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', initGrid);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
    />
  );
}
