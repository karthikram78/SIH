'use client';

import React from 'react';
import {
  FileText,
  Sparkles,
  UserCheck,
  Wrench,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: '1. Request a Service',
      desc: 'Describe your issue in plain words or pick from categorized trades. Our AI pinpoints the exact skill needed.',
      icon: <FileText className="w-6 h-6 text-saffron-600" />,
      tag: 'Natural Language AI',
    },
    {
      num: 2,
      title: '2. Smart Matching',
      desc: 'Our weighted algorithm ranks workers by skill relevance, proximity, duty availability, rating, and cooperative verification.',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      tag: 'Transparent Scoring',
    },
    {
      num: 3,
      title: '3. Choose Verified Worker',
      desc: 'Inspect background profiles, trade qualifications, customer reviews, and cooperative badges without privacy exposure.',
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      tag: 'Cooperative Vetted',
    },
    {
      num: 4,
      title: '4. Get the Work Done',
      desc: 'Track arrival in real time. Validate safety using 4-digit OTP. Worker executes repair using standardized quality tools.',
      icon: <Wrench className="w-6 h-6 text-blue-600" />,
      tag: 'Secure OTP Handshake',
    },
    {
      num: 5,
      title: '5. Rate & Pay',
      desc: 'Enjoy transparent pricing where 85% goes directly to the worker and 10% funds their cooperative welfare benefits.',
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      tag: '85/10/5 Fair Payout',
    },
  ];

  return (
    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">
          Seamless Experience
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
          How Namma Sevai Works
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          From your first request to final transparent settlement in 5 simple, community-backed steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((st, idx) => (
          <div
            key={st.num}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                  {st.icon}
                </div>
                <span className="text-2xl font-black text-slate-200">
                  0{st.num}
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200 inline-block mb-1.5">
                {st.tag}
              </span>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {st.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
