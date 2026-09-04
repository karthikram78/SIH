'use client';

import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  Users,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onFindService: () => void;
  onJoinAsWorker: () => void;
  onOpenEmergency: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onFindService,
  onJoinAsWorker,
  onOpenEmergency,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Subtle decorative background circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-saffron-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-coop-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
        {/* Core USP Ribbon (Section 25) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="tracking-wide">Local Skills. Verified Workers. Smart Connections.</span>
        </div>

        {/* Hero Title (Section 4) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Find Trusted Local Workers <span className="bg-gradient-to-r from-saffron-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Near You</span>
        </h1>

        {/* Subtitle (Section 4) */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Connect with verified independent workers for household, personal, community and emergency services — powered by smart matching.
        </p>

        {/* CTAs (Section 4) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onFindService}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-extrabold text-base shadow-xl shadow-saffron-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Find a Service</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onJoinAsWorker}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Join as a Worker</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-rose-600/90 hover:bg-rose-600 border border-rose-500 text-white font-extrabold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>🚨 Need Help Now</span>
          </button>
        </div>

        {/* Key Features Banner (Section 4) */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-5xl mx-auto text-xs font-semibold text-slate-300">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Workers</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Smart Matching</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-400 shrink-0" />
            <span>Local Services</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Cooperative Powered</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Transparent Earnings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
