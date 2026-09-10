'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { User, Wrench, Users, Shield, SlidersHorizontal, Lock } from 'lucide-react';

interface RoleSwitcherBannerProps {
  onOpenWeightsConfig: () => void;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherBannerProps> = ({ onOpenWeightsConfig }) => {
  const { currentRole, setCurrentRole, serviceRequests, isAuthenticated, currentUser } = useApp();

  const activeJobsCount = serviceRequests.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled'
  ).length;

  const roles: { id: UserRole; label: string; sub: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'customer',
      label: 'Customer',
      sub: 'Priya Sharma (Book Service)',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'worker',
      label: 'Worker',
      sub: 'Arun Kumar (Plumber)',
      icon: <Wrench className="w-4 h-4" />,
      badge: activeJobsCount > 0 ? `${activeJobsCount} Active` : undefined,
    },
    {
      id: 'cooperative_admin',
      label: 'Cooperative Admin',
      sub: 'Chennai Central Coop',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'platform_admin',
      label: 'Platform Admin',
      sub: 'Audit & Verifications',
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-2.5 px-4 shadow-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Role Locked ({currentUser.role})</span>
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              SIH Interactive Role Switcher
            </span>
          )}
          <span className="text-xs text-slate-300 hidden lg:inline">
            {isAuthenticated
              ? `Signed in as ${currentUser.name}. Customer and Worker cannot enter in both portals simultaneously.`
              : 'Switch persona to test real-time state sync across Customer, Worker, Cooperative & Platform'}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-700">
            {roles.map((r) => {
              const isActive = currentRole === r.id;
              const isCrossRoleBlocked =
                isAuthenticated &&
                ((currentUser.role === 'customer' && r.id === 'worker') ||
                  (currentUser.role === 'worker' && r.id === 'customer'));

              return (
                <button
                  key={r.id}
                  onClick={() => {
                    if (isCrossRoleBlocked) {
                      alert(`Access Restricted: You are signed in as a ${currentUser.role}. Please sign out to enter the ${r.label} portal.`);
                      return;
                    }
                    setCurrentRole(r.id);
                  }}
                  title={
                    isCrossRoleBlocked
                      ? `Access restricted: Signed in as ${currentUser.role}. Sign out to switch.`
                      : undefined
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                      : isCrossRoleBlocked
                      ? 'text-slate-500 opacity-60 cursor-not-allowed hover:bg-transparent'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {isCrossRoleBlocked ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : r.icon}
                  <div className="text-left">
                    <span className="block leading-tight">{r.label}</span>
                  </div>
                  {r.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                      {r.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenWeightsConfig}
            title="Configure Smart Matching Weights"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tune Match Algorithm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
