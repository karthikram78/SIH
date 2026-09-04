'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wrench,
  Zap,
  Sparkles,
  Tv,
  Hammer,
  Paintbrush,
  Car,
  CircleDot,
  BrickWall,
  Sprout,
  ChefHat,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { ServiceCategory } from '@/types';

interface CategoryCardsProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { serviceCategories } = useApp();
  const [activeGroup, setActiveGroup] = useState<string>('All');

  const groups = ['All', 'Home Services', 'Vehicle Services', 'Personal Services', 'Community Services'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      case 'Hammer': return <Hammer className="w-6 h-6" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6" />;
      case 'Car': return <Car className="w-6 h-6" />;
      case 'CircleDot': return <CircleDot className="w-6 h-6" />;
      case 'BrickWall': return <BrickWall className="w-6 h-6" />;
      case 'Sprout': return <Sprout className="w-6 h-6" />;
      case 'ChefHat': return <ChefHat className="w-6 h-6" />;
      case 'Truck': return <Truck className="w-6 h-6" />;
      default: return <Wrench className="w-6 h-6" />;
    }
  };

  const filteredCategories = serviceCategories.filter((cat) => {
    if (activeGroup === 'All') return true;
    return cat.group === activeGroup;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">
            Cooperative Trades & Services
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
            Explore Skilled Local Services
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Verified independent workers backed by local cooperative societies.
          </p>
        </div>

        {/* Group Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setActiveGroup(grp)}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeGroup === grp
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'border-saffron-500 bg-saffron-50/50 shadow-md ring-2 ring-saffron-200'
                  : 'border-slate-200 bg-white hover:border-saffron-300 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-3 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-saffron-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-saffron-100 group-hover:text-saffron-700'
                    }`}
                  >
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {cat.group.split(' ')[0]}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 group-hover:text-saffron-700 transition">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  From <strong className="text-slate-900 font-bold">₹{cat.basePrice}</strong>
                </span>
                <span className="font-bold text-saffron-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
