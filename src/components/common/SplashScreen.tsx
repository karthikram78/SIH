'use client';

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'fadeout'>('logo');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 800);
    const t2 = setTimeout(() => setPhase('fadeout'), 2000);
    const t3 = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 transition-opacity duration-500 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div
        className={`flex flex-col items-center gap-5 transition-all duration-700 ${
          phase === 'logo' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-white shadow-2xl shadow-amber-500/30 flex items-center justify-center p-3">
            <img src="/logo.png" alt="Avadi Connect logo" className="w-full h-full object-contain" />
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/50 animate-ping" />
        </div>

        {/* Brand name */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Avadi Connect
          </h1>
          <p className="text-lg font-semibold text-amber-400 tracking-widest">
            நம்ம சேவை
          </p>
        </div>

        {/* Tagline */}
        <p
          className={`text-sm text-slate-400 font-medium text-center max-w-xs transition-all duration-500 delay-300 ${
            phase === 'tagline' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Trusted local services for Avadi
        </p>

        {/* Loading dots */}
        <div
          className={`flex items-center gap-2 transition-all duration-500 delay-500 ${
            phase === 'tagline' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Ministry badge */}
      <div
        className={`absolute bottom-8 flex items-center gap-2 text-xs text-slate-500 font-medium transition-all duration-500 delay-700 ${
          phase === 'tagline' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span>🇮🇳</span>
        <span>Verified local services in Avadi • SIH 2026</span>
      </div>
    </div>
  );
};
