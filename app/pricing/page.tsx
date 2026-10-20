'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function PricingPage() {
  const router = useRouter();
  const { user, authenticated, tier, openAuthModal, upgrade } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (planKey: string) => {
    setError(null);
    setUpgradeSuccess(null);

    if (planKey === 'guest') {
      router.push('/projects/new');
      return;
    }

    if (planKey === 'free_user') {
      if (!authenticated) {
        openAuthModal('register');
      } else {
        router.push('/projects/new');
      }
      return;
    }

    if (!authenticated) {
      openAuthModal('login');
      return;
    }

    // Process upgrade
    setUpgradingPlan(planKey);
    const res = await upgrade(planKey as 'starter' | 'pro');
    setUpgradingPlan(null);

    if (res.success) {
      setUpgradeSuccess(`Successfully upgraded to ${planKey.toUpperCase()}! Your credits have been replenished.`);
    } else {
      setError(res.error || 'Failed to process upgrade');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Transparent, Developer-Friendly Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Turn Any Website into Live MCP Tools
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Start completely free with zero friction. Upgrade for high-volume execution, continuous DOM monitors, and autonomous browser workflows.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className={!annual ? 'text-white' : 'text-slate-400'}>Monthly</span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 bg-slate-800 rounded-full p-1 relative transition-colors border border-slate-700"
          >
            <div
              className={`w-4 h-4 rounded-full bg-blue-500 transition-transform ${
                annual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={annual ? 'text-white' : 'text-slate-400'}>
            Annual <span className="text-emerald-400 font-bold ml-1">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Success / Error notification */}
      {upgradeSuccess && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{upgradeSuccess}</span>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tier 1: Free Guest */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Free Guest</h3>
              <p className="text-xs text-slate-400 mt-1">Instant exploration without signing up.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-blue-400 font-medium flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>3 Free Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>3 MCP server generations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Streamable HTTP JSON-RPC endpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standard Cheerio HTML extractor</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Community Discord access</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('guest')}
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
            >
              Try Without Login
            </button>
          </div>
        </div>

        {/* Tier 2: Free Registered */}
        <div className="rounded-2xl border border-blue-800/60 bg-blue-950/20 p-6 flex flex-col justify-between relative shadow-lg hover:border-blue-700 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Free Account</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
                Popular
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Unlock 10 free credits with Evidence Vault.</p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-700/50 text-xs text-blue-300 font-semibold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>10 Free Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>10 MCP tool generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Evidence Vault with DOM hashing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standalone CLI tool installer</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1-click install for Cursor & Claude</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('free_user')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-md shadow-blue-500/20"
            >
              {authenticated ? 'Current Plan' : 'Sign Up Free (Claim 10)'}
            </button>
          </div>
        </div>

        {/* Tier 3: Starter ($2) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">For indie hackers and developers.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">
                ${annual ? '1.60' : '2'}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>50 Generations / Mo</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>50 MCP generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>5,000 monthly probe calls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Priority crawler queue</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Safety Gate two-phase approval tokens</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('starter')}
              disabled={upgradingPlan === 'starter' || tier === 'starter'}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700 disabled:opacity-50"
            >
              {tier === 'starter' ? 'Active Plan' : upgradingPlan === 'starter' ? 'Upgrading...' : 'Get Starter ($2/mo)'}
            </button>
          </div>
        </div>

        {/* Tier 4: Pro ($20) */}
        <div className="rounded-2xl border border-purple-800/60 bg-gradient-to-b from-purple-950/30 to-slate-900/60 p-6 flex flex-col justify-between hover:border-purple-600 transition-all relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Pro Power User</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30">
                Full Power
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Unlimited scale & continuous monitors.</p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">
                ${annual ? '16' : '20'}
              </span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-700/50 text-xs text-purple-300 font-semibold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Unlimited Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Unlimited MCP generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100,000 monthly probe calls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Autonomous TinyFish browser workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Continuous DOM regression monitors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dedicated cloud IDE sidecar runner</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Priority 24/7 technical support</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={upgradingPlan === 'pro' || tier === 'pro'}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors shadow-md shadow-purple-500/20 disabled:opacity-50"
            >
              {tier === 'pro' ? 'Active Plan' : upgradingPlan === 'pro' ? 'Upgrading...' : 'Get Pro ($20/mo)'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="pt-12 border-t border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Feature Comparison Matrix</h2>
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/30">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Features</th>
                <th className="p-4 font-semibold">Guest</th>
                <th className="p-4 font-semibold">Free Account</th>
                <th className="p-4 font-semibold">Starter ($2)</th>
                <th className="p-4 font-semibold">Pro ($20)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-4 font-medium text-white">Generation Credits</td>
                <td className="p-4 text-slate-400">3 total</td>
                <td className="p-4 text-blue-400 font-semibold">10 total</td>
                <td className="p-4 text-emerald-400 font-semibold">50 / mo</td>
                <td className="p-4 text-purple-400 font-semibold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Evidence Vault History</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-emerald-400">Latest 10</td>
                <td className="p-4 text-emerald-400">Latest 100</td>
                <td className="p-4 text-emerald-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Streamable HTTP Transport</td>
                <td className="p-4 text-emerald-400">Yes</td>
                <td className="p-4 text-emerald-400">Yes</td>
                <td className="p-4 text-emerald-400">Yes</td>
                <td className="p-4 text-emerald-400">Yes</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Autonomous TinyFish Agent</td>
                <td className="p-4 text-slate-500">Fallback only</td>
                <td className="p-4 text-slate-500">Fallback only</td>
                <td className="p-4 text-emerald-400">Enabled</td>
                <td className="p-4 text-purple-400 font-bold">Priority High-Concurrency</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Two-Phase Safety Gate</td>
                <td className="p-4 text-slate-500">—</td>
                <td className="p-4 text-emerald-400">Basic</td>
                <td className="p-4 text-emerald-400">Full</td>
                <td className="p-4 text-purple-400 font-bold">Full + Custom Webhooks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-12 border-t border-slate-800 space-y-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-400" /> What counts as a generation credit?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              One credit is consumed each time you provide a new website URL and Web2MCP crawls, infers schemas, validates probes, and creates a live MCP server.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-400" /> Do I need a credit card for the free plan?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              No credit card is required. You can test 3 generations instantly without creating an account, and get 10 free generations simply by signing up with your email.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-400" /> Can I use the generated tools in Cursor and Claude?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes! All generated MCP endpoints adhere to the official Model Context Protocol (JSON-RPC 2.0) and connect directly to Cursor, Claude Desktop, Claude Code, and VS Code.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-400" /> Can I cancel or change plans anytime?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes, you can upgrade, downgrade, or cancel your subscription at any time without long-term commitments or lock-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
