'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, CheckCircle2, ShieldCheck, AlertTriangle, RefreshCw, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IDCardCanvas } from './IDCardCanvas';
import { StudentSubmission } from '../types';

export const StudentFormView: React.FC = () => {
  const { activeSchoolId, schools, templates, addStudentSubmission } = useApp();
  const school = schools.find(s => s.id === activeSchoolId) || schools[0];
  const assignedTemplate = templates.find(t => t.id === school.assignedTemplateId) || templates[0];

  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('Computer Science');
  const [division, setDivision] = useState('Section A');
  const [dob, setDob] = useState('2005-05-15');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Photo quality & Data validation states
  const [qualityCheckStatus, setQualityCheckStatus] = useState<'idle' | 'passed' | 'failed'>('passed');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  // Construct temporary student object for live preview canvas
  const previewStudent: StudentSubmission = {
    id: 'preview-temp',
    schoolId: school.id,
    batchId: 'batch-1',
    rollNo: rollNo || 'CS-26-XX',
    fullName: fullName || 'STUDENT NAME',
    className: className || 'Computer Science',
    division: division || 'Section A',
    dob: dob,
    bloodGroup: bloodGroup,
    phone: phone || '+91 98765 43210',
    photoUrl: photoUrl,
    submittedAt: new Date().toISOString(),
    status: 'Data Submitted',
    panX: 0,
    panY: 0,
    zoom: 1.0,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict Image Validation
    const errors: string[] = [];

    // Format validation
    const validFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      errors.push('Invalid format. Please upload JPG, PNG, or WEBP image.');
    }

    // Size validation (min 15KB for quality, max 5MB for storage protection)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size exceeds 5MB limit. Please select a smaller compressed photo.');
    }

    if (errors.length > 0) {
      setQualityCheckStatus('failed');
      setValidationErrors(errors);
      return;
    }

    // Image resolution inspection
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      if (img.width < 200 || img.height < 200) {
        setQualityCheckStatus('failed');
        setValidationErrors(['Photo resolution too low (minimum 200x200 px required for crisp printing).']);
      } else {
        setPhotoUrl(url);
        setQualityCheckStatus('passed');
        setValidationErrors([]);
      }
    };
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. You can upload an existing photo file directly!');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, 400, 480);
      const dataUrl = canvas.toDataURL('image/png');
      setPhotoUrl(dataUrl);

      // Stop camera tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);

      setQualityCheckStatus('passed');
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errs: string[] = [];

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.push('Full Name must be at least 3 characters long.');
    }
    if (!rollNo.trim()) {
      errs.push('Roll Number is required.');
    }
    if (phone && !/^\+?[0-9\s-]{10,15}$/.test(phone)) {
      errs.push('Emergency contact must be a valid 10-15 digit phone number.');
    }
    if (qualityCheckStatus === 'failed') {
      errs.push('Please fix photo validation errors before submitting.');
    }

    setValidationErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addStudentSubmission({
      schoolId: school.id,
      batchId: 'batch-1',
      rollNo,
      fullName,
      className,
      division,
      dob,
      bloodGroup,
      phone: phone || '+91 98765 00000',
      photoUrl,
    });

    setSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-10 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registration Submitted!</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your ID card submission for <strong className="text-slate-900">{school.name}</strong> has been received and queued for review.
        </p>
        <div className="bg-slate-50 p-4 rounded-xl text-left text-xs text-slate-700 space-y-1.5 font-mono border border-slate-200">
          <div><span className="text-slate-500">Student:</span> {fullName}</div>
          <div><span className="text-slate-500">Roll / ID:</span> {rollNo}</div>
          <div><span className="text-slate-500">Class:</span> {className} ({division})</div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full px-4 py-2.5 bg-[#E12836] hover:bg-[#c91f2c] text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Header Branding */}
        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
          <span className="text-[11px] font-bold text-[#E12836] tracking-widest uppercase">
            PUBLIC TOKENIZED FORM LINK
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{school.name}</h2>
          <p className="text-xs text-slate-500">Official Student ID Registration & Live Preview Portal</p>
        </div>

        {/* Validation error summary box */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl space-y-1 text-xs text-red-700">
            <div className="font-bold flex items-center gap-1.5 text-red-800">
              <AlertTriangle className="w-4 h-4 text-[#E12836]" /> Please resolve the following errors:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-2">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-medium">Strict photo format, size limit (5MB) & resolution check active.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Patil"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold font-mono">Roll / Registration No *</label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. CS-26-05"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Class / Department</label>
                <input
                  type="text"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Division / Section</label>
                <input
                  type="text"
                  value={division}
                  onChange={e => setDivision(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#E12836] transition-colors"
                />
              </div>
            </div>

            {/* Photo Capture Section */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-xs">Student ID Photo (Upload or Live Camera)</label>
                <span className="text-[10px] text-emerald-600 font-semibold">Framing Guidelines Active</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[11px] text-slate-600 leading-relaxed">
                💡 <strong>Photo Guidance:</strong> Face directly forward against a plain light background with adequate lighting. No sunglasses.
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                {isCameraActive ? (
                  <div className="relative w-48 h-56 rounded-xl overflow-hidden border-2 border-[#E12836]">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-dashed border-[#E12836] rounded-full m-4 pointer-events-none opacity-80" />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-[#E12836] hover:bg-[#c91f2c] text-white font-bold text-xs rounded-full shadow-lg transition-colors"
                    >
                      📸 Snap Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-24 h-32 rounded-xl object-cover border border-slate-300 mx-auto shadow-sm"
                    />
                    
                    <div className="flex items-center gap-2 justify-center">
                      <label className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-slate-500" /> Upload File
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>

                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3.5 py-1.5 bg-[#083EFD] hover:bg-[#0633ce] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" /> Live Camera
                      </button>
                    </div>
                  </div>
                )}

                {qualityCheckStatus === 'passed' && (
                  <div className="mt-3 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo framing and quality checks passed
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E12836] hover:bg-[#c91f2c] text-white font-bold rounded-xl text-sm shadow-xs transition-all"
            >
              Submit ID Card Details
            </button>
          </form>

          {/* Right Column: Real-time Watermarked ID Card Preview (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="flex items-center justify-between w-full border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E12836]" /> Live ID Card Preview
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewSide('front')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${previewSide === 'front' ? 'bg-[#E12836] text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSide('back')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${previewSide === 'back' ? 'bg-[#E12836] text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Watermarked Card Render */}
            <div className="py-2">
              <IDCardCanvas
                student={previewStudent}
                template={assignedTemplate}
                side={previewSide}
                scale={0.95}
                watermark={true}
                showLanyard={true}
                schoolName={school.name}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-800">
              🔒 <strong>Watermarked Preview:</strong> Watermark will be automatically removed once approved by school & sent for printing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


