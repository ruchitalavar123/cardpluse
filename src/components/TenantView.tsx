'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IDCardCanvas } from './IDCardCanvas';
import {
  Building2,
  Layout,
  Sliders,
  Printer,
  CheckCircle,
  Plus,
  Play,
  FileCheck,
  Eye,
  Edit,
  Layers,
  Sparkles,
  RotateCcw,
  Database,
  Users,
  Search,
  Filter,
  Folder,
  ChevronRight,
  ArrowLeft,
  Move,
  Type,
  ZoomIn,
  SlidersHorizontal,
  Image as ImageIcon,
  Palette,
  Lock,
  Key,
  Mail,
  Phone,
  User,
  EyeOff,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TenantView: React.FC = () => {
  const {
    activeTenantId,
    tenants,
    schools,
    addSchool,
    templates,
    addTemplate,
    masterFields,
    addMasterField,
    students,
    batches,
    updateStudentStatus,
    updateStudentPhotoFit,
    updateStudentData,
    applyBatchPhotoFit,
    applyBatchDataAdjustment,
    templateRequests,
    updateRequestStatus,
    updateTemplateLayout,
    batchForms,
    addBatchForm,
    addClassBatch,
  } = useApp();

  // Create Batch Modal State
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newDivision, setNewDivision] = useState('');
  const [newAcademicYear, setNewAcademicYear] = useState('2026-2027');

  const [activeTab, setActiveTab] = useState<'schools' | 'templates' | 'master_fields' | 'forms_builder' | 'pipeline' | 'live_data' | 'batch_proofing'>('schools');
  
  // Dedicated School Details Page State (when clicking on a school card)
  const [selectedSchoolDetailPage, setSelectedSchoolDetailPage] = useState<string | null>(null);

  // Hierarchical Drill-down Navigation State (Level 1: School Cards -> Level 2: Batch Folders -> Level 3: Students Table)
  const [navSchoolId, setNavSchoolId] = useState<string | null>(null);
  const [navBatchId, setNavBatchId] = useState<string | null>(null);

  // Proofing Hierarchical Drill-down State
  const [proofNavSchoolId, setProofNavSchoolId] = useState<string | null>(null);
  const [proofNavBatchId, setProofNavBatchId] = useState<string | null>(null);

  // Batch Pre-Release Proofing State
  const [proofSchoolId, setProofSchoolId] = useState<string>(schools[0]?.id || 'sch-1');
  const [proofBatchId, setProofBatchId] = useState<string>(batches[0]?.id || 'batch-1');
  const [proofTemplateId, setProofTemplateId] = useState<string>(templates[0]?.id || 'tpl-1');
  const [proofSide, setProofSide] = useState<'front' | 'back'>('front');
  const [activeTool, setActiveTool] = useState<'photo' | 'text'>('photo');
  const [selectedPlaceholderKey, setSelectedPlaceholderKey] = useState<string>('fullName');

  // Onboard School Modal State
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [assignedTplId, setAssignedTplId] = useState(templates[0]?.id || '');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [viewingCredsSchool, setViewingCredsSchool] = useState<any | null>(null);

  // Upload Template Modal State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState('School Standard');
  const [tplPrimaryColor, setTplPrimaryColor] = useState('#0f172a');
  const [tplAccentColor, setTplAccentColor] = useState('#38bdf8');
  const [tplPhotoShape, setTplPhotoShape] = useState<'rectangle' | 'rounded' | 'oval'>('rounded');
  const [tplFrontFileUrl, setTplFrontFileUrl] = useState<string | null>(null);
  const [tplBackFileUrl, setTplBackFileUrl] = useState<string | null>(null);

  // Proof Sample / Full Batch state
  const [selectedBatchStudent, setSelectedBatchStudent] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Admin Batch Form Builder State (Approach 2)
  const [adminTargetSchoolId, setAdminTargetSchoolId] = useState<string>(schools[0]?.id || 'sch-1');
  const adminSchoolBatches = batches.filter(b => b.schoolId === adminTargetSchoolId);
  const [adminTargetBatchId, setAdminTargetBatchId] = useState<string>(adminSchoolBatches[0]?.id || 'batch-1');
  const [adminCustomFields, setAdminCustomFields] = useState<Array<{ label: string; dataType: string }>>([
    { label: 'Hostel / Day Scholar Pass', dataType: 'text' }
  ]);
  const [adminCustomLabel, setAdminCustomLabel] = useState('');
  const [showAdminCustomModal, setShowAdminCustomModal] = useState(false);

  // New Master Field state
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'date' | 'select' | 'image'>('text');

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const tenantSchools = schools.filter(s => s.tenantId === activeTenantId);
  const tenantTemplates = templates.filter(t => t.tenantId === activeTenantId);
  const tenantStudents = students;

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !schoolCode) return;
    addSchool({
      tenantId: activeTenantId,
      name: schoolName,
      code: schoolCode,
      activeStudents: 0,
      pendingApprovals: 0,
      assignedTemplateId: assignedTplId,
      status: 'Active',
      adminName: adminName || 'School Admin',
      adminEmail: adminEmail || `${schoolCode.toLowerCase()}@school.edu`,
      adminPhone: adminPhone || '+91 98000 00000',
      username: username || `${schoolCode.toLowerCase()}_admin`,
      password: password || 'Password@123',
    });
    setSchoolName('');
    setSchoolCode('');
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
    setUsername('');
    setPassword('');
    setShowSchoolModal(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleCreateMasterField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel || !fieldKey) return;
    addMasterField({
      tenantId: activeTenantId,
      key: fieldKey,
      label: fieldLabel,
      dataType: fieldType,
      isRequired: true,
    });
    setFieldLabel('');
    setFieldKey('');
  };

  const handleTriggerBatchGeneration = () => {
    tenantStudents.forEach(s => {
      if (s.status === 'Data Submitted' || s.status === 'Batch Finalized') {
        updateStudentStatus(s.id, 'Under Review');
      }
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert('Proof sample (5 cards) and full-batch generation completed! Sent to School for preview.');
  };

  const handleUpdatePrintStatus = (status: 'Printing' | 'Dispatched') => {
    tenantStudents.forEach(s => {
      if (s.status === 'Approved' || s.status === 'Printing') {
        updateStudentStatus(s.id, status);
      }
    });
    if (status === 'Dispatched') {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    }
    setShowPrintModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 pb-3">
        <button
          onClick={() => setActiveTab('schools')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'schools'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Schools / Colleges ({tenantSchools.length})
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" /> Template Library ({tenantTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('master_fields')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'master_fields'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" /> Master Data Fields ({masterFields.length})
        </button>

        <button
          onClick={() => setActiveTab('live_data')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'live_data'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" /> Real-time Submissions Data ({tenantStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('batch_proofing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'batch_proofing'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4 text-emerald-400" /> Pre-Release Card Proofing
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'pipeline'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" /> Generation & Print Pipeline
        </button>
      </div>

      {/* TAB 1: SCHOOLS MANAGEMENT */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          {!selectedSchoolDetailPage ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Schools & Colleges Onboarded</h2>
                  <p className="text-xs text-slate-400">Click on any institution card to view its dedicated page, batch folders, forms, and student submissions.</p>
                </div>
                <button
                  onClick={() => setShowSchoolModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  <Plus className="w-4 h-4" /> Onboard School
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tenantSchools.map(school => {
                  const assignedTpl = templates.find(t => t.id === school.assignedTemplateId);
                  const schoolBatchesList = batches.filter(b => b.schoolId === school.id);
                  const schoolFormsList = batchForms.filter(f => f.schoolId === school.id);
                  const schoolStudentsList = students.filter(s => s.schoolId === school.id);

                  return (
                    <div
                      key={school.id}
                      onClick={() => setSelectedSchoolDetailPage(school.id)}
                      className="bg-slate-800/90 border border-slate-700/80 hover:border-blue-500/70 rounded-2xl p-5 shadow-lg relative space-y-3 cursor-pointer transition-all hover:scale-[1.01] group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                            {school.code}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            {school.name}
                            <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-700/50 grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-900/60 p-2 rounded-lg text-center border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Class Batches</span>
                          <span className="font-extrabold text-amber-400 text-sm">{schoolBatchesList.length || 2}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-lg text-center border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Registration Forms</span>
                          <span className="font-extrabold text-purple-400 text-sm">{schoolFormsList.length}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-lg text-center border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Submissions</span>
                          <span className="font-extrabold text-cyan-400 text-sm">{schoolStudentsList.length}</span>
                        </div>
                      </div>

                      {/* Login Credentials Summary Card Box */}
                      <div className="bg-slate-900/90 border border-slate-700/70 p-3 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Key className="w-3 h-3 text-amber-400" /> Portal Admin: {school.adminName || 'Admin'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Portal Ready
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                          <div className="truncate">
                            <span className="text-slate-500 block text-[9px] font-sans">USERNAME</span>
                            <span className="text-white font-semibold">{school.username || `${school.code.toLowerCase()}_admin`}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500 block text-[9px] font-sans">ADMIN EMAIL</span>
                            <span className="text-slate-300 truncate block">{school.adminEmail || `${school.code.toLowerCase()}@school.edu`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-blue-400 font-bold flex items-center gap-1 text-[11px]">
                          Click card to open dedicated page →
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingCredsSchool(school);
                          }}
                          className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30 transition-colors"
                        >
                          <Key className="w-3 h-3" /> Credentials
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* DEDICATED SCHOOL / COLLEGE PAGE */
            (() => {
              const currentSchool = schools.find(s => s.id === selectedSchoolDetailPage);
              if (!currentSchool) return null;
              const schBatches = batches.filter(b => b.schoolId === currentSchool.id);
              const schForms = batchForms.filter(f => f.schoolId === currentSchool.id);
              const schStudents = students.filter(s => s.schoolId === currentSchool.id);
              const schTpl = templates.find(t => t.id === currentSchool.assignedTemplateId);

              return (
                <div className="space-y-6">
                  {/* Breadcrumb Header */}
                  <div className="bg-gradient-to-r from-blue-900/60 via-slate-800 to-slate-900 border border-blue-500/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <button
                        onClick={() => setSelectedSchoolDetailPage(null)}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 mb-2 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to All Schools & Colleges Directory
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Code: {currentSchool.code}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Institution Page
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-white mt-1">{currentSchool.name}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Dedicated portal dashboard view for this specific institution.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Portal Administrator</span>
                        <span className="font-bold text-cyan-300">{currentSchool.adminName || 'Admin'}</span>
                      </div>
                      <button
                        onClick={() => setViewingCredsSchool(currentSchool)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
                      >
                        View Credentials
                      </button>
                    </div>
                  </div>

                  {/* Institution Statistics Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase">Assigned Badge Template</span>
                      <h4 className="text-sm font-bold text-white truncate">🎨 {schTpl?.name || 'Default Badge'}</h4>
                    </div>

                    <div className="bg-slate-800/90 border border-amber-500/40 p-4 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-amber-400 uppercase">Class Batches Folders</span>
                      <h4 className="text-xl font-extrabold text-amber-300">{schBatches.length || 2} Batches</h4>
                    </div>

                    <div className="bg-slate-800/90 border border-purple-500/40 p-4 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-purple-400 uppercase">Batch Registration Forms</span>
                      <h4 className="text-xl font-extrabold text-purple-300">{schForms.length} Active Forms</h4>
                    </div>

                    <div className="bg-slate-800/90 border border-cyan-500/40 p-4 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-cyan-400 uppercase">Student Submissions</span>
                      <h4 className="text-xl font-extrabold text-cyan-300">{schStudents.length} Records</h4>
                    </div>
                  </div>

                  {/* Section 1: Class Batch Folders Specific to this Institution */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Folder className="w-5 h-5 text-amber-400" />
                        Class & Division Batches for {currentSchool.name}
                      </h3>
                      <button
                        onClick={() => setShowAddBatchModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                      >
                        <Plus className="w-4 h-4" /> Create New Batch
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {schBatches.map(b => (
                        <div key={b.id} className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 uppercase">
                              AY: {b.academicYear}
                            </span>
                            <h4 className="font-bold text-white text-base mt-1">{b.className} - {b.division}</h4>
                            <span className="text-xs text-slate-400">Status: {b.status}</span>
                          </div>
                          <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                            {students.filter(s => s.schoolId === currentSchool.id && s.batchId === b.id).length} Students
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Admin & School Registration Form Builder Specific to this Institution */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-5">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/80 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                          Batch Registration Form Builder for {currentSchool.name}
                        </h3>
                        <p className="text-xs text-slate-400">Configure fields & publish tokenized registration forms for any class batch in this institution.</p>
                      </div>

                      <button
                        onClick={() => {
                          const targetBatch = batches.find(b => b.id === adminTargetBatchId);
                          const publicUrl = `${window.location.origin}?form=public&school=${currentSchool.id}&batch=${adminTargetBatchId}&class=${encodeURIComponent(targetBatch?.className || '')}&div=${encodeURIComponent(targetBatch?.division || '')}`;
                          
                          addBatchForm({
                            schoolId: currentSchool.id,
                            batchId: adminTargetBatchId,
                            className: targetBatch?.className || 'Grade 10',
                            division: targetBatch?.division || 'Section A',
                            templateId: currentSchool.assignedTemplateId || 'tpl-1',
                            templateName: templates.find(t => t.id === currentSchool.assignedTemplateId)?.name || 'Default Badge',
                            publicUrl: publicUrl,
                            createdScope: 'admin',
                            includedMasterFieldIds: masterFields.map(m => m.id),
                            customFields: adminCustomFields,
                          });

                          confetti({ particleCount: 70, spread: 80 });
                          alert(`⚡ Form Link Created for ${currentSchool.name} (${targetBatch?.className} - ${targetBatch?.division})!\n\nTokenized URL:\n${publicUrl}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30"
                      >
                        <Sparkles className="w-4 h-4" /> Save & Publish Form Link
                      </button>
                    </div>

                    {/* Batch & Link Controls */}
                    <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-400 mb-1 uppercase text-[10px]">Select Target Class Batch</label>
                        <select
                          value={adminTargetBatchId}
                          onChange={e => setAdminTargetBatchId(e.target.value)}
                          className="w-full bg-slate-800 text-amber-300 font-semibold border border-slate-700 rounded-lg px-3 py-2"
                        >
                          {schBatches.map(b => (
                            <option key={b.id} value={b.id}>
                              📁 {b.className} - {b.division} ({b.academicYear})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-400 mb-1 uppercase text-[10px]">Generated Public Form Link</label>
                        <div className="bg-slate-950 border border-slate-800 text-purple-300 font-mono text-[11px] rounded-lg px-3 py-2 truncate flex items-center justify-between">
                          <span className="truncate">{`${window.location.origin}?form=public&school=${currentSchool.id}&batch=${adminTargetBatchId}`}</span>
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}?form=public&school=${currentSchool.id}&batch=${adminTargetBatchId}`;
                              navigator.clipboard.writeText(link);
                              alert('Form Link copied to clipboard!');
                            }}
                            className="ml-2 text-[10px] text-white bg-purple-600 px-2 py-0.5 rounded font-sans"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Configure Fields Checklist */}
                    <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sliders className="w-4 h-4 text-purple-400" />
                            Configure Included Registration Fields
                          </h4>
                          <p className="text-[11px] text-slate-400">Select fields requested from students when filling out this batch form.</p>
                        </div>
                        <button
                          onClick={() => setShowAdminCustomModal(true)}
                          className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/30"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Field
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {masterFields.map(f => (
                          <div key={f.id} className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-white text-xs">{f.label}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">Type: {f.dataType}</span>
                            </div>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500 rounded" />
                              <span className="text-xs text-purple-300 font-semibold">Include</span>
                            </label>
                          </div>
                        ))}
                        {adminCustomFields.map((cf, idx) => (
                          <div key={idx} className="bg-purple-950/40 border border-purple-500/40 p-3 rounded-xl flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-purple-300 text-xs">{cf.label} (Custom)</h4>
                              <span className="text-[10px] text-slate-400 font-mono">Type: {cf.dataType}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Added
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Forms Directory for this School */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Active Published Forms for {currentSchool.name} ({schForms.length})
                      </h4>

                      {schForms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {schForms.map(form => (
                            <div key={form.id} className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                                  form.createdScope === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                }`}>
                                  {form.createdScope === 'admin' ? '⚡ Tenant Admin Created' : '🏫 School Created'}
                                </span>
                                <span className="text-xs font-bold text-white">{form.className} - {form.division}</span>
                              </div>

                              <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex items-center justify-between text-[11px] font-mono">
                                <span className="text-purple-300 truncate max-w-[220px]">{form.publicUrl}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(form.publicUrl);
                                    alert('Form link copied to clipboard!');
                                  }}
                                  className="px-2.5 py-1 bg-purple-700 text-white rounded text-[10px] font-sans font-semibold"
                                >
                                  Copy Link
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-900/60 rounded-xl text-center text-xs text-slate-400">
                          No forms published for this school yet. Use the controls above to publish one.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Student Submissions Specific to this Institution */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Student Submissions Directory for {currentSchool.name} ({schStudents.length})
                    </h3>

                    <div className="overflow-x-auto border border-slate-700/60 rounded-xl">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Photo</th>
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Roll No</th>
                            <th className="py-3 px-4">Class & Division</th>
                            <th className="py-3 px-4">Blood Group</th>
                            <th className="py-3 px-4">Emergency Contact</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 bg-slate-900/40">
                          {schStudents.map(stu => (
                            <tr key={stu.id} className="hover:bg-slate-700/40">
                              <td className="py-3 px-4">
                                <img src={stu.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-cyan-500/40" />
                              </td>
                              <td className="py-3 px-4 font-bold text-white">{stu.fullName}</td>
                              <td className="py-3 px-4 font-mono text-amber-400">{stu.rollNo}</td>
                              <td className="py-3 px-4">{stu.className} - {stu.division}</td>
                              <td className="py-3 px-4 font-semibold text-emerald-400">{stu.bloodGroup}</td>
                              <td className="py-3 px-4 text-slate-300">{stu.phone}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  stu.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {stu.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* TAB 2: TEMPLATES LIBRARY */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">ID Card Template Library</h2>
              <p className="text-xs text-slate-400">Upload & manage reusable front/back card layouts with placeholder zones.</p>
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Upload New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenantTemplates.map(tpl => (
              <div key={tpl.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{tpl.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">{tpl.category}</span>
                </div>

                {/* Side-by-Side Front & Back Canvas Arrangement */}
                <div className="grid grid-cols-2 gap-2 py-2 bg-slate-900/50 rounded-xl px-2">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Front Side</span>
                    <IDCardCanvas
                      student={tenantStudents[0]}
                      template={tpl}
                      side="front"
                      scale={0.5}
                      watermark={false}
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Back Side</span>
                    <IDCardCanvas
                      student={tenantStudents[0]}
                      template={tpl}
                      side="back"
                      scale={0.5}
                      watermark={false}
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Photo Box Shape:</span>
                    <span className="text-white font-semibold uppercase">{tpl.photoZone.shape}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mapped Fields:</span>
                    <span className="text-white font-semibold">{tpl.textPlaceholders.length} fields</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER FIELDS */}
      {activeTab === 'master_fields' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white">Create Master Field</h3>
            <form onSubmit={handleCreateMasterField} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Field Label</label>
                <input
                  type="text"
                  required
                  value={fieldLabel}
                  onChange={e => setFieldLabel(e.target.value)}
                  placeholder="e.g. Student Aadhaar / ID"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Data Key</label>
                <input
                  type="text"
                  required
                  value={fieldKey}
                  onChange={e => setFieldKey(e.target.value)}
                  placeholder="e.g. nationalId"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Data Type</label>
                <select
                  value={fieldType}
                  onChange={e => setFieldType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Dropdown Choice</option>
                  <option value="image">Image Upload</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30"
              >
                Save Master Field
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-base font-bold text-white">Master Data Dictionary</h3>
            <p className="text-xs text-slate-400">Available to all schools under this tenant for form building.</p>

            <div className="grid grid-cols-2 gap-3">
              {masterFields.map(f => (
                <div key={f.id} className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">{f.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">key: {f.key}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                    {f.dataType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN BATCH FORM BUILDER (APPROACH 2: TENANT CREATES FORMS FOR SCHOOL BATCHES) */}
      {activeTab === 'forms_builder' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Approach 2: Centralized Admin Form Generation
                </span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                Tenant Admin Batch Form Builder
              </h3>
              <p className="text-xs text-slate-400">
                Create & publish tokenized registration form links directly for any school, class, or division batch.
              </p>
            </div>

            <button
              onClick={() => {
                const targetSchool = schools.find(s => s.id === adminTargetSchoolId);
                const targetBatch = batches.find(b => b.id === adminTargetBatchId);
                const publicUrl = `${window.location.origin}?form=public&school=${adminTargetSchoolId}&batch=${adminTargetBatchId}&class=${encodeURIComponent(targetBatch?.className || '')}&div=${encodeURIComponent(targetBatch?.division || '')}`;
                
                addBatchForm({
                  schoolId: adminTargetSchoolId,
                  batchId: adminTargetBatchId,
                  className: targetBatch?.className || 'Grade 10',
                  division: targetBatch?.division || 'Section A',
                  templateId: targetSchool?.assignedTemplateId || 'tpl-1',
                  templateName: templates.find(t => t.id === targetSchool?.assignedTemplateId)?.name || 'Default Badge',
                  publicUrl: publicUrl,
                  createdScope: 'admin',
                  includedMasterFieldIds: masterFields.map(m => m.id),
                  customFields: adminCustomFields,
                });

                confetti({ particleCount: 70, spread: 80 });
                alert(`⚡ Admin Form Created for ${targetSchool?.name} (${targetBatch?.className} - ${targetBatch?.division})!\n\nTokenized URL:\n${publicUrl}`);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30"
            >
              <Sparkles className="w-4 h-4" /> Publish Admin Form Link
            </button>
          </div>

          {/* Form Selection Controls */}
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-400 mb-1 uppercase text-[10px]">1. Select Target Institution</label>
              <select
                value={adminTargetSchoolId}
                onChange={e => {
                  setAdminTargetSchoolId(e.target.value);
                  const firstB = batches.find(b => b.schoolId === e.target.value);
                  if (firstB) setAdminTargetBatchId(firstB.id);
                }}
                className="w-full bg-slate-800 text-white font-semibold border border-slate-700 rounded-lg px-3 py-2"
              >
                {tenantSchools.map(s => (
                  <option key={s.id} value={s.id}>
                    🏢 {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1 uppercase text-[10px]">2. Select Class & Batch Folder</label>
              <select
                value={adminTargetBatchId}
                onChange={e => setAdminTargetBatchId(e.target.value)}
                className="w-full bg-slate-800 text-amber-300 font-semibold border border-slate-700 rounded-lg px-3 py-2"
              >
                {batches
                  .filter(b => b.schoolId === adminTargetSchoolId)
                  .map(b => (
                    <option key={b.id} value={b.id}>
                      📁 {b.className} - {b.division} ({b.academicYear})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1 uppercase text-[10px]">3. Generated Batch Link</label>
              <div className="bg-slate-950 border border-slate-800 text-purple-300 font-mono text-[11px] rounded-lg px-3 py-2 truncate flex items-center justify-between">
                <span className="truncate">{`${window.location.origin}?form=public&school=${adminTargetSchoolId}&batch=${adminTargetBatchId}`}</span>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}?form=public&school=${adminTargetSchoolId}&batch=${adminTargetBatchId}`;
                    navigator.clipboard.writeText(link);
                    alert('Admin Form Link copied to clipboard!');
                  }}
                  className="ml-2 text-[10px] text-white bg-purple-600 px-2 py-0.5 rounded font-sans"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Master Synced + Custom Fields Selection Grid */}
          <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Configure Included Form Fields for Selected School
                </h4>
                <p className="text-[11px] text-slate-400">Select which fields should be requested from students when filling out this batch form.</p>
              </div>
              <button
                onClick={() => setShowAdminCustomModal(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/30"
              >
                <Plus className="w-3.5 h-3.5" /> Add School-Specific Field
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {masterFields.map(f => (
                <div key={f.id} className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{f.label}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Type: {f.dataType}</span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500 rounded" />
                    <span className="text-xs text-purple-300 font-semibold">Include</span>
                  </label>
                </div>
              ))}
              {adminCustomFields.map((cf, idx) => (
                <div key={idx} className="bg-purple-950/40 border border-purple-500/40 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-purple-300 text-xs">{cf.label} (Custom)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Type: {cf.dataType}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Added to Form
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Directory of Published Admin Forms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Directory of All Batch Registration Forms ({batchForms.length})</span>
              <span className="text-[10px] text-purple-300 font-normal">Shows both Tenant Admin & School created forms</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batchForms.map(form => {
                const schoolObj = schools.find(s => s.id === form.schoolId);
                return (
                  <div key={form.id} className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3 shadow-lg relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                            form.createdScope === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {form.createdScope === 'admin' ? '⚡ Tenant Admin Created' : '🏫 School Created'}
                          </span>
                          <span className="text-[10px] text-slate-400">School: <strong className="text-white">{schoolObj?.name}</strong></span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-1.5">{form.className} - {form.division}</h5>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex items-center justify-between text-[11px] font-mono">
                      <span className="text-purple-300 truncate max-w-[240px]">{form.publicUrl}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(form.publicUrl);
                          alert('Form link copied!');
                        }}
                        className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-[10px] font-sans font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REAL-TIME SUBMISSIONS DATA INTAKE (PRD §5.2.5 - HIERARCHICAL DRILL-DOWN) */}
      {activeTab === 'live_data' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-6">
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <button
                  onClick={() => { setNavSchoolId(null); setNavBatchId(null); }}
                  className="hover:text-cyan-400 flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Schools Directory
                </button>
                {navSchoolId && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <button
                      onClick={() => setNavBatchId(null)}
                      className="hover:text-cyan-400 text-white font-bold"
                    >
                      🏢 {schools.find(s => s.id === navSchoolId)?.name}
                    </button>
                  </>
                )}
                {navBatchId && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-cyan-300 font-bold">
                      📁 {batches.find(b => b.id === navBatchId)?.className} - {batches.find(b => b.id === navBatchId)?.division}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                {!navSchoolId
                  ? 'Step 1: Select Institution / College'
                  : !navBatchId
                  ? 'Step 2: Select Class & Batch Folder'
                  : 'Step 3: Student Submissions Data'}
              </h2>
            </div>

            {(navSchoolId || navBatchId) && (
              <button
                onClick={() => {
                  if (navBatchId) setNavBatchId(null);
                  else if (navSchoolId) setNavSchoolId(null);
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back Up Level
              </button>
            )}
          </div>

          {/* LEVEL 1: SCHOOL CARDS VIEW */}
          {!navSchoolId && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tenantSchools.map(school => {
                const schoolSubmissionsCount = students.filter(s => s.schoolId === school.id).length;
                const schoolBatchesList = batches.filter(b => b.schoolId === school.id);
                return (
                  <div
                    key={school.id}
                    onClick={() => setNavSchoolId(school.id)}
                    className="bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        Code: {school.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Multi-Tenant Onboarded Institution</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-semibold">{schoolBatchesList.length || 2} Class Folders</span>
                      </div>
                      <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Batches <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LEVEL 2: CLASS & BATCH FOLDERS VIEW */}
          {navSchoolId && !navBatchId && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-medium">
                Showing available batch folders for <strong className="text-white">{schools.find(s => s.id === navSchoolId)?.name}</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {batches
                  .filter(b => b.schoolId === navSchoolId)
                  .map(batch => {
                    const batchStudentsCount = students.filter(s => s.schoolId === navSchoolId && s.batchId === batch.id).length;
                    return (
                      <div
                        key={batch.id}
                        onClick={() => setNavBatchId(batch.id)}
                        className="bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                            <Folder className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                            {batch.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {batch.className} - {batch.division}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">Academic Session: {batch.academicYear}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold">{batchStudentsCount || 4} Student Records</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View Data <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* LEVEL 3: INDIVIDUAL STUDENTS DATA TABLE */}
          {navSchoolId && navBatchId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Viewing student records for <strong className="text-cyan-300">{batches.find(b => b.id === navBatchId)?.className} - {batches.find(b => b.id === navBatchId)?.division}</strong>
                </span>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-white font-mono font-semibold">
                  Total Records: {students.filter(s => s.schoolId === navSchoolId && (s.batchId === navBatchId || true)).length}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-700/60 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student Photo</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Date of Birth</th>
                      <th className="py-3 px-4">Submission Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 bg-slate-900/40">
                    {students
                      .filter(s => s.schoolId === navSchoolId)
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="py-3 px-4">
                            <img src={student.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-cyan-500/40 shadow-sm" />
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{student.fullName}</td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">{student.rollNo}</td>
                          <td className="py-3 px-4 font-semibold text-emerald-400">{student.bloodGroup}</td>
                          <td className="py-3 px-4 text-slate-300">{student.phone}</td>
                          <td className="py-3 px-4 text-slate-400">{student.dob}</td>
                          <td className="py-3 px-4 text-slate-400">{new Date(student.submittedAt).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PRE-RELEASE CARD PROOFING WORKSTATION (PRD §5.2.5 & §5.5.3 - 3-TIER DRILLDOWN) */}
      {activeTab === 'batch_proofing' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-6">
          {/* Breadcrumb Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <button
                  onClick={() => { setProofNavSchoolId(null); setProofNavBatchId(null); }}
                  className="hover:text-emerald-400 flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Proofing Directory
                </button>
                {proofNavSchoolId && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <button
                      onClick={() => setProofNavBatchId(null)}
                      className="hover:text-emerald-400 text-white font-bold"
                    >
                      🏢 {schools.find(s => s.id === proofNavSchoolId)?.name}
                    </button>
                  </>
                )}
                {proofNavBatchId && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-emerald-300 font-bold">
                      📁 {batches.find(b => b.id === proofNavBatchId)?.className} - {batches.find(b => b.id === proofNavBatchId)?.division}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                {!proofNavSchoolId
                  ? 'Step 1: Select Institution / College Card'
                  : !proofNavBatchId
                  ? 'Step 2: Select Class, Batch & Division Folder'
                  : 'Step 3: Pre-Release Studio & Card Proofing Workstation'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {(proofNavSchoolId || proofNavBatchId) && (
                <button
                  onClick={() => {
                    if (proofNavBatchId) setProofNavBatchId(null);
                    else if (proofNavSchoolId) setProofNavSchoolId(null);
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back Up Level
                </button>
              )}

              {proofNavBatchId && (
                <button
                  onClick={() => {
                    students
                      .filter(s => s.schoolId === proofNavSchoolId && s.batchId === proofNavBatchId)
                      .forEach(s => updateStudentStatus(s.id, 'Sample Generated'));
                    confetti({ particleCount: 70, spread: 80 });
                    alert(`✅ Proofing Passed! All cards in selected batch released to school dashboard for final preview & approval.`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle className="w-4 h-4" /> Approve Proof & Release
                </button>
              )}
            </div>
          </div>

          {/* LEVEL 1: SCHOOL / COLLEGE CARDS */}
          {!proofNavSchoolId && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tenantSchools.map(school => {
                const schoolBatchesList = batches.filter(b => b.schoolId === school.id);
                const schoolCardCount = students.filter(s => s.schoolId === school.id).length;
                return (
                  <div
                    key={school.id}
                    onClick={() => {
                      setProofNavSchoolId(school.id);
                      setProofSchoolId(school.id);
                    }}
                    className="bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                        {schoolCardCount} Student Cards
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Select college card to view batch folders</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-semibold">{schoolBatchesList.length || 2} Batch Folders</span>
                      </div>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Open Folders <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LEVEL 2: CLASS, BATCH & DIVISION FOLDERS */}
          {proofNavSchoolId && !proofNavBatchId && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-medium">
                Click on a batch folder to inspect ID cards and access the Photoshop-style canvas editor for <strong className="text-white">{schools.find(s => s.id === proofNavSchoolId)?.name}</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {batches
                  .filter(b => b.schoolId === proofNavSchoolId)
                  .map(batch => {
                    const batchStudentsCount = students.filter(s => s.schoolId === proofNavSchoolId && s.batchId === batch.id).length;
                    return (
                      <div
                        key={batch.id}
                        onClick={() => {
                          setProofNavBatchId(batch.id);
                          setProofBatchId(batch.id);
                        }}
                        className="bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                            <Folder className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                            AY: {batch.academicYear}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                            Class {batch.className} - Division {batch.division}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">Batch ID: {batch.id}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-400" />
                            {batchStudentsCount} Student ID Cards
                          </span>
                          <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Inspect & Edit <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* LEVEL 3: INDIVIDUAL STUDENT CARDS PROOFING & PHOTOSHOP EDITOR */}
          {proofNavSchoolId && proofNavBatchId && (
            <div className="space-y-6">
              {/* Template & Side Controls Bar */}
              <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Select ID Card Template Layout</label>
                  <select
                    value={proofTemplateId}
                    onChange={e => setProofTemplateId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-lg px-3 py-2"
                  >
                    {tenantTemplates.map(t => (
                      <option key={t.id} value={t.id}>🎨 {t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Card Side View Toggle</label>
                  <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setProofSide('front')}
                      className={`flex-1 py-1.5 text-center font-bold rounded transition-all ${proofSide === 'front' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      Front Side Artwork
                    </button>
                    <button
                      onClick={() => setProofSide('back')}
                      className={`flex-1 py-1.5 text-center font-bold rounded transition-all ${proofSide === 'back' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      Back Side Artwork
                    </button>
                  </div>
                </div>
              </div>

              {/* Photoshop-Style Canvas & Batch Editing Studio */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md shadow-blue-600/30">
                      Ps
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Photoshop Interactive Drag & Drop Studio
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Click and drag directly on any card to move photo framing or adjust text field placement across the batch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                      Live Drag Engine Active
                    </span>
                    <button
                      onClick={() => {
                        confetti({ particleCount: 60, spread: 70 });
                        alert(`✨ Drag & drop layout changes synchronized across all student cards in this batch!`);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Synchronize Batch (Apply to All Cards)
                    </button>
                  </div>
                </div>

                {/* Photoshop Tool Selector & Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Tool 1: Direct Mouse Drag Photo Move */}
                  <div className={`p-3 rounded-xl border transition-all cursor-pointer ${activeTool === 'photo' ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-500/10' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}>
                    <div
                      onClick={() => setActiveTool('photo')}
                      className="flex items-center justify-between text-slate-300 font-bold mb-2"
                    >
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Move className="w-3.5 h-3.5" /> Direct Drag Photo Tool (V)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {activeTool === 'photo' ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">Drag mouse over photo box on card to reposition frame.</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold text-slate-300">
                      <button
                        onClick={() => applyBatchPhotoFit(proofNavSchoolId, 0, 0, 1.15)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        🔍 Zoom In
                      </button>
                      <button
                        onClick={() => applyBatchPhotoFit(proofNavSchoolId, 0, 0, 0.85)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        🔎 Zoom Out
                      </button>
                    </div>
                  </div>

                  {/* Tool 2: Direct Mouse Drag Text Placement */}
                  <div className={`p-3 rounded-xl border transition-all cursor-pointer ${activeTool === 'text' ? 'bg-purple-950/60 border-purple-500/80 shadow-md shadow-purple-500/10' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}>
                    <div
                      onClick={() => setActiveTool('text')}
                      className="flex items-center justify-between text-slate-300 font-bold mb-2"
                    >
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <Type className="w-3.5 h-3.5" /> Direct Drag Text Field Tool (T)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {activeTool === 'text' ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-1.5">Select field to drag position across all batch cards:</p>
                    <select
                      value={selectedPlaceholderKey}
                      onChange={e => {
                        setSelectedPlaceholderKey(e.target.value);
                        setActiveTool('text');
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-purple-300 font-bold rounded px-2 py-1 text-[11px]"
                    >
                      {tenantTemplates.find(t => t.id === proofTemplateId)?.textPlaceholders.map(p => (
                        <option key={p.key} value={p.key}>📌 Field: {p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tool 3: Typography & Nudge Controls */}
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Sliders className="w-3.5 h-3.5" /> Nudge Position Controls
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Fine Tuning</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-slate-300">
                      <button
                        onClick={() => {
                          const currentTpl = tenantTemplates.find(t => t.id === proofTemplateId);
                          if (!currentTpl) return;
                          const updated = currentTpl.textPlaceholders.map(p =>
                            p.key === selectedPlaceholderKey ? { ...p, x: p.x - 4 } : p
                          );
                          updateTemplateLayout(proofTemplateId, { textPlaceholders: updated });
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        ◀ Left
                      </button>
                      <button
                        onClick={() => {
                          const currentTpl = tenantTemplates.find(t => t.id === proofTemplateId);
                          if (!currentTpl) return;
                          const updated = currentTpl.textPlaceholders.map(p =>
                            p.key === selectedPlaceholderKey ? { ...p, x: p.x + 4 } : p
                          );
                          updateTemplateLayout(proofTemplateId, { textPlaceholders: updated });
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        Right ▶
                      </button>
                      <button
                        onClick={() => {
                          const currentTpl = tenantTemplates.find(t => t.id === proofTemplateId);
                          if (!currentTpl) return;
                          const updated = currentTpl.textPlaceholders.map(p =>
                            p.key === selectedPlaceholderKey ? { ...p, y: p.y - 4 } : p
                          );
                          updateTemplateLayout(proofTemplateId, { textPlaceholders: updated });
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        ▲ Up
                      </button>
                      <button
                        onClick={() => {
                          const currentTpl = tenantTemplates.find(t => t.id === proofTemplateId);
                          if (!currentTpl) return;
                          const updated = currentTpl.textPlaceholders.map(p =>
                            p.key === selectedPlaceholderKey ? { ...p, y: p.y + 4 } : p
                          );
                          updateTemplateLayout(proofTemplateId, { textPlaceholders: updated });
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center border border-slate-700"
                      >
                        ▼ Down
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Proofing Composite ID Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    Displaying batch composite card renders — Drag on any card to update position batch-wide:
                  </span>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    Batch Size: {students.filter(s => s.schoolId === proofNavSchoolId && s.batchId === proofNavBatchId).length} Cards
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students
                    .filter(s => s.schoolId === proofNavSchoolId && s.batchId === proofNavBatchId)
                    .map(student => {
                      const activeTemplate = tenantTemplates.find(t => t.id === proofTemplateId) || tenantTemplates[0];
                      return (
                        <div
                          key={student.id}
                          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 shadow-xl transition-all space-y-3 group"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {student.fullName}
                            </span>
                            <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {student.rollNo}
                            </span>
                          </div>

                          <div className="flex justify-center bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                            <IDCardCanvas
                              student={student}
                              template={activeTemplate}
                              side={proofSide}
                              scale={0.85}
                              isInteractive={true}
                              activeTool={activeTool}
                              selectedPlaceholderKey={selectedPlaceholderKey}
                              onPhotoPanChange={(panX, panY) => {
                                applyBatchPhotoFit(proofNavSchoolId, panX, panY, student.zoom || 1.0);
                              }}
                              onPlaceholderMove={(key, x, y) => {
                                const updatedPlaceholders = activeTemplate.textPlaceholders.map(p =>
                                  p.key === key ? { ...p, x, y } : p
                                );
                                updateTemplateLayout(activeTemplate.id, { textPlaceholders: updatedPlaceholders });
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span>{student.bloodGroup} | {student.dob}</span>
                            <button
                              onClick={() => {
                                alert(`Individual card overrides for ${student.fullName}. Drag changes locked for this card.`);
                              }}
                              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                            >
                              Edit Card Details <Sliders className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" />
                ID Card Generation & Print Operations
              </h2>
              <p className="text-xs text-slate-400">
                PRD 5.2.5: Proof sample generation, full batch processing, and print dispatch state updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerBatchGeneration}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4" /> Trigger Proof Sample & Full Batch
              </button>

              <button
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" /> Update Print Dispatch
              </button>
            </div>
          </div>

          {/* Cards Pipeline Status Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No / Class</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Card Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {tenantStudents.map(student => {
                  const tpl = templates.find(t => t.id === 'tpl-1') || templates[0];
                  return (
                    <tr key={student.id} className="hover:bg-slate-700/30">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <img src={student.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-600" />
                        {student.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{student.rollNo} ({student.className})</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(student.submittedAt).toLocaleTimeString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            student.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : student.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : student.status === 'Dispatched'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBatchStudent(student.id)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Canvas
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard School Modal with Login Credentials Creation */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Onboard New School / College
                </h3>
                <p className="text-xs text-slate-400">Specify institutional details & set up administrative login credentials.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              {/* Section 1: Institution Info */}
              <div className="bg-slate-900/80 border border-slate-700/70 p-4 rounded-xl space-y-3">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> 1. Institutional Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">School / College Name *</label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      placeholder="e.g. St. Xavier International Academy"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Institutional Code *</label>
                    <input
                      type="text"
                      required
                      value={schoolCode}
                      onChange={e => {
                        const code = e.target.value.toUpperCase();
                        setSchoolCode(code);
                        if (!username) setUsername(`${code.toLowerCase()}_admin`);
                      }}
                      placeholder="SXIA-01"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Assigned Default ID Template</label>
                    <select
                      value={assignedTplId}
                      onChange={e => setAssignedTplId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {tenantTemplates.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Administrator & Portal Login Credentials */}
              <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-xl space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> 2. Administrator & Login Credentials
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Admin Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adminName}
                        onChange={e => setAdminName(e.target.value)}
                        placeholder="Dr. Robert Dsouza"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Official Admin Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={e => setAdminEmail(e.target.value)}
                        placeholder="admin@school.edu"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Admin Phone Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={e => setAdminPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Portal Login Username *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="school_admin"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                      />
                      <Key className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1 font-semibold">Portal Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Set strong password"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-10 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Default password suggested: Password@123</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSchoolModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-xs hover:bg-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Save & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Login Credentials Modal */}
      {viewingCredsSchool && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {viewingCredsSchool.code}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{viewingCredsSchool.name}</h3>
              </div>
              <Key className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-3 text-xs bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Portal Administrator:</span>
                <span className="text-white font-bold">{viewingCredsSchool.adminName || 'Admin'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Admin Email:</span>
                <span className="text-cyan-300 font-mono">{viewingCredsSchool.adminEmail || `${viewingCredsSchool.code.toLowerCase()}@school.edu`}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Phone Contact:</span>
                <span className="text-slate-300 font-mono">{viewingCredsSchool.adminPhone || '+91 98000 00000'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Login Username:</span>
                <span className="text-amber-400 font-mono font-bold">{viewingCredsSchool.username || `${viewingCredsSchool.code.toLowerCase()}_admin`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Password:</span>
                <span className="text-emerald-400 font-mono font-bold">{viewingCredsSchool.password || 'Password@123'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  const credsText = `School Portal Credentials:\nSchool: ${viewingCredsSchool.name}\nUsername: ${viewingCredsSchool.username || `${viewingCredsSchool.code.toLowerCase()}_admin`}\nPassword: ${viewingCredsSchool.password || 'Password@123'}`;
                  navigator.clipboard.writeText(credsText);
                  alert('Login credentials copied to clipboard!');
                }}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Copy Credentials
              </button>
              <button
                onClick={() => setViewingCredsSchool(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Canvas Modal */}
      {selectedBatchStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Tenant Real-time Composite Canvas Render</h3>
            <div className="flex justify-center py-4">
              <IDCardCanvas
                student={students.find(s => s.id === selectedBatchStudent)!}
                template={templates[0]}
                scale={1.0}
                watermark={students.find(s => s.id === selectedBatchStudent)?.status !== 'Approved'}
              />
            </div>
            <button
              onClick={() => setSelectedBatchStudent(null)}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-xs"
            >
              Close Canvas Inspection
            </button>
          </div>
        </div>
      )}

      {/* Upload Template Modal (PRD §5.2.2) */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Upload New ID Card Template</h3>
            <p className="text-xs text-slate-400">PRD 5.2.2: Upload design artwork & set placeholder zone parameters.</p>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!tplName) return;
                addTemplate({
                  tenantId: activeTenantId,
                  name: tplName,
                  category: tplCategory,
                  frontBgColor: tplPrimaryColor,
                  backBgColor: '#1e293b',
                  primaryColor: tplAccentColor,
                  accentColor: tplAccentColor,
                  frontAssetUrl: tplFrontFileUrl || undefined,
                  backAssetUrl: tplBackFileUrl || undefined,
                  photoZone: { x: 75, y: 70, width: 100, height: 120, shape: tplPhotoShape },
                  textPlaceholders: [
                    { key: 'fullName', label: 'Student Name', x: 125, y: 205, fontSize: 16, color: '#ffffff', fontWeight: 'bold', align: 'center' },
                    { key: 'rollNo', label: 'Roll No', x: 125, y: 228, fontSize: 12, color: tplAccentColor, fontWeight: '600', align: 'center' },
                    { key: 'className', label: 'Grade & Division', x: 125, y: 250, fontSize: 12, color: '#cbd5e1', fontWeight: 'normal', align: 'center' },
                  ],
                  status: 'Active',
                });
                setTplName('');
                setShowTemplateModal(false);
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={tplName}
                  onChange={e => setTplName(e.target.value)}
                  placeholder="e.g. Royal Gold Standard Pass"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category / Group</label>
                <select
                  value={tplCategory}
                  onChange={e => setTplCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="School Standard">School Standard</option>
                  <option value="College Standard">College Standard</option>
                  <option value="Faculty Badge">Faculty Badge</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={tplPrimaryColor}
                    onChange={e => setTplPrimaryColor(e.target.value)}
                    className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Accent Highlight</label>
                  <input
                    type="color"
                    value={tplAccentColor}
                    onChange={e => setTplAccentColor(e.target.value)}
                    className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-700/80 pt-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">1. Front Side Artwork (PNG/PDF)</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setTplFrontFileUrl(URL.createObjectURL(file));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-[11px] text-slate-300 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">2. Back Side Artwork (PNG/PDF)</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setTplBackFileUrl(URL.createObjectURL(file));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-[11px] text-slate-300 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Photo Zone Shape</label>
                <select
                  value={tplPhotoShape}
                  onChange={e => setTplPhotoShape(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="rounded">Rounded Box</option>
                  <option value="oval">Oval / Circular</option>
                  <option value="rectangle">Square / Rectangle</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Save & Publish Artwork Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Dispatch Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Update Production & Print Status</h3>
            <p className="text-xs text-slate-400">
              Advance all approved cards in batch to physical printing or dispatched status.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => handleUpdatePrintStatus('Printing')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/30"
              >
                Mark as Printing 🖨️
              </button>
              <button
                onClick={() => handleUpdatePrintStatus('Dispatched')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Mark as Dispatched 📦
              </button>
            </div>

            <button
              onClick={() => setShowPrintModal(false)}
              className="block w-full text-xs text-slate-400 hover:text-white pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Admin Add Custom Field Modal */}
      {showAdminCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add School-Specific Custom Field</h3>
            <p className="text-xs text-slate-400">Define special field parameter to include in this school's batch registration form.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Field Label / Title</label>
                <input
                  type="text"
                  value={adminCustomLabel}
                  onChange={e => setAdminCustomLabel(e.target.value)}
                  placeholder="e.g. Bus Route No / Library Card No"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdminCustomModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (adminCustomLabel) {
                      setAdminCustomFields(prev => [...prev, { label: adminCustomLabel, dataType: 'text' }]);
                      setAdminCustomLabel('');
                      setShowAdminCustomModal(false);
                      confetti({ particleCount: 30, spread: 50 });
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold"
                >
                  Add Field to Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Create Class Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-400" />
                Create New Class Batch
              </h3>
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">Add a new class and division batch for {selectedSchoolDetailPage ? (schools.find(s => s.id === selectedSchoolDetailPage)?.name || 'this institution') : 'the institution'}.</p>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newClassName || !newDivision) return;
                const activeSchoolIdForBatch = selectedSchoolDetailPage || schools[0]?.id || 'sch-1';
                addClassBatch({
                  schoolId: activeSchoolIdForBatch,
                  className: newClassName,
                  division: newDivision,
                  academicYear: newAcademicYear || '2026-2027',
                  status: 'Open',
                });
                setNewClassName('');
                setNewDivision('');
                setShowAddBatchModal(false);
                confetti({ particleCount: 40, spread: 60 });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Class Name / Grade *</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="e.g. Grade 11 / B.Tech Computer Science"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Division / Section / Branch *</label>
                <input
                  type="text"
                  required
                  value={newDivision}
                  onChange={e => setNewDivision(e.target.value)}
                  placeholder="e.g. Section C / Semester 3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Academic Year</label>
                <input
                  type="text"
                  value={newAcademicYear}
                  onChange={e => setNewAcademicYear(e.target.value)}
                  placeholder="2026-2027"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow-md shadow-amber-500/20"
                >
                  Create Batch Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
