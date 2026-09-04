'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { DEFAULT_WEIGHTS } from '@/lib/matchingEngine';
import { X, Sliders, RotateCcw, Info, Sparkles } from 'lucide-react';
import { MatchWeights } from '@/types';

interface SmartMatchingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartMatchingDrawer: React.FC<SmartMatchingDrawerProps> = ({ isOpen, onClose }) => {
  const { weights, setWeights } = useApp();

  if (!isOpen) return null;

  const totalWeight =
    weights.skill +
    weights.distance +
    weights.availability +
    weights.rating +
    weights.verification +
    weights.experience;

  const handleSliderChange = (key: keyof MatchWeights, value: number) => {
    setWeights({
      ...weights,
      [key]: value,
    });
  };

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const weightSliders: { key: keyof MatchWeights; label: string; desc: string; color: string }[] = [
    {
      key: 'skill',
      label: 'Skill & Category Relevance',
      desc: 'Matches exact trade certification and required repair skill',
      color: 'accent-saffron-600',
    },
    {
      key: 'distance',
      label: 'Proximity (Distance)',
      desc: 'Haversine distance from customer GPS coordinates',
      color: 'accent-blue-600',
    },
    {
      key: 'availability',
      label: 'Real-time Availability',
      desc: 'Bonus for workers toggled 🟢 Available right now',
      color: 'accent-emerald-600',
    },
    {
      key: 'rating',
      label: 'Customer Rating & Satisfaction',
      desc: 'Historical average score from past cooperative jobs',
      color: 'accent-amber-500',
    },
    {
      key: 'verification',
      label: 'Cooperative Verification Tier',
      desc: 'Badges: Identity, Skill/ITI, Shop license, Mobile',
      color: 'accent-coop-600',
    },
    {
      key: 'experience',
      label: 'Field Experience (Years)',
      desc: 'Years in active service trade',
      color: 'accent-purple-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-saffron-100 text-saffron-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Smart Matching Weights</h3>
              <p className="text-xs text-slate-500 font-medium">Configurable Multi-Factor Scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              As per <strong>SIH Requirement Section 9</strong>, the matching algorithm uses weighted scoring rather than opaque black-box ML. Adjust these weights to see immediate recalculation in the worker rankings.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 font-bold text-xs text-slate-700">
            <span>Total Weight Normalized:</span>
            <span className={totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}>
              {totalWeight}% {totalWeight !== 100 && '(Auto-normalized)'}
            </span>
          </div>

          <div className="space-y-5">
            {weightSliders.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <span className="font-extrabold text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                    {weights[item.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights[item.key]}
                  onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                  className={`w-full h-2 bg-slate-200 rounded-lg cursor-pointer ${item.color}`}
                />
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-500/20 transition"
          >
            Apply & View Ranking
          </button>
        </div>
      </div>
    </div>
  );
};
