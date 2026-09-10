'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { currentRole, isAuthenticated, currentUser } = useApp();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If not authenticated, or current role is not in allowedRoles
    const timer = setTimeout(() => {
      setChecking(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [isAuthenticated, currentRole]);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  // If not logged in, prompt to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Authentication Required</h2>
            <p className="text-sm text-slate-600 mt-2">
              You must sign in to access this portal. Please log in with your verified credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // If authenticated but wrong role
  if (!allowedRoles.includes(currentRole)) {
    const roleNames: Record<UserRole, string> = {
      customer: 'Customer',
      worker: 'Worker',
      cooperative_admin: 'Cooperative Admin',
      platform_admin: 'Platform Admin',
    };

    const dashboardRedirects: Record<UserRole, string> = {
      customer: '/customer/dashboard',
      worker: '/worker/dashboard',
      cooperative_admin: '/cooperative/dashboard',
      platform_admin: '/admin/dashboard',
    };

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-rose-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-sm text-slate-600 mt-2">
              Your account role is <span className="font-bold text-slate-900 uppercase">{roleNames[currentRole]}</span>.
              This area is strictly reserved for: <span className="font-semibold text-rose-700">{allowedRoles.map(r => roleNames[r]).join(', ')}</span>.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href={dashboardRedirects[currentRole] || '/'}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md"
            >
              <span>Go to Your {roleNames[currentRole]} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-block text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              Switch Account / Role
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
