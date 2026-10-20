'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-in' | 'scale-up' | 'slide-right' | 'slide-left';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getInitialStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'fade-up':
        return {
          opacity: 0,
          transform: 'translateY(36px)',
        };
      case 'fade-down':
        return {
          opacity: 0,
          transform: 'translateY(-36px)',
        };
      case 'fade-in':
        return {
          opacity: 0,
        };
      case 'scale-up':
        return {
          opacity: 0,
          transform: 'scale(0.92)',
        };
      case 'slide-right':
        return {
          opacity: 0,
          transform: 'translateX(-36px)',
        };
      case 'slide-left':
        return {
          opacity: 0,
          transform: 'translateX(36px)',
        };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimatedStyle = (): React.CSSProperties => ({
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1)',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  });

  return (
    <div
      ref={ref}
      style={isVisible ? getAnimatedStyle() : { ...getInitialStyle(), transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)` }}
      className={className}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  staggerInterval = 100,
  className = '',
}: {
  children: React.ReactNode;
  staggerInterval?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <Reveal delay={index * staggerInterval} animation="fade-up">
            {child}
          </Reveal>
        );
      })}
    </div>
  );
}
