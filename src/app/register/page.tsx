'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { sanitizeInput, validateEmail, validateMobile, validateName } from '@/lib/security';
import OtpInput from '@/components/OtpInput';

const AREAS = ['Avadi'];

const SKILL_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner',
  'Driver', 'Mechanic', 'Gardener', 'Caregiver', 'Domestic Helper',
  'AC Technician', 'Appliance Repair', 'Mason', 'Welder', 'Other',
];

// Steps: 1 = choose role, 2 = details form, 3 = OTP verify, 4 = creating account
type Step = 1 | 2 | 3 | 4;

const RESEND_COOLDOWN = 30; // seconds

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    area: AREAS[0],
    skill: SKILL_CATEGORIES[0],
  });

  // OTP state
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState(''); // shown on-screen in dev mode only

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  // ── Countdown timer for resend ──
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Send OTP ──
  const sendOtp = useCallback(async () => {
    setOtpSending(true);
    setError('');
    setOtpValue('');
    setOtpError(false);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.mobile }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to send OTP. Please try again.');
        return false;
      }
      // Dev mode: API returns the OTP so we can show it in the UI
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendTimer(RESEND_COOLDOWN);
      setStep(3);
      return true;
    } catch {
      setError('Network error. Please check your connection.');
      return false;
    } finally {
      setOtpSending(false);
    }
  }, [form.mobile]);

  // ── Verify OTP ──
  const verifyOtp = useCallback(async () => {
    const cleanOtp = otpValue.replace(/\s/g, '');
    if (cleanOtp.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }
    setOtpVerifying(true);
    setError('');
    setOtpError(false);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.mobile, otp: cleanOtp, role }),
      });
      const data = await res.json();
      if (!res.ok || (!data.valid && !data.success)) {
        setOtpError(true);
        setError(data.message || 'Incorrect OTP. Please try again.');
        // Reset shake after animation
        setTimeout(() => setOtpError(false), 500);
        return;
      }
      // OTP verified! Create account
      await createAccount();
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  }, [otpValue, form.mobile, role]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Create Account ──
  const createAccount = async () => {
    setLoading(true);
    setStep(4);
    try {
      const payload = {
        name: sanitizeInput(form.name),
        mobile: form.mobile.trim(),
        email: sanitizeInput(form.email),
        password: form.password,
        role,
        area: form.area,
        address: 'Avadi Main Road, Avadi',
        city: 'Avadi',
        pincode: '600054',
        lat: 13.1147,
        lng: 80.1048,
        skill: role === 'worker' ? form.skill : undefined,
      };
      await registerUser(payload);
      router.push(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
    } catch {
      router.push(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 form submit → send OTP ──
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateName(form.name)) {
      setError('Please enter a valid full name (at least 2 characters).');
      return;
    }
    if (!validateMobile(form.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (form.email && !validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    await sendOtp();
  };

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (step === 3 && otpValue.replace(/\s/g, '').length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue, step]);

  // ── Shared header ──
  const Header = () => (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl shadow-amber-500/20 mb-4 p-2">
        <img src="/logo.png" alt="Avadi Connect logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-2xl font-black text-white">Join Avadi Connect</h1>
      <p className="text-amber-400 text-sm font-medium">Trusted local services in Avadi</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <Header />

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* ── Step Indicator ── */}
          {step !== 4 && (
            <div className="flex items-stretch border-b border-slate-100">
              {[
                { n: 1, label: 'Role' },
                { n: 2, label: 'Details' },
                { n: 3, label: 'Verify OTP' },
              ].map(({ n, label }) => (
                <div
                  key={n}
                  className={`flex-1 py-3 text-center text-xs font-bold transition-colors ${
                    step === n
                      ? 'bg-amber-500 text-white'
                      : n < step
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  {n < step ? '✓' : `${n}.`} {label}
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════
              STEP 1 — Role selection
          ══════════════════════════════════════ */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <p className="text-sm font-semibold text-slate-700 text-center">Who are you joining as?</p>

              <button
                type="button"
                onClick={() => { setRole('customer'); setStep(2); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] ${
                  role === 'customer' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <span className="text-3xl">🏠</span>
                <div className="text-left">
                  <p className="font-black text-slate-800">Customer</p>
                  <p className="text-xs text-slate-500">Book services for your home or office</p>
                </div>
                <span className="ml-auto text-slate-400">→</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('worker'); setStep(2); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] ${
                  role === 'worker' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="text-3xl">🔧</span>
                <div className="text-left">
                  <p className="font-black text-slate-800">Worker / Artisan</p>
                  <p className="text-xs text-slate-500">Offer your skills, earn 85% of every booking</p>
                </div>
                <span className="ml-auto text-slate-400">→</span>
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-500 hover:text-amber-600 font-medium">
                  Already have an account? Sign In →
                </Link>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              STEP 2 — Details form
          ══════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleDetailsSubmit} className="p-5 space-y-3">
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); }}
                className="text-xs text-slate-500 hover:text-amber-600 font-medium flex items-center gap-1"
              >
                ← Back
              </button>

              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {role === 'customer' ? '🏠 Customer' : '🔧 Worker'} Registration
              </p>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 transition"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number *</label>
                <div className="flex">
                  <span className="flex items-center px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-sm font-bold text-slate-600">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    required
                    maxLength={10}
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">📱 An OTP will be sent to verify your number</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 transition"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Area *</label>
                <select
                  value={form.area}
                  onChange={(e) => set('area', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 bg-white transition"
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Skill (workers only) */}
              {role === 'worker' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Skill / Trade *</label>
                  <select
                    value={form.skill}
                    onChange={(e) => set('skill', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 bg-white transition"
                  >
                    {SKILL_CATEGORIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">You&apos;ll earn 85% of every booking 💚</p>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={otpSending}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {otpSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending OTP…
                  </>
                ) : 'Continue → Verify Mobile'}
              </button>
            </form>
          )}

          {/* ══════════════════════════════════════
              STEP 3 — OTP Verification
          ══════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-2xl mx-auto mb-3">
                  📱
                </div>
                <h2 className="font-black text-slate-800 text-lg">Verify Your Mobile</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit OTP sent to
                </p>
                <p className="text-sm font-bold text-amber-600">+91 {form.mobile}</p>
              </div>

              {/* OTP boxes */}
              <OtpInput
                value={otpValue}
                onChange={setOtpValue}
                disabled={otpVerifying}
                error={otpError}
              />

              {/* Status message */}
              {otpVerifying ? (
                <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-semibold">
                  <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                  Verifying…
                </div>
              ) : error ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-3 py-2.5 rounded-xl text-center">
                  {error}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400">
                  OTP auto-verifies when all 6 digits are entered
                </p>
              )}

              {/* Manual verify button (in case auto-submit didn't trigger) */}
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpVerifying || otpValue.replace(/\s/g, '').length < 6}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {otpVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : 'Verify OTP →'}
              </button>

              {/* Resend + change number */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(2); setOtpValue(''); setError(''); }}
                  className="font-medium hover:text-amber-600 transition"
                >
                  ← Change number
                </button>

                {resendTimer > 0 ? (
                  <span className="text-slate-400">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpSending}
                    className="font-bold text-amber-600 hover:text-amber-700 transition disabled:opacity-50"
                  >
                    {otpSending ? 'Sending…' : 'Resend OTP'}
                  </button>
                )}
              </div>

              {/* Dev mode hint */}
              {devOtp ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-800 font-semibold mb-1.5">🔑 Verification Code Generated:</p>
                  <button
                    type="button"
                    onClick={() => setOtpValue(devOtp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-sm rounded-lg shadow-sm transition active:scale-95"
                  >
                    <span>{devOtp}</span>
                    <span className="text-[10px] uppercase font-sans opacity-80">(Click to Fill)</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-500 text-center">
                  📱 OTP dispatched via MSG91 (Dev mode OTP: <strong>123456</strong>)
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              STEP 4 — Creating account spinner
          ══════════════════════════════════════ */}
          {step === 4 && (
            <div className="p-10 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-2xl">
                ✅
              </div>
              <p className="font-black text-slate-800 text-lg">Mobile Verified!</p>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
                Creating your account…
              </div>
            </div>
          )}

          {/* Footer */}
          {step !== 4 && (
            <div className="bg-slate-50 px-5 py-3 text-center text-xs text-slate-500 border-t border-slate-100">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-amber-600 hover:underline">
                Sign In →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
