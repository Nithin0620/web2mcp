'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, Zap, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const { user, authenticated, creditsRemaining, tier, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Docs', href: '/docs' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className="border-b border-[#E5EDF5] bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-[#533AFD] flex items-center justify-center text-white font-bold shadow-[0_2px_4px_rgba(83,58,253,0.25)] group-hover:bg-[#5452FB] transition-all">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#0A2540] flex items-center gap-1.5">
                Web2MCP
              </span>
              <span className="block text-[11px] text-[#50617A] -mt-0.5">
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
                      ? 'text-[#533AFD] bg-[#F8FAFD] font-semibold'
                      : 'text-[#3C4F69] hover:text-[#0A2540] hover:bg-[#F8FAFD]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Credits, Auth, CTA */}
        <div className="flex items-center gap-3">
          {/* Credits Badge */}
          {authenticated ? (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70 transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              title="Click to upgrade or add more credits"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining} credits</span>
              {tier !== 'free' && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-emerald-100 rounded-full font-bold">
                  {tier}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFD] text-[#533AFD] border border-[#D6D9FC] hover:bg-[#EEF2F6] transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              title="Guest mode: 3 free credits. Click to register for 10 free credits!"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining}/3 Free</span>
              <span className="hidden sm:inline text-[10px] text-[#533AFD] font-normal underline">
                +7 on signup
              </span>
            </button>
          )}

          {/* Authentication State */}
          {authenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-[#E5EDF5] hover:bg-[#F8FAFD] text-xs text-[#0A2540] font-medium transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              >
                <div className="h-5 w-5 rounded-full bg-[#D6D9FC] text-[#533AFD] flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#50617A]" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-[#E5EDF5] rounded-lg shadow-[0_13px_27px_-5px_rgba(50,50,93,0.15),0_8px_16px_-8px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#E5EDF5] text-xs">
                    <p className="font-semibold text-[#0A2540]">{user.name}</p>
                    <p className="text-[11px] text-[#50617A] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-xs text-[#3C4F69] hover:text-[#0A2540] hover:bg-[#F8FAFD] transition-colors"
                  >
                    Manage Plan & Billing
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
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
                className="text-xs font-semibold px-3 py-1.5 rounded-md text-[#3C4F69] hover:text-[#0A2540] hover:bg-[#F8FAFD] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-md bg-[#F8FAFD] hover:bg-[#EEF2F6] text-[#0A2540] transition-colors border border-[#E5EDF5] shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
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
