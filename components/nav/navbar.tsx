'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, Zap, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { ThemeToggle } from '@/components/nav/theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const { user, authenticated, creditsRemaining, tier, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navLinks = [
    ...(authenticated ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Docs', href: '/docs' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className="border-b border-[#E5EDF5] dark:border-[#1E293B] bg-white/90 dark:bg-[#0A0F1D]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-[#533AFD] flex items-center justify-center text-white font-bold shadow-[0_2px_4px_rgba(83,58,253,0.25)] group-hover:bg-[#5452FB] transition-all">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#0A2540] dark:text-white flex items-center gap-1.5">
                Web2MCP
              </span>
              <span className="block text-[11px] text-[#50617A] dark:text-[#94A3B8] -mt-0.5">
                Website → TinyFish + AI → MCP Tools
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('#'));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'text-[#533AFD] dark:text-[#A5B4FC] bg-[#F8FAFD] dark:bg-[#1E293B] font-semibold'
                      : 'text-[#3C4F69] dark:text-[#CBD5E1] hover:text-[#0A2540] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Credits, Auth, CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle (Curtain fall motion) */}
          <ThemeToggle />

          {/* Credits Badge */}
          {authenticated ? (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              title="Click to upgrade or add more credits"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining} credits</span>
              {tier !== 'free' && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-full font-bold">
                  {tier}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFD] dark:bg-[#1E293B] text-[#533AFD] dark:text-[#A5B4FC] border border-[#D6D9FC] dark:border-[#312E81] hover:bg-[#EEF2F6] dark:hover:bg-[#27354D] transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              title="Guest mode: 3 free credits. Click to register for 10 free credits!"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining}/3 Free</span>
              <span className="hidden sm:inline text-[10px] text-[#533AFD] dark:text-[#A5B4FC] font-normal underline">
                +7 on signup
              </span>
            </button>
          )}

          {/* Authentication State */}
          {authenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#111827] border border-[#E5EDF5] dark:border-[#1E293B] hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] text-xs text-[#0A2540] dark:text-white font-medium transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              >
                <div className="h-5 w-5 rounded-full bg-[#D6D9FC] dark:bg-[#312E81] text-[#533AFD] dark:text-[#A5B4FC] flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#50617A] dark:text-[#94A3B8]" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-[#E5EDF5] dark:border-[#1E293B] rounded-lg shadow-[0_13px_27px_-5px_rgba(50,50,93,0.15),0_8px_16px_-8px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#E5EDF5] dark:border-[#1E293B] text-xs">
                    <p className="font-semibold text-[#0A2540] dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-[#50617A] dark:text-[#94A3B8] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-xs font-semibold text-[#533AFD] dark:text-[#A5B4FC] hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-colors"
                  >
                    MCP Dashboard
                  </Link>

                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-xs text-[#3C4F69] dark:text-[#CBD5E1] hover:text-[#0A2540] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-colors"
                  >
                    Manage Plan & Billing
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold px-3 py-1.5 rounded-md text-[#3C4F69] dark:text-[#CBD5E1] hover:text-[#0A2540] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-md bg-[#F8FAFD] dark:bg-[#1E293B] hover:bg-[#EEF2F6] dark:hover:bg-[#27354D] text-[#0A2540] dark:text-white transition-colors border border-[#E5EDF5] dark:border-[#334155] shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Primary CTA */}
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md bg-[#533AFD] text-white hover:bg-[#5452FB] active:bg-[#4032C8] transition-all shadow-[0_2px_4px_rgba(83,58,253,0.25)]"
          >
            <Sparkles className="h-3.5 w-3.5" /> Generate Tools
          </Link>
        </div>
      </div>
    </header>
  );
}
