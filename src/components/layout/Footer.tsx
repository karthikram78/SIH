'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Building, Heart, RotateCcw, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetDemoData } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Avadi Connect Logo"
              className="h-10 w-auto object-contain rounded-md"
            />
            <span className="font-extrabold text-white text-lg tracking-tight">
              Namma <span className="text-emerald-400">Sevai</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Smart Cooperative Platform for Independent Local Workers. Developed for Smart India Hackathon 2024 — Problem Statement SIH26089.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold">
            &quot;Sahakar Se Samriddhi — Prosperity through Cooperation&quot;
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
            Cooperative Services
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>Plumbing & Water Sanitation</li>
            <li>Electrical & MCB Diagnostics</li>
            <li>Deep Cleaning & Sanitization</li>
            <li>Emergency Puncture & Mechanic</li>
            <li>Carpentry, Masonry & Painting</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
            Governance & Privacy
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>Ministry of Cooperation Guidelines</li>
            <li>85/10/5 Fair Payout Architecture</li>
            <li>Cooperative Welfare Fund Trust</li>
            <li>Protected Document Vault (Redacted)</li>
            <li>Democratic Board Representation</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
            Live Demonstration Utilities
          </h4>
          <p className="text-[11px] text-slate-400">
            Switch between personas anytime using the interactive top switcher. State is synchronized across all views.
          </p>
          <button
            onClick={resetDemoData}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed State</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <div>
          © 2024 Avadi Connect. Ministry of Cooperation Initiative. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Prototype built for SIH Evaluation</span>
          <span>•</span>
          <span>Sample data only</span>
        </div>
      </div>
    </footer>
  );
};
