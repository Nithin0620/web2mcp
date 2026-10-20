import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Navbar } from '@/components/nav/navbar';
import { AuthModal } from '@/components/auth/auth-modal';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll';

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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-[#061B31] antialiased">
        <SmoothScrollProvider>
          <AuthProvider>
            {/* Navigation Header */}
            <Navbar />

            {/* Authentication Modal */}
            <AuthModal />

            {/* Main Content Area */}
            <main className="flex-1">{children}</main>

            {/* Global Stripe-Style Footer */}
            <footer className="border-t border-[#E5EDF5] bg-[#F8FAFD] py-12 text-xs text-[#50617A]">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-[#533AFD] flex items-center justify-center text-white">
                      <Shield className="h-3 w-3 fill-white" />
                    </div>
                    <span className="text-[#0A2540] font-semibold tracking-tight">Web2MCP</span>
                  </div>
                  <span className="hidden sm:inline text-[#CFD8E3]">·</span>
                  <span>Powered by TinyFish Web Acquisition & Model Context Protocol (MCP)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-[#50617A]">
                  <Link href="/#features" className="hover:text-[#533AFD] transition-colors">
                    Features
                  </Link>
                  <Link href="/#how-it-works" className="hover:text-[#533AFD] transition-colors">
                    How It Works
                  </Link>
                  <Link href="/docs" className="hover:text-[#533AFD] transition-colors">
                    Documentation
                  </Link>
                  <Link href="/resources" className="hover:text-[#533AFD] transition-colors">
                    Resources
                  </Link>
                  <Link href="/pricing" className="hover:text-[#533AFD] transition-colors">
                    Pricing
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-[#64748D]">
                  <span>Team 6th Floor · KS Nithin, Anuraj Upadhyay, Lalit Chandra</span>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
