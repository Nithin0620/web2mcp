'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Smartphone,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'starter' | 'pro';
  annual?: boolean;
  onSuccess?: (plan: 'starter' | 'pro', creditsAdded: number) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  annual = false,
  onSuccess,
}: PaymentModalProps) {
  const { upgrade, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'sandbox'>('sandbox');
  const [upiId, setUpiId] = useState('developer@razorpay');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    paymentId: string;
    creditsAdded: number;
    tier: string;
  } | null>(null);

  if (!isOpen) return null;

  const isStarter = plan === 'starter';
  const planTitle = isStarter ? 'Starter Plan' : 'Pro Power User';
  const creditsToAdd = isStarter ? 50 : 500;

  // Price calculations
  const priceDisplay = isStarter
    ? annual
      ? '$19.20 / yr ($1.60/mo)'
      : '$2.00 / month'
    : annual
      ? '$192.00 / yr ($16.00/mo)'
      : '$20.00 / month';

  const numericAmount = isStarter ? (annual ? 1920 : 200) : (annual ? 19200 : 2000);

  const handlePay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Realistic simulation steps for Razorpay checkout lifecycle
      setProcessingStep('Initiating Razorpay payment order...');
      await new Promise((res) => setTimeout(res, 400));

      setProcessingStep('Securing Razorpay payment token & signature...');
      await new Promise((res) => setTimeout(res, 450));

      const mockPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      setProcessingStep('Verifying payment and replenishing credits...');

      const res = await upgrade({
        plan,
        paymentId: mockPaymentId,
        billingCycle: annual ? 'annual' : 'monthly',
        paymentMethod,
        amount: numericAmount,
      });

      if (!res.success) {
        setError(res.error || 'Payment processing failed. Please try again.');
        setIsProcessing(false);
        setProcessingStep('');
        return;
      }

      setSuccessData({
        paymentId: mockPaymentId,
        creditsAdded: creditsToAdd,
        tier: plan.toUpperCase(),
      });

      if (onSuccess) {
        onSuccess(plan, creditsToAdd);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment error';
      setError(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessData(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] rounded-2xl shadow-[0_25px_50px_-12px_rgba(50,50,93,0.25),0_12px_24px_-8px_rgba(0,0,0,0.18)] p-6 sm:p-7 text-[#061B31] dark:text-[#F8FAFC] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-colors disabled:opacity-40"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success View */}
        {successData ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#0A2540] dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs text-[#50617A] dark:text-[#94A3B8]">
                Your account has been upgraded to the <strong className="text-[#0A2540] dark:text-white">{successData.tier}</strong> plan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] space-y-2 text-xs text-left">
              <div className="flex justify-between items-center text-[#50617A] dark:text-[#94A3B8]">
                <span>Credits Added:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  +{successData.creditsAdded} Generations
                </span>
              </div>
              <div className="flex justify-between items-center text-[#50617A] dark:text-[#94A3B8]">
                <span>Payment Reference:</span>
                <span className="font-mono text-[11px] text-[#0A2540] dark:text-gray-300">
                  {successData.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#50617A] dark:text-[#94A3B8]">
                <span>Provider:</span>
                <span className="font-medium text-[#533AFD] dark:text-[#A5B4FC]">
                  Razorpay Gateway (Sandbox)
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-[#533AFD] hover:bg-[#5452FB] text-white rounded-lg text-xs font-semibold transition-all shadow-[0_2px_4px_rgba(83,58,253,0.25)]"
            >
              Continue to Web2MCP
            </button>
          </div>
        ) : (
          /* Checkout View */
          <div className="space-y-5">
            {/* Header with Razorpay Branding */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0C2340] text-white text-[11px] font-semibold tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7] animate-pulse" />
                  <span>Razorpay</span>
                  <span className="text-[10px] text-sky-300 font-normal">Checkout</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Sandbox Test Mode
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0A2540] dark:text-white">
                Complete Your Subscription
              </h2>
              <p className="text-xs text-[#50617A] dark:text-[#94A3B8] mt-0.5">
                Review your order details and confirm payment to replenish credits.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Order Summary Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#0A2540] dark:text-white text-sm flex items-center gap-2">
                    <span>{planTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#D6D9FC]/40 text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
                      {annual ? 'Annual Billing' : 'Monthly Billing'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#50617A] dark:text-[#94A3B8] mt-0.5">
                    Account: <span className="font-medium text-[#0A2540] dark:text-white">{user?.email || 'Logged in developer'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#0A2540] dark:text-white">
                    {priceDisplay.split(' ')[0]}
                  </span>
                  <p className="text-[10px] text-[#64748D]">{annual ? '/ year' : '/ month'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EDF5] dark:border-[#1E293B] flex items-center justify-between text-xs">
                <span className="text-[#3C4F69] dark:text-[#CBD5E1] flex items-center gap-1.5 font-medium">
                  <Zap className="h-3.5 w-3.5 fill-[#533AFD] text-[#533AFD]" />
                  Immediate Credit Allowance:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{creditsToAdd} Generations
                </span>
              </div>
            </div>

            {/* Razorpay Integration Info Box */}
            <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-start gap-2.5 text-xs text-sky-900 dark:text-sky-200">
              <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong>Razorpay Gateway Placeholder:</strong> Razorpay webhook and live payment keys will be attached here. This sandbox simulates the verification cycle so credits are protected and only granted upon confirmed checkout.
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0A2540] dark:text-gray-200">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('sandbox')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'sandbox'
                      ? 'border-[#533AFD] bg-[#533AFD]/5 text-[#533AFD] dark:text-[#A5B4FC] shadow-[0_1px_2px_rgba(83,58,253,0.1)]'
                      : 'border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] text-[#50617A] dark:text-[#94A3B8] hover:border-[#CFD8E3]'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>1-Click Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#533AFD] bg-[#533AFD]/5 text-[#533AFD] dark:text-[#A5B4FC] shadow-[0_1px_2px_rgba(83,58,253,0.1)]'
                      : 'border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] text-[#50617A] dark:text-[#94A3B8] hover:border-[#CFD8E3]'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#533AFD] bg-[#533AFD]/5 text-[#533AFD] dark:text-[#A5B4FC] shadow-[0_1px_2px_rgba(83,58,253,0.1)]'
                      : 'border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] text-[#50617A] dark:text-[#94A3B8] hover:border-[#CFD8E3]'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="p-3 bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] rounded-lg space-y-2">
                <label className="block text-[11px] font-medium text-[#0A2540] dark:text-gray-300">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@okhdfcbank"
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] rounded-md text-xs text-[#061B31] dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-[#64748D]">
                  Test VPAs: razorpay.test@bank, success@razorpay
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3 bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] rounded-lg space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#0A2540] dark:text-gray-300 mb-1">
                    Card Number (Razorpay Test Card)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] rounded-md text-xs text-[#061B31] dark:text-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#0A2540] dark:text-gray-300 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] rounded-md text-xs text-[#061B31] dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#0A2540] dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] rounded-md text-xs text-[#061B31] dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'sandbox' && (
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Simulates full payment authorization handshake with zero friction.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="w-1/3 py-2.5 rounded-lg border border-[#E5EDF5] dark:border-[#1E293B] text-xs font-semibold text-[#50617A] dark:text-[#94A3B8] hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handlePay()}
                disabled={isProcessing}
                className="w-2/3 py-2.5 px-4 bg-[#533AFD] hover:bg-[#5452FB] active:bg-[#4032C8] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_2px_4px_rgba(83,58,253,0.25)]"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>{processingStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>Pay {priceDisplay.split(' ')[0]} with Razorpay</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
