'use client';

import React from 'react';
import {
  FileText,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: 1,
      title: 'Request Service',
      desc: 'Describe your issue in plain words or select a category with our smart AI assistant.',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
    },
    {
      num: 2,
      title: 'Location Detection',
      desc: 'GPS pinpoints your location to find nearby artisans in your neighborhood.',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: 3,
      title: 'Smart Matching',
      desc: 'Ranked by skill, proximity, rating, and verified cooperative credentials.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
    },
    {
      num: 4,
      title: 'Verified Worker',
      desc: 'Only cooperative-backed, 4-point verified workers arrive at your door.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
    },
    {
      num: 5,
      title: 'Job Completion',
      desc: 'Worker finishes task with strict transparent hourly or fixed pricing.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
    },
    {
      num: 6,
      title: 'Payment',
      desc: 'Simulated payment: 85% to worker, 10% to coop welfare fund, 5% platform fee.',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: 7,
      title: 'Rating',
      desc: 'Leave genuine feedback to empower honest community tradespeople.',
      icon: <Star className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Community Trust Flow
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
          How Avadi Connect Works
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          From your first service request to final rating in 7 seamless, transparent steps.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {steps.map((st) => (
          <div
            key={st.num}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between group hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                  {st.icon}
                </div>
                <span className="text-xs font-black text-slate-300">
                  0{st.num}
                </span>
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 mb-1">
                {st.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
