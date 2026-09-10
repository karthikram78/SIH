'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { validateEmail, validateMobile, sanitizeInput, checkRateLimit } from '@/lib/security';

const ROLES: { role: UserRole; label: string; emoji: string; color: string }[] = [
  { role: 'customer',          label: 'Customer',    emoji: '🏠', color: 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100' },
  { role: 'worker',            label: 'Worker',      emoji: '🔧', color: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' },
  { role: 'cooperative_admin', label: 'Cooperative', emoji: '🤝', color: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' },
  { role: 'platform_admin',    label: 'Admin',       emoji: '🛡️', color: 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100' },
];

const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  customer:          { email: 'priya.sharma@example.com',      password: 'password123' },
  worker:            { email: 'arun.plumber.chennai@example.com', password: 'password123' },
  cooperative_admin: { email: 'chennai.coop@example.com',      password: 'password123' },
  platform_admin:    { email: 'admin@nammasevai.gov.in',        password: 'password123' },
};

function getDashboard(role: UserRole) {
  if (role === 'worker') return '/worker/dashboard';
  if (role === 'cooperative_admin') return '/cooperative/dashboard';
  if (role === 'platform_admin') return '/admin/dashboard';
  return '/customer/dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) router.replace(getDashboard(currentRole));
  }, [isAuthenticated, currentRole, router]);

  // When role changes, prefill demo credentials
  useEffect(() => {
    setEmail(DEMO_CREDENTIALS[selectedRole].email);
    setPassword(DEMO_CREDENTIALS[selectedRole].password);
    setError('');
  }, [selectedRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limit
    const rl = checkRateLimit('login', 6, 60_000);
    if (!rl.allowed) {
      setError(`Too many attempts. Try again in ${Math.ceil(rl.resetIn / 1000)}s.`);
      return;
    }

    const cleanEmail = sanitizeInput(email);
    if (!cleanEmail || (!validateEmail(cleanEmail) && !validateMobile(cleanEmail))) {
      setError('Please enter a valid email or mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(cleanEmail, password, selectedRole);
      if (res.success) {
        router.push(getDashboard(selectedRole));
      } else {
        setError(res.message || 'Invalid credentials. Try the demo password: password123');
      }
    } catch {
      // Offline fallback
      router.push(getDashboard(selectedRole));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEnter = async (role: UserRole) => {
    setLoading(true);
    setError('');
    const cred = DEMO_CREDENTIALS[role];
    try {
      await login(cred.email, cred.password, role);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      router.push(getDashboard(role));
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
          <h1 className="text-2xl font-black text-white">Avadi Connect</h1>
          <p className="text-amber-400 text-sm font-medium">Trusted local services in Avadi</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Role pills */}
          <div className="p-5 pb-4 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sign in as</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all ${r.color} ${
                    selectedRole === r.role ? 'ring-2 ring-offset-1 ring-amber-400 scale-[1.02] shadow-sm' : ''
                  }`}
                >
                  <span className="text-base">{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email or Mobile</label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@example.com"
                required
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm text-slate-900 font-medium transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-sm text-slate-900 font-medium transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Demo password: <strong>password123</strong></p>
            </div>

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
                  Signing in…
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="px-5 pb-5">
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400 font-medium text-center mb-3">— Or quick demo entry —</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickEnter(r.role)}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{r.emoji}</span>
                    <span>Enter as {r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Register link */}
          <div className="bg-slate-50 px-5 py-3 text-center text-xs text-slate-500 border-t border-slate-100">
            New to Avadi Connect?{' '}
            <Link href="/register" className="font-bold text-amber-600 hover:underline">
              Register here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
