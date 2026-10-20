'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Zap, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function PricingPage() {
  const router = useRouter();
  const { authenticated, tier, openAuthModal, upgrade } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 space-y-16 bg-white text-[#061B31]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6D9FC]/30 border border-[#D6D9FC] text-[#533AFD] text-xs font-semibold shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Transparent, Developer-Friendly Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0A2540] tracking-tight">
          Turn Any Website into Live MCP Tools
        </h1>
        <p className="text-base text-[#50617A] leading-relaxed">
          Start completely free with zero friction. Upgrade for high-volume execution, continuous DOM monitors, and autonomous browser workflows.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#0A2540]">
          <span className={!annual ? 'text-[#0A2540]' : 'text-[#64748D]'}>Monthly</span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 bg-[#E5EDF5] rounded-full p-1 relative transition-colors"
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#533AFD] transition-transform ${
                annual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={annual ? 'text-[#0A2540]' : 'text-[#64748D]'}>
            Annual <span className="text-emerald-600 font-bold ml-1">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Success / Error notification */}
      {upgradeSuccess && (
        <div className="max-w-2xl mx-auto p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{upgradeSuccess}</span>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          {error}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tier 1: Free Guest */}
        <div className="rounded-lg border border-[#E5EDF5] bg-white p-6 flex flex-col justify-between hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.05)]">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A2540] text-base">Free Guest</h3>
              <p className="text-xs text-[#50617A] mt-1">Instant exploration without signing up.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0A2540]">$0</span>
              <span className="text-xs text-[#64748D]">/ forever</span>
            </div>

            <div className="p-2.5 rounded-md bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#533AFD] font-medium flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>3 Free Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#3C4F69] pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>3 MCP server generations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Streamable HTTP JSON-RPC endpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standard Cheerio HTML extractor</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Community Discord access</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('guest')}
              className="w-full py-2.5 rounded-md border border-[#E5EDF5] bg-white hover:bg-[#F8FAFD] text-xs font-semibold text-[#0A2540] transition-colors shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
            >
              Try Without Login
            </button>
          </div>
        </div>

        {/* Tier 2: Free Registered */}
        <div className="rounded-lg border-2 border-[#533AFD] bg-white p-6 flex flex-col justify-between relative shadow-[0_4px_12px_rgba(83,58,253,0.12)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0A2540] text-base">Free Account</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D6D9FC] text-[#533AFD]">
                Popular
              </span>
            </div>
            <p className="text-xs text-[#50617A] mt-1">Unlock 10 free credits with Evidence Vault.</p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0A2540]">$0</span>
              <span className="text-xs text-[#64748D]">/ forever</span>
            </div>

            <div className="p-2.5 rounded-md bg-[#D6D9FC]/30 border border-[#D6D9FC] text-xs text-[#533AFD] font-semibold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>10 Free Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#3C4F69] pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-[#0A2540]">10 MCP tool generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Evidence Vault with DOM hashing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standalone CLI tool installer</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>1-click install for Cursor & Claude</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('free_user')}
              className="w-full py-2.5 rounded-md bg-[#533AFD] hover:bg-[#5452FB] active:bg-[#4032C8] text-xs font-semibold text-white transition-all shadow-[0_2px_4px_rgba(83,58,253,0.25)]"
            >
              {authenticated ? 'Current Plan' : 'Sign Up Free (Claim 10)'}
            </button>
          </div>
        </div>

        {/* Tier 3: Starter ($2) */}
        <div className="rounded-lg border border-[#E5EDF5] bg-white p-6 flex flex-col justify-between hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.05)]">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#0A2540] text-base">Starter</h3>
              <p className="text-xs text-[#50617A] mt-1">For indie hackers and developers.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0A2540]">
                ${annual ? '1.60' : '2'}
              </span>
              <span className="text-xs text-[#64748D]">/ month</span>
            </div>

            <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>50 Generations / Mo</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#3C4F69] pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-[#0A2540]">50 MCP generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>5,000 monthly probe calls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Priority crawler queue</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Safety Gate two-phase approval tokens</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('starter')}
              disabled={upgradingPlan === 'starter' || tier === 'starter'}
              className="w-full py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1A2C44] text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-[0_1px_2px_rgba(50,50,93,0.08)]"
            >
              {tier === 'starter' ? 'Active Plan' : upgradingPlan === 'starter' ? 'Upgrading...' : 'Get Starter ($2/mo)'}
            </button>
          </div>
        </div>

        {/* Tier 4: Pro ($20) */}
        <div className="rounded-lg border border-[#E5EDF5] bg-gradient-to-b from-[#F8FAFD] to-white p-6 flex flex-col justify-between hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.05)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0A2540] text-base">Pro Power User</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D6D9FC]/50 text-[#533AFD] border border-[#D6D9FC]">
                Full Power
              </span>
            </div>
            <p className="text-xs text-[#50617A] mt-1">Unlimited scale & continuous monitors.</p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0A2540]">
                ${annual ? '16' : '20'}
              </span>
              <span className="text-xs text-[#64748D]">/ month</span>
            </div>

            <div className="p-2.5 rounded-md bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0A2540] font-semibold flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-[#533AFD] text-[#533AFD]" />
              <span>Unlimited Generations</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#3C4F69] pt-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="text-[#0A2540]">Unlimited MCP generations</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100,000 monthly probe calls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Autonomous TinyFish browser workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Continuous DOM regression monitors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dedicated cloud IDE sidecar runner</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Priority 24/7 technical support</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={upgradingPlan === 'pro' || tier === 'pro'}
              className="w-full py-2.5 rounded-md bg-[#533AFD] hover:bg-[#5452FB] text-xs font-semibold text-white transition-all shadow-[0_2px_4px_rgba(83,58,253,0.25)] disabled:opacity-50"
            >
              {tier === 'pro' ? 'Active Plan' : upgradingPlan === 'pro' ? 'Upgrading...' : 'Get Pro ($20/mo)'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="pt-12 border-t border-[#E5EDF5] space-y-6">
        <h2 className="text-2xl font-bold text-[#0A2540] text-center">Feature Comparison Matrix</h2>
        <div className="border border-[#E5EDF5] rounded-lg overflow-hidden bg-white shadow-[0_2px_4px_rgba(50,50,93,0.04)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFD] text-[#0A2540] border-b border-[#E5EDF5]">
              <tr>
                <th className="p-4 font-semibold">Features</th>
                <th className="p-4 font-semibold">Guest</th>
                <th className="p-4 font-semibold">Free Account</th>
                <th className="p-4 font-semibold">Starter ($2)</th>
                <th className="p-4 font-semibold">Pro ($20)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EDF5] text-[#3C4F69]">
              <tr>
                <td className="p-4 font-medium text-[#0A2540]">Generation Credits</td>
                <td className="p-4 text-[#64748D]">3 total</td>
                <td className="p-4 text-[#533AFD] font-semibold">10 total</td>
                <td className="p-4 text-emerald-700 font-semibold">50 / mo</td>
                <td className="p-4 text-[#533AFD] font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0A2540]">Evidence Vault History</td>
                <td className="p-4 text-[#94A3B8]">None</td>
                <td className="p-4 text-emerald-700">Latest 10</td>
                <td className="p-4 text-emerald-700">Latest 100</td>
                <td className="p-4 text-emerald-700 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0A2540]">Streamable HTTP Transport</td>
                <td className="p-4 text-emerald-700">Yes</td>
                <td className="p-4 text-emerald-700">Yes</td>
                <td className="p-4 text-emerald-700">Yes</td>
                <td className="p-4 text-emerald-700">Yes</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0A2540]">Autonomous TinyFish Agent</td>
                <td className="p-4 text-[#94A3B8]">Fallback only</td>
                <td className="p-4 text-[#94A3B8]">Fallback only</td>
                <td className="p-4 text-emerald-700">Enabled</td>
                <td className="p-4 text-[#533AFD] font-bold">Priority High-Concurrency</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#0A2540]">Two-Phase Safety Gate</td>
                <td className="p-4 text-[#94A3B8]">—</td>
                <td className="p-4 text-emerald-700">Basic</td>
                <td className="p-4 text-emerald-700">Full</td>
                <td className="p-4 text-[#533AFD] font-bold">Full + Custom Webhooks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-12 border-t border-[#E5EDF5] space-y-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0A2540] text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
            <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#533AFD]" /> What counts as a generation credit?
            </h3>
            <p className="text-[#50617A] leading-relaxed">
              One credit is consumed each time you provide a new website URL and Web2MCP crawls, infers schemas, validates probes, and creates a live MCP server.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
            <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#533AFD]" /> Do I need a credit card for the free plan?
            </h3>
            <p className="text-[#50617A] leading-relaxed">
              No credit card is required. You can test 3 generations instantly without creating an account, and get 10 free generations simply by signing up with your email.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
            <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#533AFD]" /> Can I use the generated tools in Cursor and Claude?
            </h3>
            <p className="text-[#50617A] leading-relaxed">
              Yes! All generated MCP endpoints adhere to the official Model Context Protocol (JSON-RPC 2.0) and connect directly to Cursor, Claude Desktop, Claude Code, and VS Code.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
            <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#533AFD]" /> Can I cancel or change plans anytime?
            </h3>
            <p className="text-[#50617A] leading-relaxed">
              Yes, you can upgrade, downgrade, or cancel your subscription at any time without long-term commitments or lock-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
