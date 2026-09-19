'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, ShieldCheck, PieChart, Users, HardDrive, Eye, Activity, CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { tenants, addTenant, schools, students } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'Basic' | 'Pro' | 'Enterprise'>('Pro');
  const [contactEmail, setContactEmail] = useState('');

  const totalSchools = schools.length;
  const totalStudents = students.length;

  const underReviewCount = students.filter(s => s.status === 'Under Review').length;
  const approvedCount = students.filter(s => s.status === 'Approved').length;
  const rejectedCount = students.filter(s => s.status === 'Rejected').length;
  const dispatchedCount = students.filter(s => s.status === 'Printing' || s.status === 'Dispatched').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactEmail) return;
    addTenant({
      name,
      plan,
      status: 'Active',
      schoolsCount: 0,
      studentsCount: 0,
      quotaLimit: plan === 'Enterprise' ? 15000 : plan === 'Pro' ? 6000 : 1500,
      contactEmail,
    });
    setName('');
    setContactEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards - Executive & Professional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Tenants</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight text-slate-900">{tenants.length}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              Live Hubs
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Onboarded Institutions</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight text-slate-900">{totalSchools}</span>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Colleges & Schools
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Processed ID Records</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black tracking-tight text-slate-900">{totalStudents}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70">
              Verified
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Print Engine Health</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold tracking-tight text-slate-900">Operational</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100%
            </span>
          </div>
        </div>
      </div>

      {/* Cross-Tenant Pipeline Observability Panel */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#E12836]" />
              Cross-Tenant Pipeline Health & Batch Observability
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live observability monitor across all client institutions and print queues.
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Super Admin View
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Status 1 */}
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Under Review
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{underReviewCount}</span>
              <span className="text-[11px] text-slate-500 font-medium">cards pending</span>
            </div>
          </div>

          {/* Status 2 */}
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Approved & Ready
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{approvedCount}</span>
              <span className="text-[11px] text-slate-500 font-medium">ready for print</span>
            </div>
          </div>

          {/* Status 3 */}
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#E12836]"></span>
                Action Required
              </span>
              <AlertCircle className="w-3.5 h-3.5 text-[#E12836]" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{rejectedCount}</span>
              <span className="text-[11px] text-slate-500 font-medium">corrections flagged</span>
            </div>
          </div>

          {/* Status 4 */}
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Printed & Dispatched
              </span>
              <Truck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{dispatchedCount}</span>
              <span className="text-[11px] text-slate-500 font-medium">completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Accounts List */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tenant Organizations & Printing Partners</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage tenant accounts, quotas, and production status.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E12836] hover:bg-[#c91f2c] text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Onboard New Partner
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Schools</th>
                <th className="py-3 px-4">Card Quota Usage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tenants.map(tenant => {
                const tenantSchools = schools.filter(s => s.tenantId === tenant.id).length;
                const tenantStudents = students.length;
                const usagePct = Math.round((tenantStudents / tenant.quotaLimit) * 100);

                return (
                  <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tenant.name}</div>
                      <div className="text-[11px] text-slate-400">{tenant.contactEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px]">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{tenantSchools} Institutions</td>
                    <td className="py-3.5 px-4">
                      <div className="w-40">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                          <span>{tenantStudents} cards</span>
                          <span>{usagePct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                          <div
                            className={`h-full ${
                              usagePct > 85 ? 'bg-rose-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-[#E12836]'
                            }`}
                            style={{ width: `${Math.min(usagePct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Opening plan configuration for ${tenant.name}`)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
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

      {/* Onboard Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Onboard New Printing Partner</h3>
            <p className="text-xs text-slate-500">Create a new organizational tenant profile and allocate printing quotas.</p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Partner / Organization Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Apex ID Solutions"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="partner@printops.com"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Subscription Plan & Card Quota</label>
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836]"
                >
                  <option value="Basic">Basic (1,500 ID Cards / Year)</option>
                  <option value="Pro">Pro (6,000 ID Cards / Year)</option>
                  <option value="Enterprise">Enterprise (15,000 ID Cards / Year)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E12836] hover:bg-[#c91f2c] text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Create Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
