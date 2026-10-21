'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: string;
  creditsRemaining: number;
  creditsUsed: number;
}

export interface UpgradePayload {
  plan: 'starter' | 'pro';
  paymentId?: string;
  billingCycle?: 'monthly' | 'annual';
  paymentMethod?: string;
  amount?: number;
}

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  creditsRemaining: number;
  tier: string;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  refreshAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  upgrade: (params: 'starter' | 'pro' | UpgradePayload) => Promise<{ success: boolean; error?: string; creditsRemaining?: number; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(3);
  const [tier, setTier] = useState('free_guest');
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(data.authenticated);
        setUser(data.user);
        setCreditsRemaining(data.creditsRemaining);
        setTier(data.tier);
      }
    } catch (err) {
      console.error('Failed to fetch auth session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to log in' };
      }
      await refreshAuth();
      closeAuthModal();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }
      await refreshAuth();
      closeAuthModal();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshAuth();
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const upgrade = async (params: 'starter' | 'pro' | UpgradePayload) => {
    try {
      const payload = typeof params === 'string' ? { plan: params } : params;
      const res = await fetch('/api/auth/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Upgrade failed' };
      }
      await refreshAuth();
      return {
        success: true,
        creditsRemaining: data.creditsRemaining,
        message: data.message,
      };
    } catch (err) {
      return { success: false, error: 'Network error during upgrade' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        creditsRemaining,
        tier,
        loading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        refreshAuth,
        login,
        register,
        logout,
        upgrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
