import type { Metadata } from 'next';
import Link from 'next/link';
import { Layers, Sparkles, Terminal, Shield } from 'lucide-react';
import './globals.css';

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
        {/* Navigation Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
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

            <nav className="flex items-center gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" /> Generate Tools
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/40 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Web2MCP · Powered by TinyFish Web Acquisition & Model Context Protocol (MCP)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Team 6th Floor · KS Nithin, Anuraj Upadhyay, Lalit Chandra</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
