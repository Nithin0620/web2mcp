import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Navbar } from '@/components/nav/navbar';
import { AuthModal } from '@/components/auth/auth-modal';

export const metadata: Metadata = {
  title: 'Web2MCP — Turn Any Website into Live MCP Tools',
  description: 'Convert human-facing websites, booking portals, and registries into live, verified Model Context Protocol tools for AI agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased">
        <AuthProvider>
          {/* Navigation Header */}
          <Navbar />

          {/* Authentication Modal */}
          <AuthModal />

          {/* Main Content Area */}
          <main className="flex-1">{children}</main>

          {/* Global Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/60 py-10 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Web2MCP</span>
                </div>
                <span className="hidden sm:inline text-slate-700">·</span>
                <span>Powered by TinyFish Web Acquisition & Model Context Protocol (MCP)</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
                <Link href="/#features" className="hover:text-slate-200 transition-colors">
                  Features
                </Link>
                <Link href="/#how-it-works" className="hover:text-slate-200 transition-colors">
                  How It Works
                </Link>
                <Link href="/docs" className="hover:text-slate-200 transition-colors">
                  Documentation
                </Link>
                <Link href="/resources" className="hover:text-slate-200 transition-colors">
                  Resources
                </Link>
                <Link href="/pricing" className="hover:text-slate-200 transition-colors">
                  Pricing
                </Link>
              </div>

              <div className="flex items-center gap-4 text-slate-500">
                <span>Team 6th Floor · KS Nithin, Anuraj Upadhyay, Lalit Chandra</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
