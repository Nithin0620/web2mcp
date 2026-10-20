'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { X, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync tab with context when modal opens
  React.useEffect(() => {
    setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (tab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Login failed');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name');
        setSubmitting(false);
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white border border-[#E5EDF5] rounded-xl shadow-[0_20px_40px_-15px_rgba(50,50,93,0.25),0_10px_20px_-10px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-[#061B31] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#50617A] hover:text-[#0A2540] hover:bg-[#F8FAFD] transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] text-[#533AFD] mb-3 shadow-[0_1px_2px_rgba(50,50,93,0.05)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">
            {tab === 'login' ? 'Welcome Back to Web2MCP' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-[#50617A] mt-1">
            {tab === 'login'
              ? 'Sign in to access your projects, evidence vault, and credits.'
              : 'Sign up to immediately unlock 10 free MCP tool generations.'}
          </p>
        </div>

        {/* Free Credits Highlight Banner */}
        {tab === 'register' && (
          <div className="mb-6 p-3 rounded-lg bg-[#F8FAFD] border border-[#D6D9FC] flex items-center gap-2.5 text-xs text-[#3C4F69]">
            <ShieldCheck className="h-4 w-4 text-[#533AFD] shrink-0" />
            <span>
              <strong className="text-[#0A2540]">10 Free Credits:</strong> Guest users get 3, registered accounts receive 10 free MCP generations.
            </span>
          </div>
        )}

        {/* Tabs switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#F8FAFD] rounded-lg border border-[#E5EDF5] mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-2 rounded-md transition-all ${
              tab === 'login'
                ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(50,50,93,0.08)]'
                : 'text-[#50617A] hover:text-[#0A2540]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`py-2 rounded-md transition-all ${
              tab === 'register'
                ? 'bg-[#533AFD] text-white shadow-[0_1px_2px_rgba(83,58,253,0.25)]'
                : 'text-[#50617A] hover:text-[#0A2540]'
            }`}
          >
            Register (10 Free)
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#0A2540] mb-1.5">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EDF5] rounded-md text-xs text-[#061B31] placeholder:text-[#94A3B8] shadow-[0_1px_2px_rgba(50,50,93,0.04)] focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#5452FB]/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#0A2540] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EDF5] rounded-md text-xs text-[#061B31] placeholder:text-[#94A3B8] shadow-[0_1px_2px_rgba(50,50,93,0.04)] focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#5452FB]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0A2540] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EDF5] rounded-md text-xs text-[#061B31] placeholder:text-[#94A3B8] shadow-[0_1px_2px_rgba(50,50,93,0.04)] focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#5452FB]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#533AFD] hover:bg-[#5452FB] active:bg-[#4032C8] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_2px_4px_rgba(83,58,253,0.25)]"
          >
            {submitting ? (
              <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : tab === 'login' ? (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Create Account & Claim 10 Credits <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="mt-6 text-center text-xs text-[#50617A]">
          {tab === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className="text-[#533AFD] font-medium hover:underline"
              >
                Sign up for 10 free credits
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className="text-[#533AFD] font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
