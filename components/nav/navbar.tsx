'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, Zap, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Web2MCP
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                  Live
                </span>
              </span>
              <span className="block text-[11px] text-slate-400 -mt-0.5">
                Website → TinyFish + AI → Live MCP Tools
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
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              title="Click to upgrade or add more credits"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining} credits</span>
              {tier !== 'free' && (
                <span className="text-[9px] uppercase px-1 py-0.2 bg-emerald-500/20 rounded font-bold">
                  {tier}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              title="Guest mode: 3 free credits. Click to register for 10 free credits!"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{creditsRemaining}/3 Free</span>
              <span className="hidden sm:inline text-[10px] text-blue-300 font-normal underline">
                +7 on signup
              </span>
            </button>
          )}

          {/* Authentication State */}
          {authenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-medium transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Manage Plan & Billing
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
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
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Primary CTA */}
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Sparkles className="h-3.5 w-3.5" /> Generate Tools
          </Link>
        </div>
      </div>
    </header>
  );
}
