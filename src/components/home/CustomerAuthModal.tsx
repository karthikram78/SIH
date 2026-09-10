'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  User,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { setCurrentRole, login, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>(initialMode);
  const [roleIntent, setRoleIntent] = useState<'customer' | 'worker'>('customer');
  const [otpValue, setOtpValue] = useState(['1', '2', '3', '4']);
  const [formData, setFormData] = useState({
    name: 'Priya Sharma',
    mobile: '+91 98421 77312',
    email: 'priya.sharma@example.com',
    address: 'Avadi Main Road, Avadi',
    locationGranted: true,
  });

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      await registerUser({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        role: roleIntent,
        address: formData.address,
        city: 'Chennai',
        pincode: '600017',
        lat: 13.0418,
        lng: 80.2341,
      });
    } else {
      await login(formData.mobile, 'password123', roleIntent);
    }
    onClose();
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(0, 1);
    const newOtp = [...otpValue];
    newOtp[index] = val;
    setOtpValue(newOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-saffron-500/20 text-saffron-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Avadi Connect Access
              </span>
              <h3 className="text-xl font-black">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Account'}
                {mode === 'otp' && 'Verify Mobile OTP'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Mode: Login */}
          {mode === 'login' && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Password / MPIN</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-saffron-600 font-semibold hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    defaultValue="demo123"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-500/20 transition flex items-center justify-center gap-1.5"
              >
                <span>Login with OTP Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-slate-500">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-saffron-600 hover:underline"
                >
                  Register Now
                </button>
              </div>
            </form>
          )}

          {/* Mode: Register */}
          {mode === 'register' && (
            <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
              {/* Role Selection (Section 5) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">I am registering as:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRoleIntent('customer')}
                    className={`p-3 rounded-xl border-2 text-left font-bold transition flex items-center gap-2 ${
                      roleIntent === 'customer'
                        ? 'border-saffron-500 bg-saffron-50/60 text-saffron-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4 text-saffron-600" />
                    <div>
                      <div>I need a service</div>
                      <div className="text-[10px] text-slate-400 font-normal">Customer / User</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleIntent('worker')}
                    className={`p-3 rounded-xl border-2 text-left font-bold transition flex items-center gap-2 ${
                      roleIntent === 'worker'
                        ? 'border-saffron-500 bg-saffron-50/60 text-saffron-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>I am a worker</div>
                      <div className="text-[10px] text-slate-400 font-normal">Skilled Tradesperson</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="locPerm"
                  checked={formData.locationGranted}
                  onChange={(e) => setFormData({ ...formData, locationGranted: e.target.checked })}
                  className="rounded text-saffron-600"
                />
                <label htmlFor="locPerm" className="text-[11px] text-slate-600">
                  Allow precise location access to detect nearby workers automatically
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md transition"
              >
                Continue to Mobile OTP
              </button>

              <div className="text-center pt-1 text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-saffron-600 hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          )}

          {/* Mode: OTP Verification UI (Section 5) */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs text-center">
              <div className="w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <p className="text-slate-600">
                We sent a 4-digit verification code to <strong>{formData.mobile}</strong>. (Demo Code: <strong>7412</strong>)
              </p>

              <div className="flex justify-center gap-3 py-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otpValue[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-slate-300 text-center text-lg font-black text-slate-900 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none font-mono"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter Platform</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* Mode: Forgot Password */}
          {mode === 'forgot' && (
            <div className="space-y-4 text-xs text-center">
              <p className="text-slate-600">
                Enter your mobile number to receive a temporary one-time login link.
              </p>
              <input
                type="text"
                placeholder="+91 98421 77312"
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none"
              />
              <button
                onClick={() => setMode('otp')}
                className="w-full py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs"
              >
                Send Reset SMS
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-500 hover:underline block mx-auto text-xs"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
