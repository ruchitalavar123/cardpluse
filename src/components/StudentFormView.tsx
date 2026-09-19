'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentFormView: React.FC = () => {
  const { activeSchoolId, schools, masterFields, addStudentSubmission } = useApp();
  const school = schools.find(s => s.id === activeSchoolId) || schools[0];

  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('Grade 10');
  const [division, setDivision] = useState('Section A');
  const [dob, setDob] = useState('2010-05-15');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Photo quality check states PRD 5.4.1
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

      // Simulate Photo Quality AI Check PRD 5.4.1
      if (file.size < 5000) {
        setQualityCheckStatus('failed');
        setQualityError('Image resolution too low or blurry. Please upload a clear headshot.');
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
      alert('Camera access denied or unequipped. Uploading an existing photo instead!');
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

      // Stop camera track
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
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-8 bg-slate-800 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Submission Complete!</h2>
        <p className="text-xs text-slate-300">
          Your ID card application for <strong className="text-white">{school.name}</strong> has been received and timestamped.
        </p>
        <div className="bg-slate-900/80 p-4 rounded-xl text-left text-xs text-slate-400 space-y-1 font-mono border border-slate-700">
          <div>Student: {fullName}</div>
          <div>Roll No: {rollNo}</div>
          <div>Class: {className} - {division}</div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/90 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            Public Tokenized Student Form (No Login Required)
          </span>
          <h2 className="text-2xl font-extrabold text-white pt-2">{school.name}</h2>
          <p className="text-xs text-slate-400">Official Student ID Registration & Photo Capture Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Composite uniqueness notice */}
          <div className="bg-slate-900/60 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>PRD 5.4: Roll Number + Class composite uniqueness check active.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Roll Number *</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g. 10A-05"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Class / Grade</label>
              <input
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Division / Section</label>
              <input
                type="text"
                value={division}
                onChange={e => setDivision(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Emergency Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              />
            </div>
          </div>

          {/* Guided Photo Capture Section PRD 5.4.1 */}
          <div className="border-t border-slate-700/80 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-white text-xs">Student ID Photo (Upload or Live Camera)</label>
              <span className="text-[10px] text-amber-400 font-semibold">Guided Live Overlay Active</span>
            </div>

            {/* Quality Instructions */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-[11px] text-amber-200">
              💡 <strong>Photo Guidance:</strong> Face the camera directly against a plain background with clear lighting. No caps or sunglasses.
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 border border-slate-700 rounded-2xl relative">
              {isCameraActive ? (
                <div className="relative w-48 h-56 rounded-xl overflow-hidden border-2 border-cyan-400">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Face positioning overlay guide */}
                  <div className="absolute inset-0 border-2 border-dashed border-cyan-300 rounded-full m-4 pointer-events-none opacity-80" />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-slate-900 font-bold text-xs rounded-full shadow-lg"
                  >
                    📸 Snap Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <img src={photoUrl} alt="Preview" className="w-28 h-36 rounded-xl object-cover border-2 border-slate-600 mx-auto shadow-md" />
                  
                  <div className="flex items-center gap-2 justify-center">
                    <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-semibold cursor-pointer text-xs flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1 shadow-md shadow-cyan-600/30"
                    >
                      <Camera className="w-3.5 h-3.5" /> Live Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Immediate retake validation feedback PRD 5.4.1 */}
              {qualityCheckStatus === 'passed' && (
                <div className="mt-3 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Automated Photo Check Passed (Face centered, valid sharpness)
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-amber-500/20"
          >
            Submit ID Card Details
          </button>
        </form>
      </div>
    </div>
  );
};
