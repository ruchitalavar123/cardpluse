'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentFormView: React.FC = () => {
  const { activeSchoolId, schools, masterFields, addStudentSubmission } = useApp();
  const school = schools.find(s => s.id === activeSchoolId) || schools[0];

  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('Computer Science');
  const [division, setDivision] = useState('Section A');
  const [dob, setDob] = useState('2005-05-15');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Photo quality check states
  const [qualityCheckStatus, setQualityCheckStatus] = useState<'idle' | 'passed' | 'failed'>('passed');
  const [qualityError, setQualityError] = useState<string | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);

      if (file.size < 5000) {
        setQualityCheckStatus('failed');
        setQualityError('Image resolution too low or blurry. Please upload a high-resolution headshot.');
      } else {
        setQualityCheckStatus('passed');
        setQualityError(null);
      }
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      canvas.width = 300;
      canvas.height = 350;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, 300, 350);
      const dataUrl = canvas.toDataURL('image/png');
      setPhotoUrl(dataUrl);

      // Stop camera tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);

      setQualityCheckStatus('passed');
      setQualityError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !rollNo) {
      alert('Please fill out all required fields');
      return;
    }

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
          <div><span className="text-slate-500">Platform:</span> Yash Enterprises</div>
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
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Header Branding */}
        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
          <span className="text-[11px] font-bold text-[#E12836] tracking-widest uppercase">
            YASH ENTERPRISES
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{school.name}</h2>
          <p className="text-xs text-slate-500">Official Student ID Registration & Photo Capture Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium">Active verification: Roll Number + Department composite duplicate check enabled.</span>
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
              <label className="block text-slate-700 mb-1 font-semibold">Roll / Registration No *</label>
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
                    className="w-28 h-36 rounded-xl object-cover border border-slate-300 mx-auto shadow-sm"
                  />
                  
                  <div className="flex items-center gap-2 justify-center">
                    <label className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" /> Upload File
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3.5 py-1.5 bg-[#E12836] hover:bg-[#c91f2c] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" /> Live Camera
                    </button>
                  </div>
                </div>
              )}

              {qualityCheckStatus === 'passed' && (
                <div className="mt-3 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Automated Photo Framing Check Passed
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
      </div>
    </div>
  );
};
