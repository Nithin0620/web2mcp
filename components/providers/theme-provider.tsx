'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [isCurtainFalling, setIsCurtainFalling] = useState(false);
  const [showFallbackCurtain, setShowFallbackCurtain] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('web2mcp-theme') as Theme | null;
      if (stored === 'dark') {
        setThemeState('dark');
        applyThemeClass('dark');
      } else {
        setThemeState('light');
        applyThemeClass('light');
      }
    } catch {
      // ignore
    }
    setIsMounted(true);
  }, []);

  const applyThemeClass = (targetTheme: Theme) => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  const executeThemeSwitch = (nextTheme: Theme) => {
    applyThemeClass(nextTheme);
    setThemeState(nextTheme);
    try {
      localStorage.setItem('web2mcp-theme', nextTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    // Check if View Transitions API is supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      setIsCurtainFalling(true);
      const transition = (document as any).startViewTransition(() => {
        executeThemeSwitch(nextTheme);
      });

      transition.finished.finally(() => {
        setIsCurtainFalling(false);
      });
      return;
    }

    // Fallback: Animated curtain sweep sheet for browsers without View Transitions API
    setIsCurtainFalling(true);
    setShowFallbackCurtain(true);

    setTimeout(() => {
      executeThemeSwitch(nextTheme);
    }, 320);

    setTimeout(() => {
      setShowFallbackCurtain(false);
      setIsCurtainFalling(false);
    }, 700);
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    executeThemeSwitch(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isMounted }}>
      {children}
      {/* Dynamic curtain glowing leading edge */}
      {isCurtainFalling && <div className="curtain-leading-edge" aria-hidden="true" />}
      {/* Fallback physical curtain sheet */}
      {showFallbackCurtain && (
        <div
          className={`curtain-sheet-fallback ${theme === 'dark' ? 'theme-to-light' : 'theme-to-dark'}`}
          aria-hidden="true"
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
