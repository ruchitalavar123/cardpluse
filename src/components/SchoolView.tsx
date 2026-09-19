'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IDCardCanvas } from './IDCardCanvas';
import {
  GraduationCap,
  Layers,
  FileSpreadsheet,
  CheckSquare,
  Sparkles,
  Link,
  QrCode,
  Lock,
  CheckCircle,
  XCircle,
  Edit2,
  Maximize2,
  RefreshCw,
  Printer,
  Sliders,
  FileText,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SchoolView: React.FC = () => {
  const {
    activeSchoolId,
    schools,
    batches,
    students,
    templates,
    masterFields,
    updateStudentStatus,
    updateStudentPhotoFit,
    updateStudentData,
    bulkApproveStudents,
    addTemplateRequest,
    templateRequests,
    finalizeBatch,
    batchForms,
    addBatchForm,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'submissions' | 'approval' | 'a4_sheet' | 'form_builder'>('submissions');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingStudentId, setRejectingStudentId] = useState<string | null>(null);

  const activeSchool = schools.find(s => s.id === activeSchoolId) || schools[0];
  const schoolBatches = batches.filter(b => b.schoolId === activeSchoolId);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(schoolBatches[0]?.id || 'batch-1');

  const selectedBatch = schoolBatches.find(b => b.id === selectedBatchId) || schoolBatches[0];
  const schoolStudents = students.filter(s => s.schoolId === activeSchoolId);
  const activeTemplate = templates.find(t => t.id === activeSchool.assignedTemplateId) || templates[0];
  
  const publicFormUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?form=public&school=${activeSchool.id}&batch=${selectedBatchId}&class=${encodeURIComponent(selectedBatch?.className || '')}&div=${encodeURIComponent(selectedBatch?.division || '')}`
    : '#';

  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [reqOrientation, setReqOrientation] = useState<'Vertical' | 'Horizontal'>('Vertical');
  const [reqNotes, setReqNotes] = useState('');

  // Modals for creating new Class Batch & Custom Fields
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newDivision, setNewDivision] = useState('');

  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [customFields, setCustomFields] = useState<Array<{ label: string; dataType: string }>>([
    { label: 'Bus Route / Stop No', dataType: 'text' }
  ]);
  const [customLabel, setCustomLabel] = useState('');
  const [customType, setCustomType] = useState('text');

  const selectedStudent = schoolStudents.find(s => s.id === selectedStudentId) || schoolStudents[0];

  const handleSingleApprove = (studentId: string) => {
    updateStudentStatus(studentId, 'Approved');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleOpenReject = (studentId: string) => {
    setRejectingStudentId(studentId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (rejectingStudentId) {
      updateStudentStatus(rejectingStudentId, 'Rejected', rejectionComment || 'Photo blury / data mismatched.');
    }
    setShowRejectModal(false);
    setRejectionComment('');
  };

  const handleBulkApprove = () => {
    bulkApproveStudents('batch-1');
    confetti({ particleCount: 100, spread: 90 });
    alert('All cards in current batch have been bulk-approved!');
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudentData(editingStudent.id, {
      fullName: editingStudent.fullName,
      rollNo: editingStudent.rollNo,
      bloodGroup: editingStudent.bloodGroup,
      phone: editingStudent.phone,
      status: 'Under Review', // Auto triggers re-review PRD 5.3.5
    });
    setEditingStudent(null);
    confetti({ particleCount: 40, spread: 60 });
    alert('Self-service correction applied! Card automatically resubmitted for generation.');
  };

  const handleSubmitDesignReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqNotes) return;
    addTemplateRequest({
      schoolId: activeSchool.id,
      schoolName: activeSchool.name,
      orientation: reqOrientation,
      brandingColor: '#0284c7',
      notes: reqNotes,
    });
    setReqNotes('');
    alert('Template Design Request submitted to Tenant!');
  };

  return (
    <div className="space-y-6">
      {/* School Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">School Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{activeSchool.name}</h2>
          <p className="text-xs text-slate-400">Batch Management, Data Collection & ID Verification Console</p>
        </div>

        {/* Share Public Form Link Box with Batch Selector */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tokenized Form Link per Batch</span>
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="bg-slate-800 text-emerald-300 text-xs font-bold border border-slate-700 rounded px-2 py-0.5 focus:outline-none"
              >
                {schoolBatches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.className} - {b.division} ({b.academicYear})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-mono font-bold truncate max-w-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {publicFormUrl}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicFormUrl);
                alert(`Batch Form Link copied to clipboard!\n${publicFormUrl}`);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/30 whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 pb-3">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'submissions'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Real-time Submissions ({schoolStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('approval')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all relative ${
            activeTab === 'approval'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Card Verification & Approval
          {schoolStudents.filter(s => s.status === 'Sample Generated' || s.status === 'Under Review').length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-cyan-500 text-slate-950 animate-pulse">
              {schoolStudents.filter(s => s.status === 'Sample Generated' || s.status === 'Under Review').length} Ready
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('a4_sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'a4_sheet'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" /> Print-Ready A4 Sheet Layout
        </button>

        <button
          onClick={() => setActiveTab('form_builder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'form_builder'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" /> Form Builder (Master Synced)
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS MANAGEMENT */}
      {activeTab === 'submissions' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Student Submissions Directory</h3>
              <p className="text-xs text-slate-400">
                PRD 5.3.4: Real-time submission visibility. School can finalize/lock batch whenever ready.
              </p>
            </div>

            <button
              onClick={() => {
                finalizeBatch('batch-1');
                alert('Batch Grade 10 Section A Finalized and locked for proof sample generation!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
            >
              <Lock className="w-4 h-4" /> Finalize & Lock Batch (Grade 10)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Class & Division</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Self-Service Correction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {schoolStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <img src={student.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-600" />
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{student.fullName}</td>
                    <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                    <td className="py-3 px-4">{student.className} - {student.division}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">{student.bloodGroup}</td>
                    <td className="py-3 px-4 text-slate-400">{student.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : student.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingStudent({ ...student })}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Direct Fix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION & APPROVAL WORKFLOW */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                Proofing & Approval Workstation
              </h3>
              <p className="text-xs text-slate-400">
                PRD 5.3.5: Watermarked live canvas preview with pan/zoom fallback and instant bulk/individual approval.
              </p>
            </div>

            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle className="w-4 h-4" /> Bulk Approve Batch (4 Cards)
            </button>
          </div>

          {/* Interactive Card Canvas & Positioning Workstation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student selector list */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
              <h4 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Select Student Card</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {schoolStudents.map(stu => (
                  <button
                    key={stu.id}
                    onClick={() => setSelectedStudentId(stu.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedStudent?.id === stu.id
                        ? 'bg-emerald-900/30 border-emerald-500 text-white'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{stu.fullName}</div>
                      <div className="text-[10px] text-slate-400">{stu.rollNo}</div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        stu.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : stu.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {stu.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Preview Center */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {selectedStudent?.status === 'Approved' ? '✅ Approved Clean Render' : '⚠️ Watermarked Preview'}
              </span>

              <IDCardCanvas
                student={selectedStudent}
                template={activeTemplate}
                scale={1.1}
                watermark={selectedStudent?.status !== 'Approved'}
              />

              {/* Photo Positioning Controls Fallback */}
              <div className="w-full max-w-xs bg-slate-900/80 border border-slate-700 p-3 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Photo Auto-Fit Pan & Zoom Fallback</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                  <button
                    onClick={() => updateStudentPhotoFit(selectedStudent.id, (selectedStudent.panX || 0) - 5, selectedStudent.panY || 0, selectedStudent.zoom || 1.0)}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-center"
                  >
                    ⬅️ Pan Left
                  </button>
                  <button
                    onClick={() => updateStudentPhotoFit(selectedStudent.id, (selectedStudent.panX || 0) + 5, selectedStudent.panY || 0, selectedStudent.zoom || 1.0)}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-center"
                  >
                    Pan Right ➡️
                  </button>
                  <button
                    onClick={() => updateStudentPhotoFit(selectedStudent.id, selectedStudent.panX || 0, selectedStudent.panY || 0, (selectedStudent.zoom || 1.0) + 0.1)}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-center"
                  >
                    🔍 Zoom In
                  </button>
                  <button
                    onClick={() => updateStudentPhotoFit(selectedStudent.id, selectedStudent.panX || 0, selectedStudent.panY || 0, Math.max(0.5, (selectedStudent.zoom || 1.0) - 0.1))}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-center"
                  >
                    Zoom Out 🔎
                  </button>
                </div>
              </div>
            </div>

            {/* Approval Decision Panel */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Individual Verification</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Student:</span>
                  <span className="text-white font-bold">{selectedStudent.fullName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Roll Number:</span>
                  <span className="text-white font-mono">{selectedStudent.rollNo}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Blood Group:</span>
                  <span className="text-emerald-400 font-bold">{selectedStudent.bloodGroup}</span>
                </div>
                {selectedStudent.rejectionReason && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-[11px]">
                    <strong>Rejection Comment:</strong> {selectedStudent.rejectionReason}
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => handleSingleApprove(selectedStudent.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve This Card
                </button>

                <button
                  onClick={() => handleOpenReject(selectedStudent.id)}
                  className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Flag / Reject with Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINT READY A4 SHEET */}
      {activeTab === 'a4_sheet' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                Print-Ready A4 Duplex Sheet Preview
              </h3>
              <p className="text-xs text-slate-400">
                PRD 5.5.4: Auto-arranged grid of ID cards on A4 layout with cut/crop marks.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              Print / Save PDF 📄
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-300 min-h-[600px] text-slate-900">
            <div className="border-b-2 border-slate-200 pb-4 mb-6 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-slate-900">{activeSchool.name}</h4>
                <p className="text-xs text-slate-500">BATCH: Grade 10 - Section A | SHEET 01 (FRONT SIDE)</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded border border-slate-300">
                CROP MARKS: ENABLED
              </span>
            </div>

            {/* Grid of cards on A4 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {schoolStudents.map(student => (
                <div key={student.id} className="relative p-2 border border-dashed border-slate-400 rounded-xl bg-slate-50">
                  {/* Crop mark corners */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-black" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-black" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-black" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-black" />

                  <IDCardCanvas
                    student={student}
                    template={activeTemplate}
                    scale={0.7}
                    watermark={student.status !== 'Approved'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FORM BUILDER */}
      {activeTab === 'form_builder' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Dynamic Form Builder & Link Generator
              </h3>
              <p className="text-xs text-slate-400">
                PRD 5.3.2 & 5.3.3: Manually define target Class/Batch, select or create fields, and publish a tokenized link.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs rounded-xl border border-slate-600"
              >
                <Plus className="w-4 h-4" /> Create New Class Batch
              </button>

              <button
                onClick={() => {
                  confetti({ particleCount: 60, spread: 70 });
                  alert(`✨ Form Published for ${selectedBatch.className} - ${selectedBatch.division}!\n\nTokenized Public Link Generated:\n${publicFormUrl}`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
              >
                <Sparkles className="w-4 h-4" /> Save Form & Generate Link
              </button>
            </div>
          </div>

          {/* Created Batch Forms Directory List */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Active Class & Batch Registration Forms ({batchForms.filter(f => f.schoolId === activeSchool.id).length})
                </h4>
                <p className="text-[11px] text-slate-400">Published public form links generated for students/parents batch-wise.</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                Approach 1: School Form Builder Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batchForms
                .filter(f => f.schoolId === activeSchool.id)
                .map(form => (
                  <div key={form.id} className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl space-y-3 shadow-md relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          form.createdScope === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {form.createdScope === 'admin' ? '⚡ Tenant Admin Created' : '🏫 School Created'}
                        </span>
                        <h5 className="font-bold text-white text-sm mt-1">{form.className} - {form.division}</h5>
                        <span className="text-[10px] text-slate-400">Template: {form.templateName}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-300 truncate max-w-[210px]">{form.publicUrl}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(form.publicUrl);
                            alert(`Form link copied!\n${form.publicUrl}`);
                          }}
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-sans font-semibold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                        <a
                          href={form.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[10px] font-sans font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Open
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="text-slate-400 font-semibold mr-1">Active Fields:</span>
                      {masterFields.slice(0, 5).map(m => (
                        <span key={m.id} className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                          {m.label}
                        </span>
                      ))}
                      {form.customFields.map((cf, idx) => (
                        <span key={idx} className="bg-emerald-950 border border-emerald-500/40 px-1.5 py-0.5 rounded text-emerald-300 font-semibold">
                          +{cf.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Form Assignment Controls */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Select Target Class / Batch</label>
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold border border-slate-700 rounded-lg px-3 py-2"
              >
                {schoolBatches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.className} - {b.division} ({b.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Assigned ID Template</label>
              <div className="bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold rounded-lg px-3 py-2 truncate">
                🎨 {activeTemplate.name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Generated Batch Token URL</label>
              <div className="bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-mono rounded-lg px-3 py-2 truncate flex items-center justify-between">
                <span className="truncate">{publicFormUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicFormUrl);
                    alert('Tokenized link copied to clipboard!');
                  }}
                  className="ml-2 text-[10px] text-white bg-emerald-700 px-2 py-0.5 rounded font-sans"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Master Synced + Custom Fields Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Form Fields Selection</h4>
              <button
                onClick={() => setShowCustomFieldModal(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Field
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masterFields.map(f => (
                <div key={f.id} className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{f.label}</h4>
                    <span className="text-xs text-slate-400 font-mono">Type: {f.dataType}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded" />
                    <span className="text-xs text-emerald-300 font-semibold">Include</span>
                  </label>
                </div>
              ))}
              {customFields.map((cf, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-300 text-sm">{cf.label} (Custom)</h4>
                    <span className="text-xs text-slate-400 font-mono">Type: {cf.dataType}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Added to Form
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Direct Self-Service Correction Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Self-Service Data Correction</h3>
            <p className="text-xs text-slate-400">PRD 5.3.5: Directly edit rejected card without Tenant round-trip.</p>

            <form onSubmit={handleSaveCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={e => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={editingStudent.rollNo}
                  onChange={e => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={editingStudent.bloodGroup}
                  onChange={e => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Save & Regenerate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Class Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Class Batch</h3>
            <p className="text-xs text-slate-400">Define standard & division manually to generate its public tokenized link.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Standard / Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="e.g. Grade 11 / MCA 1st Year"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Division / Section / Batch</label>
                <input
                  type="text"
                  value={newDivision}
                  onChange={e => setNewDivision(e.target.value)}
                  placeholder="e.g. Section C / Science A"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newClassName && newDivision) {
                      schoolBatches.push({
                        id: `batch-${Date.now()}`,
                        schoolId: activeSchool.id,
                        className: newClassName,
                        division: newDivision,
                        academicYear: '2026-2027',
                        status: 'Open',
                      });
                      setSelectedBatchId(`batch-${Date.now()}`);
                      setNewClassName('');
                      setNewDivision('');
                      setShowBatchModal(false);
                      confetti({ particleCount: 40, spread: 60 });
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Save & Select Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {showCustomFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Custom Form Field</h3>
            <p className="text-xs text-slate-400">PRD 5.2.3: Schools can add institution-specific fields alongside starter library.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Field Label / Name</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  placeholder="e.g. Hostel Room No / Bus Route"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Field Data Type</label>
                <select
                  value={customType}
                  onChange={e => setCustomType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="text">Text Input</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown Choice</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomFieldModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (customLabel) {
                      setCustomFields(prev => [...prev, { label: customLabel, dataType: customType }]);
                      setCustomLabel('');
                      setShowCustomFieldModal(false);
                      confetti({ particleCount: 30, spread: 50 });
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Add Field to Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Flag / Reject ID Card</h3>
            <textarea
              rows={3}
              value={rejectionComment}
              onChange={e => setRejectionComment(e.target.value)}
              placeholder="State reason (e.g. Blurry photo, typo in guardian name)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-700 text-slate-300 text-xs rounded-lg">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
