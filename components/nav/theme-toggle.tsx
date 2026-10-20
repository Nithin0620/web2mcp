'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Render neutral placeholder before mounting to avoid layout shifts / hydration issues
  if (!isMounted) {
    return (
      <div
        className={`h-8 w-8 rounded-md border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#111827] opacity-60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] hover:border-[#CFD8E3] dark:hover:border-[#334155] shadow-[0_1px_2px_rgba(50,50,93,0.04)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#533AFD]/40 group ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Curtain fall: Switch to Light' : 'Curtain fall: Switch to Dark'}
    >
      {/* Sun icon for light mode (visible when dark) */}
      <Sun
        className={`h-4 w-4 text-amber-500 transition-all duration-300 transform ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 absolute'
        }`}
      />

      {/* Moon icon for dark mode (visible when light) */}
      <Moon
        className={`h-4 w-4 text-[#533AFD] transition-all duration-300 transform ${
          isDark
            ? '-rotate-90 scale-0 opacity-0 absolute'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
