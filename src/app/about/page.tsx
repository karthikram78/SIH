'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  Users,
  Award,
  HeartHandshake,
  TrendingUp,
  Scale,
  CheckCircle2,
  ArrowRight,
  Building2,
  Sparkles,
  Landmark,
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • Ministry of Cooperation (SIH26089)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Avadi Connect</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              &quot;Connecting Skills with Community Needs&quot;
            </p>
            <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Avadi Connect is India&apos;s pioneering cooperative-owned digital service marketplace. We connect citizens directly with verified independent local skilled tradespeople, breaking the monopoly of private gig aggregators and restoring economic dignity and welfare to workers.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Cooperative Owned</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike profit-driven corporate gig apps that extract 25-35% commissions, Avadi Connect is governed by registered artisan and worker cooperatives. Profits return to workers in the form of social security and dividends.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">4-Point Trust Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every worker on our platform is backed by cooperative vetting: Identity Verification, Trade Skill Proof, Physical Workplace/Shop Audit, and Mobile OTP Verification.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Transparent 85-10-5 Split</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every rupee paid by the customer is split transparently: <strong>85%</strong> directly to the worker, <strong>10%</strong> to the cooperative welfare fund (medical & accident insurance), and <strong>5%</strong> for minimal platform maintenance.
              </p>
            </div>
          </div>

          {/* Ministry Problem Statement Context */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-black text-white">The SIH26089 Mandate</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Under Problem Statement SIH26089 issued by the Ministry of Cooperation, the government recognized that millions of informal daily-wage artisans — electricians, plumbers, mechanics, carpenters, and domestic workers — lack digital market visibility, creditworthiness, and social safety nets. Avadi Connect operationalizes cooperative societies as the backbone of the digital gig economy.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-3xl font-black text-amber-400">85%</div>
                <div className="text-xs text-slate-400 mt-1">Direct Net Worker Share</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">10%</div>
                <div className="text-xs text-slate-400 mt-1">Coop Welfare & Insurance</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-400">4-Point</div>
                <div className="text-xs text-slate-400 mt-1">Institutional Verification</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-400">15+</div>
                <div className="text-xs text-slate-400 mt-1">Essential Service Trades</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-black">Join the Cooperative Revolution</h2>
            <p className="text-base text-slate-900 max-w-xl mx-auto font-medium">
              Whether you are a resident needing trusted household help or a skilled tradesperson seeking fair wages and welfare benefits, Avadi Connect is built for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-2xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-900 transition-all shadow-md"
              >
                Explore Services
              </Link>
              <Link
                href="/register?role=worker"
                className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-md"
              >
                Register as a Worker
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
