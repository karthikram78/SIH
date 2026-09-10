'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { sanitizeInput, validateEmail, validateMobile, validateName } from '@/lib/security';

const AREAS = ['Avadi'];

const SKILL_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner',
  'Driver', 'Mechanic', 'Gardener', 'Caregiver', 'Domestic Helper',
  'AC Technician', 'Appliance Repair', 'Mason', 'Welder', 'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    area: AREAS[0],
    skill: SKILL_CATEGORIES[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
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
    } catch (err: any) {
      // Offline fallback: navigate anyway
      router.push(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl shadow-amber-500/20 mb-4 p-2">
            <img src="/logo.png" alt="Avadi Connect logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white">Join Avadi Connect</h1>
          <p className="text-amber-400 text-sm font-medium">Trusted local services in Avadi</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Step indicator */}
          <div className="flex items-center gap-0 border-b border-slate-100">
            {[1, 2].map((n) => (
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
                Step {n}: {n === 1 ? 'Choose Role' : 'Your Details'}
              </div>
            ))}
          </div>

          {/* STEP 1 — Role selection */}
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

          {/* STEP 2 — Details form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <button
                type="button"
                onClick={() => setStep(1)}
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
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => set('mobile', e.target.value)}
                  placeholder="9876543210"
                  required
                  maxLength={13}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium text-slate-900 transition"
                />
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
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : 'Create Account →'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="bg-slate-50 px-5 py-3 text-center text-xs text-slate-500 border-t border-slate-100">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-amber-600 hover:underline">
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
