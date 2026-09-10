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
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="tracking-wide">{t('tagline')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          {t('heroTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onFindService}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{t('findService')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onJoinAsWorker}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <span>{t('joinAsWorker')}</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-rose-600/90 hover:bg-rose-600 border border-rose-500 text-white font-extrabold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>{t('needHelpNow')}</span>
          </button>
        </div>

        {/* Key Features Banner (Section 5) */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-5xl mx-auto text-xs font-semibold text-slate-300">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('verifiedWorkers')}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('smartMatching')}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{t('cooperativePowered')}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('localServices')}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{t('transparentEarnings')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
