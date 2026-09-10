'use client';

import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface EmpoweringWorkersSectionProps {
  onJoinAsWorker: () => void;
}

export const EmpoweringWorkersSection: React.FC<EmpoweringWorkersSectionProps> = ({
  onJoinAsWorker,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-coop-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coop-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Cooperative Movement • Sahakar Se Samriddhi</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Empowering Independent Workers through Cooperative Strength
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            Local plumbers, electricians, mechanics, and artisans have historically suffered from predatory commissions, lack of social security, and informal exploitation. Avadi Connect changes this by partnering directly with local registered cooperative societies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Digital Identity</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Establish institutional credibility with skill certifications and municipal shop verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>85% Transparent Direct Pay</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                No middleman skimming. Keep 85% of customer payments directly, while 10% funds your welfare pool.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Cooperative Welfare Shield</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Access group health insurance, modern tool subsidy pools, and annual cooperative patronage dividends.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Fair Algorithmic Dispatch</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Smart matching prioritizes skill, proximity, and customer satisfaction rather than bidding or ad spend.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onJoinAsWorker}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-black text-sm shadow-xl shadow-saffron-500/20 transition flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Register as an Independent Worker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="lg:col-span-5 bg-white/5 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Cooperative Principle #4
            </span>
            <h4 className="text-xl font-black mt-1">Autonomy & Independence</h4>
            <p className="text-xs text-slate-400 mt-1">
              Workers own their tools, control their duty hours, set their radius, and govern their cooperative society.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full control to toggle <strong>Available / Busy / Offline</strong> duty state anytime.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Direct customer-to-worker voice calling without masked call fees.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Democratic voting representation in cooperative management board.</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-coop-600/20 border border-coop-500/30 text-xs text-emerald-300">
            &quot;Avadi Connect brings the digital revolution to ground-level cooperative federations across India.&quot;
          </div>
        </div>
      </div>
    </div>
  );
};
