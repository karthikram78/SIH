'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Search, ArrowRight, ShieldCheck, Clock, AlertTriangle, Cpu } from 'lucide-react';
import { analyzeServiceRequest } from '@/lib/aiServiceParser';
import { analyzeServiceRequestApi } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { AIServiceAnalysis } from '@/types';

interface AIRequestCardProps {
  onSearch: (analysis: AIServiceAnalysis, queryText: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export const AIRequestCard: React.FC<AIRequestCardProps> = ({
  onSearch,
  selectedCategory,
  onSelectCategory,
}) => {
  const { isBackendConnected } = useApp();
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<AIServiceAnalysis>(() =>
    analyzeServiceRequest('My kitchen tap is leaking')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounced auto-analysis
  useEffect(() => {
    if (!query.trim()) {
      setAnalysis(analyzeServiceRequest('General home maintenance'));
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(async () => {
      if (isBackendConnected) {
        try {
          const apiRes = await analyzeServiceRequestApi(query);
          setAnalysis(apiRes);
          setIsAnalyzing(false);
          return;
        } catch {
          // fallback
        }
      }
      const res = analyzeServiceRequest(query);
      setAnalysis(res);
      setIsAnalyzing(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query, isBackendConnected]);

  const exampleQueries = [
    { text: 'My kitchen tap is leaking', label: '🚰 Tap Leak' },
    { text: 'Ceiling fan stopped working with sparking sound', label: '⚡ Fan Spark' },
    { text: 'Bike flat tyre on highway near bypass', label: '🛵 Flat Tyre' },
    { text: 'Need house deep cleaning before festival', label: '🧹 Deep Cleaning' },
    { text: 'AC not cooling and water dripping', label: '❄️ AC Repair' },
    { text: 'Front door wooden lock jammed', label: '🔐 Lock Jam' },
  ];

  const handleChipClick = (text: string) => {
    setQuery(text);
    const res = analyzeServiceRequest(text);
    setAnalysis(res);
    if (onSelectCategory) {
      onSelectCategory(res.detectedService);
    }
  };

  const handleFindHelp = () => {
    onSearch(analysis, query || 'My kitchen tap is leaking');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-saffron-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-coop-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-saffron-100 text-saffron-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">
              AI-Powered Service Classifier
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Natural Language Understanding</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          What service do you need?
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Type naturally in plain English or Tamil-English. Our cooperative AI will identify the exact trade and skill needed.
        </p>

        {/* Input Bar */}
        <div className="mt-5 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. My kitchen tap is leaking or Need AC gas filling..."
              className="w-full pl-12 pr-36 py-4 rounded-xl border-2 border-slate-200 focus:border-saffron-500 focus:ring-4 focus:ring-saffron-100 outline-none text-base text-slate-800 transition placeholder:text-slate-400 font-medium shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFindHelp();
              }}
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              onClick={handleFindHelp}
              className="absolute right-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-saffron-500/30 flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Find Help</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prompt Suggestion Chips */}
        <div className="mt-3 flex items-center flex-wrap gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-1">Quick Suggestions:</span>
          {exampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(item.text)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full transition border border-slate-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Live AI Service Analysis Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                AI Service Analysis
              </span>
              {isAnalyzing && (
                <span className="text-[10px] text-saffron-600 font-semibold animate-pulse">
                  Analyzing intent...
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-coop-600" />
              <span className="font-semibold text-coop-800">Cooperative Verified Standard</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {/* Detected Service */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Detected Service
              </span>
              <span className="font-extrabold text-sm text-slate-900 block truncate">
                {analysis.detectedService}
              </span>
            </div>

            {/* Problem */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Specific Problem
              </span>
              <span className="font-bold text-xs text-slate-800 block truncate" title={analysis.problem}>
                {analysis.problem}
              </span>
            </div>

            {/* Urgency */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Urgency Level
              </span>
              <span
                className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded capitalize ${
                  analysis.urgency === 'emergency'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : analysis.urgency === 'high'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {analysis.urgency === 'emergency' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                {analysis.urgency === 'high' && <Clock className="w-3 h-3 text-amber-600" />}
                {analysis.urgency}
              </span>
            </div>

            {/* Required Skill */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Required Skill
              </span>
              <span className="font-bold text-xs text-saffron-700 block truncate" title={analysis.requiredSkill}>
                {analysis.requiredSkill}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
            <span>Estimated cooperative fair price: <strong className="text-slate-800">{analysis.estimatedCostRange}</strong></span>
            <button
              onClick={handleFindHelp}
              className="font-bold text-saffron-700 hover:text-saffron-800 flex items-center gap-1 underline underline-offset-2"
            >
              <span>Find Nearby Help Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
