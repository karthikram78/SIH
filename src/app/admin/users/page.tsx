'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/common/RoleGuard';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Building,
  User,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { workers } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Unified sample users roster
  const sampleUsers = [
    { id: 'u-1', name: 'Priya Sharma', mobile: '+91 98421 77312', email: 'priya.sharma@example.com', role: 'customer', location: 'T. Nagar, Chennai', status: 'Active' },
    { id: 'u-2', name: 'Arun Kumar', mobile: '+91 94421 88392', email: 'arun.plumber.chennai@example.com', role: 'worker', location: 'T. Nagar, Chennai', status: 'Active (Verified)' },
    { id: 'u-3', name: 'M. Senthil Nathan', mobile: '+91 94435 88123', email: 'senthil.electrician@example.com', role: 'worker', location: 'Anna Nagar, Chennai', status: 'Active (Verified)' },
    { id: 'u-4', name: 'K. Meenakshi', mobile: '+91 94431 88220', email: 'chennai.coop@example.com', role: 'cooperative_admin', location: 'Chennai Central Coop', status: 'Active' },
    { id: 'u-5', name: 'Central Admin Desk', mobile: '+91 98000 00001', email: 'admin@nammasevai.gov.in', role: 'platform_admin', location: 'Secretariat, Chennai', status: 'SuperAdmin' },
    { id: 'u-6', name: 'R. Balasubramanian', mobile: '+91 94421 33455', email: 'bala.customer@example.com', role: 'customer', location: 'Mylapore, Chennai', status: 'Active' },
    { id: 'u-7', name: 'Vikram Singh', mobile: '+91 98842 11990', email: 'vikram.carpenter@example.com', role: 'worker', location: 'Adyar, Chennai', status: 'Active (Verified)' },
  ];

  const filtered = useMemo(() => {
    return sampleUsers.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile.includes(search);
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [sampleUsers, search, roleFilter]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'customer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">Customer</span>;
      case 'worker':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Worker</span>;
      case 'cooperative_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Cooperative Admin</span>;
      case 'platform_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">Platform Admin</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">{role}</span>;
    }
  };

  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">User Accounts Directory</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Central role-based access management across Customers, Workers, Cooperative Admins, and Platform Auditors.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, or mobile..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {['All', 'customer', 'worker', 'cooperative_admin', 'platform_admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    roleFilter === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Location / Zone</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4">{getRoleBadge(u.role)}</td>
                      <td className="p-4">
                        <span className="block text-slate-800">{u.email}</span>
                        <span className="text-[10px] text-slate-400">{u.mobile}</span>
                      </td>
                      <td className="p-4 text-slate-600">{u.location}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RoleGuard>
  );
}
