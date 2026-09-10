'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Star,
  ArrowRight,
  ArrowDown,
  Building,
  ShieldAlert,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: 'Request Service',
      desc: 'Tell us your issue using natural language (e.g., "Kitchen pipe is leaking") or choose from our 15+ verified trades. Our AI classifier maps the exact skill required.',
      icon: Search,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      num: '02',
      title: 'Location Detection',
      desc: 'Browser geolocation pinpoints your exact GPS coordinates. We calculate real travel distances across your local municipal zone.',
      icon: MapPin,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      num: '03',
      title: 'Smart Matching Engine',
      desc: 'Our 6-factor algorithm ranks available workers: 30% Skill, 25% Distance, 15% Availability, 10% Rating, 10% Verification, 10% Experience.',
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      num: '04',
      title: 'Verified Worker Dispatch',
      desc: 'Only cooperative-affiliated workers with verified Identity, Trade Skill, Physical Shop/Workplace, and Mobile OTP arrive at your doorstep.',
      icon: ShieldCheck,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      num: '05',
      title: 'Job Completion & Security OTP',
      desc: 'Worker carries out service with upfront hourly and fixed rate guidelines. A 4-digit completion OTP ensures verified sign-off.',
      icon: CheckCircle2,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      num: '06',
      title: 'Transparent Payment Simulation',
      desc: 'Simulated payment directly debits fees: 85% directly to worker net earnings, 10% to cooperative welfare fund, 5% platform fee.',
      icon: CreditCard,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      num: '07',
      title: 'Community Rating & Review',
      desc: 'Provide honest star ratings and feedback. Only verified customers who finished a job can submit reviews, preventing fake ratings.',
      icon: Star,
      color: 'bg-rose-100 text-rose-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              How <span className="text-amber-400">Avadi Connect</span> Works
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              From instant request to verified completion — a transparent, cooperative-backed lifecycle designed for community trust.
            </p>
          </div>
        </div>

        {/* Steps Journey */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative border-l-2 border-amber-200 ml-4 sm:ml-32 space-y-12">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="relative pl-8 sm:pl-12 group">
                  {/* Step Number on Left for Desktop */}
                  <div className="hidden sm:block absolute -left-28 top-1 text-right w-20">
                    <span className="text-2xl font-black text-amber-600">{step.num}</span>
                    <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-wider">Step</span>
                  </div>

                  {/* Node Circle */}
                  <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                  </div>

                  {/* Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-600 sm:hidden">Step {step.num}</span>
                        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Hub */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black">Experience the Flow Live</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Test out our smart request flow right now. Submit a sample problem or select your required trade.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/customer/request-service"
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/customer/nearby-workers"
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>View Nearby Workers</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
