'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Building,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
} from 'lucide-react';
import { AI_DEMAND_FORECASTS } from '@/lib/demandForecast';

export const CooperativeDashboardView: React.FC = () => {
  const { workers, cooperatives, serviceRequests } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'jobs' | 'forecast'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [forecastAlertSent, setForecastAlertSent] = useState(false);

  const coop = cooperatives[0]; // Trichy Local Service Cooperative Society

  const coopWorkers = workers.filter((w) => w.cooperativeId === coop.id);
  const activeWorkers = coopWorkers.filter((w) => w.availability === 'available' || w.availability === 'busy');

  const coopJobs = serviceRequests.filter((r) => {
    const assignedWorker = workers.find((w) => w.id === r.assignedWorkerId);
    return assignedWorker?.cooperativeId === coop.id;
  });

  const filteredWorkers = coopWorkers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrade = tradeFilter === 'all' || w.primaryCategory === tradeFilter;
    return matchesSearch && matchesTrade;
  });

  const handleSendForecastAlert = () => {
    setForecastAlertSent(true);
    setTimeout(() => setForecastAlertSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cooperative Header */}
      <div className="bg-gradient-to-r from-slate-900 via-coop-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-coop-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-coop-500/20 text-emerald-400 border border-emerald-500/30">
              <Building className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Reg. No: {coop.registrationNumber}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mt-1">{coop.name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            District: <strong>{coop.district}, {coop.state}</strong> • Est. {coop.establishedYear} • Administrator: {coop.contactPerson}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-coop-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'members' ? 'bg-coop-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Members ({coopWorkers.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'jobs' ? 'bg-coop-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Jobs ({coopJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'forecast' ? 'bg-amber-600 text-white shadow-md' : 'text-amber-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Forecast</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Section 15) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Members Registered
          </span>
          <div className="text-3xl font-black text-slate-900">
            {coop.membersCount}
          </div>
          <span className="text-xs text-coop-600 font-semibold mt-1 inline-block">
            Across 12 service trades
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Workers on Field
          </span>
          <div className="text-3xl font-black text-emerald-600">
            {coop.activeWorkersCount}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            69.3% workforce utilization
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Member Earnings
          </span>
          <div className="text-3xl font-black text-slate-900">
            ₹{(coop.monthlyEarningsTotal / 100000).toFixed(2)}L
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            +14% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Cooperative Welfare Fund
          </span>
          <div className="text-3xl font-black text-saffron-600">
            ₹{(coop.welfareFundBalance).toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Health insurance & tool pool
          </span>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* AI Demand Forecast Card (Section 15) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-amber-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Predictive Analytics Engine
                  </span>
                  <h3 className="text-xl font-black">AI Demand Forecast & Workforce Allocation</h3>
                </div>
              </div>
              <button
                onClick={handleSendForecastAlert}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <BellRing className="w-4 h-4" />
                <span>{forecastAlertSent ? 'Alert Dispatched to 14 Members!' : 'Broadcast Workforce Alert'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {AI_DEMAND_FORECASTS.map((fc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{fc.category}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px]">
                      {fc.predictedDemandChange}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs">{fc.urgencyNotice}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{fc.reason}</p>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-amber-200">
                    <strong>Action:</strong> {fc.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Category Demand distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Service Demand Breakdown (This Month)
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Plumbing Services</span>
                    <span>312 jobs (35%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Electrical Repairs</span>
                    <span>245 jobs (28%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Deep Cleaning & Sanitation</span>
                    <span>168 jobs (19%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Roadside Puncture & Mechanic</span>
                    <span>115 jobs (13%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cooperative Welfare Fund Utilization */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Welfare Fund Allocations
              </h3>
              <p className="text-xs text-slate-500">
                Funded by the transparent 10% contribution from every completed job.
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-coop-50 border border-coop-200 flex items-center justify-between">
                  <div className="font-semibold text-coop-900">Worker Group Health & Accident Policy</div>
                  <span className="font-bold text-coop-800">₹22,500</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="font-semibold text-slate-800">Tool Subsidy & Modern Equipment Pool</div>
                  <span className="font-bold text-slate-900">₹14,200</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="font-semibold text-amber-900">Emergency Distress Reserve</div>
                  <span className="font-bold text-amber-800">₹11,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Members Roster */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search member name or skill..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-saffron-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="all">All Trades</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Mechanic & Vehicle Repair">Mechanic</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Trade</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Jobs</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{w.name}</div>
                        <div className="text-[11px] text-slate-500">{w.mobile}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{w.primaryCategory}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full capitalize text-[10px] ${
                          w.availability === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.availability === 'busy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {w.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-500">
                      ⭐ {w.rating.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {w.completedJobsCount}
                    </td>
                    <td className="py-3 px-4">
                      {w.isOverallVerified ? (
                        <span className="text-coop-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Audit Pending</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Jobs */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-slate-900">
            Cooperative Job Dispatch Log
          </h3>
          <div className="space-y-3 text-xs">
            {coopJobs.length === 0 ? (
              <div className="text-slate-400 py-6 text-center">No active jobs in this cooperative jurisdiction right now.</div>
            ) : (
              coopJobs.map((j) => (
                <div
                  key={j.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-500">#{j.id}</span>
                      <span className="font-bold text-slate-900">{j.serviceCategory}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {j.status}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-1">
                      Customer: <strong>{j.customerName}</strong> • Assigned: <strong>{j.assignedWorker?.name}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900">₹{j.amount}</div>
                    <div className="text-[11px] text-coop-700 font-semibold">
                      Coop Fund: ₹{j.paymentBreakdown?.cooperativeContribution || Math.round(j.amount * 0.10)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Forecast Details */}
      {activeTab === 'forecast' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Detailed AI Predictive Workforce Advisory
              </h3>
              <p className="text-xs text-slate-500">Based on historical seasonal demand and hyper-local data</p>
            </div>
            <button
              onClick={handleSendForecastAlert}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              Broadcast Action Notice
            </button>
          </div>

          <div className="space-y-4">
            {AI_DEMAND_FORECASTS.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900">{item.category}</span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs">
                    {item.predictedDemandChange}
                  </span>
                </div>
                <p className="text-slate-700">{item.reason}</p>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>High Impact Zones: <strong>{item.affectedZones.join(', ')}</strong></span>
                </div>
                <div className="p-3 bg-coop-50 rounded-xl text-coop-900 font-semibold">
                  Recommended Cooperative Action: {item.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
