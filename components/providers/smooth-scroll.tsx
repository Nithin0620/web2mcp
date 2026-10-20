'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth delayed inertial scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smoothing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Smooth scroll for hash links (#features, #how-it-works)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/#')) {
        const hash = href.substring(2);
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -80, duration: 1.2 });
        }
      } else if (href && href.startsWith('#')) {
        const hash = href.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -80, duration: 1.2 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
