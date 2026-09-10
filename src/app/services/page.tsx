'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  UserCheck,
  HeartHandshake,
  Car,
  Flower2,
  Sparkles,
  Cog,
  Tv,
  ArrowRight,
  ShieldCheck,
  Clock,
  IndianRupee,
} from 'lucide-react';

export default function ServicesPage() {
  const { serviceCategories } = useApp();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  const groups = ['All', 'Home Services', 'Vehicle Services', 'Community Services', 'Personal Services'];

  const filteredCategories = useMemo(() => {
    return serviceCategories.filter((cat) => {
      const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [serviceCategories, selectedGroup, searchQuery]);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'plumbing':
        return Wrench;
      case 'electrical':
        return Zap;
      case 'carpentry':
        return Hammer;
      case 'painting':
        return Paintbrush;
      case 'cleaning & housekeeping':
      case 'cleaning':
        return Sparkles;
      case 'gardening':
        return Flower2;
      case 'vehicle repair':
      case 'puncture & two wheeler':
      case 'mechanic':
        return Cog;
      case 'driver services':
      case 'drivers':
        return Car;
      case 'appliance repair':
      case 'technician':
        return Tv;
      case 'caregiving & eldercare':
      case 'caregivers':
        return HeartHandshake;
      default:
        return Wrench;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Explore <span className="text-amber-400">Cooperative Services</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              Verified independent tradespeople across 15+ community and household categories with transparent statutory pricing.
            </p>

            {/* Search Input */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, trade or problem (e.g. tap repair, wiring, puncture)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Group Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGroup === grp
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredCategories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.name);
              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {cat.group}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cat.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {cat.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-medium">
                          +{cat.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Starting from</span>
                      <div className="flex items-center text-base font-black text-slate-900">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                        <span>{cat.basePrice}</span>
                        <span className="text-xs text-slate-400 font-normal ml-1">/ visit</span>
                      </div>
                    </div>

                    <Link
                      href={`/customer/request-service?category=${encodeURIComponent(cat.name)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No matching service categories found</h3>
              <p className="text-xs text-slate-500 mt-1">Try searching for other terms like plumbing, mechanic, cleaner, or electrician.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
