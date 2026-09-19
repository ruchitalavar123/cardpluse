'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, ShieldCheck, PieChart, Users, HardDrive, AlertTriangle, Eye } from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { tenants, addTenant, schools, students } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'Basic' | 'Pro' | 'Enterprise'>('Pro');
  const [contactEmail, setContactEmail] = useState('');

  const totalSchools = schools.length;
  const totalStudents = students.length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactEmail) return;
    addTenant({
      name,
      plan,
      status: 'Active',
      schoolsCount: 0,
      studentsCount: 0,
      quotaLimit: plan === 'Enterprise' ? 10000 : plan === 'Pro' ? 5000 : 1000,
      contactEmail,
    });
    setName('');
    setContactEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Tenants</p>
            <p className="text-2xl font-bold text-white">{tenants.length}</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Onboarded Schools</p>
            <p className="text-2xl font-bold text-white">{totalSchools}</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Generated IDs</p>
            <p className="text-2xl font-bold text-white">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">System Health</p>
            <p className="text-lg font-bold text-emerald-400">100% Operational</p>
          </div>
        </div>
      </div>

      {/* Cross-Tenant Pipeline Health Observability (Read-Only) */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              Cross-Tenant Pipeline Health & Observability (Read-Only)
            </h3>
            <p className="text-xs text-slate-400">
              PRD 5.1.3: Super Admin macro observability dashboard for monitoring batch bottlenecks across all tenants.
            </p>
          </div>
          <span className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full">
            Passive Support Access
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-lg">
            <span className="text-xs text-slate-400 block">Under Review</span>
            <span className="text-xl font-bold text-amber-400">
              {students.filter(s => s.status === 'Under Review').length} Cards
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-lg">
            <span className="text-xs text-slate-400 block">Approved & Queued</span>
            <span className="text-xl font-bold text-emerald-400">
              {students.filter(s => s.status === 'Approved').length} Cards
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-lg">
            <span className="text-xs text-slate-400 block">Rejected / Corrections</span>
            <span className="text-xl font-bold text-rose-400">
              {students.filter(s => s.status === 'Rejected').length} Cards
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-lg">
            <span className="text-xs text-slate-400 block">Printed / Dispatched</span>
            <span className="text-xl font-bold text-blue-400">
              {students.filter(s => s.status === 'Printing' || s.status === 'Dispatched').length} Cards
            </span>
          </div>
        </div>
      </div>

      {/* Tenant Accounts List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Tenant Organizations</h3>
            <p className="text-xs text-slate-400">Manage tenant subscriptions, limits, and operational status.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Onboard New Tenant
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Schools</th>
                <th className="py-3 px-4">Quota Usage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {tenants.map(tenant => {
                const tenantSchools = schools.filter(s => s.tenantId === tenant.id).length;
                const tenantStudents = students.length;
                const usagePct = Math.round((tenantStudents / tenant.quotaLimit) * 100);

                return (
                  <tr key={tenant.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{tenant.name}</div>
                      <div className="text-[11px] text-slate-400">{tenant.contactEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{tenantSchools} Schools</td>
                    <td className="py-3 px-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>{tenantStudents} cards</span>
                          <span>{usagePct}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              usagePct > 85 ? 'bg-rose-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(usagePct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px]">
                        Manage Plan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Onboard New Tenant Organization</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Apex Education Group"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="admin@tenant.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Subscription Tier</label>
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Basic">Basic (1,000 Cards/mo)</option>
                  <option value="Pro">Pro (5,000 Cards/mo)</option>
                  <option value="Enterprise">Enterprise (10,000 Cards/mo)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
