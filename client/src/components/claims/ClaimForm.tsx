import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  User as UserIcon,
  IdCard,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  AlertCircle,
  Tag,
  Handshake,
  Lock,
  Loader2,
  Check,
  Building,
} from 'lucide-react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCurrentUser, type AuthUser } from '../../services/authService';

interface ClaimFormProps {
  initialItem?: any;
  initialMode?: 'claim' | 'match';
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ClaimForm({
  initialItem,
  initialMode,
  onClose,
  onSuccess,
}: ClaimFormProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state passed via react-router navigation (if any)
  const navState = (location.state as { item?: any; mode?: 'claim' | 'match' }) || {};
  const queryParams = new URLSearchParams(location.search);
  const queryMode = queryParams.get('mode') as 'claim' | 'match' | null;

  // Active form mode: "claim" (Claim Found Item) vs "match" (Report Found Match for Lost Item)
  const mode: 'claim' | 'match' =
    initialMode ||
    navState.mode ||
    queryMode ||
    (navState.item?.status === 'Found' ? 'claim' : 'claim');

  const item = initialItem || navState.item || null;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    phoneNumber: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // 1. Authentication Check
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Redirect unauthenticated user to login
      navigate('/login', {
        replace: true,
        state: { returnTo: location.pathname + location.search },
      });
      return;
    }

    setUser(currentUser);
    setFormData((prev) => ({
      ...prev,
      fullName: currentUser.fullName || '',
      studentId: currentUser.studentId || '',
      phoneNumber: (currentUser as any).phone || prev.phoneNumber,
    }));
  }, [navigate, location]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Proof file must be less than 5 MB.');
        return;
      }
      setErrorMessage('');
      setProofFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    if (proofPreview) {
      URL.revokeObjectURL(proofPreview);
      setProofPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.studentId.trim() || !formData.phoneNumber.trim()) {
      setErrorMessage('Please fill in all contact information.');
      return;
    }

    if (!formData.date || !formData.location.trim() || !formData.description.trim()) {
      setErrorMessage('Please provide the date, location, and identifying details.');
      return;
    }

    setLoading(true);

    // Simulate backend submission for claim verification
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }, 700);
  };

  const isClaim = mode === 'claim';

  return (
    <div className="min-h-screen bg-[#f5faf7] dark:bg-[#0D0E12] flex flex-col font-sans text-gray-800 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Top back navigation bar */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (onClose ? onClose() : navigate(-1))}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-150"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Previous</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-800 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                ASTU Security Verified Process
              </span>
            </div>
          </div>

          {/* Submission Success State */}
          {submitted ? (
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 sm:p-12 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-teal-100/50 blur-2xl" />

              <div className="relative">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/25">
                  <Clock className="h-10 w-10 animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-bold text-amber-900 mb-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  Status: Pending Verification
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {isClaim ? 'Ownership Claim Submitted!' : 'Found Item Match Reported!'}
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600 leading-relaxed">
                  {isClaim
                    ? 'Your claim has been forwarded to campus security for official verification. Once approved, you will receive an alert with pickup instructions.'
                    : 'Thank you! Campus security is reviewing the match details and will coordinate with both parties to verify ownership.'}
                </p>

                {/* Summary Card */}
                <div className="mx-auto mt-7 max-w-lg rounded-2xl border border-gray-100 bg-[#fbfdfa] p-5 text-left text-xs shadow-sm">
                  <h4 className="font-extrabold text-gray-900 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    Submitted Verification Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Claimant Name</span>
                      <strong className="text-gray-900">{formData.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Student ID</span>
                      <strong className="text-gray-900">{formData.studentId}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Contact Phone</span>
                      <strong className="text-gray-900">{formData.phoneNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">{isClaim ? 'Date Lost' : 'Date Found'}</span>
                      <strong className="text-gray-900">{formData.date}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block text-[11px]">{isClaim ? 'Estimated Loss Location' : 'Location Found'}</span>
                      <strong className="text-gray-900">{formData.location}</strong>
                    </div>
                    {item && (
                      <div className="sm:col-span-2 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
                        <span className="text-emerald-800 block text-[11px] font-semibold">Referenced Property</span>
                        <strong className="text-emerald-950">{item.name}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to={isClaim ? '/my-claims' : '/my-reports'}
                    className="w-full sm:w-auto rounded-xl bg-emerald-900 hover:bg-emerald-950 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.99]"
                  >
                    {isClaim ? 'View in My Claims' : 'View in My Reports'}
                  </Link>
                  <Link
                    to="/"
                    className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
              {/* Top Accent Gradient Stripe */}
              <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800" />

              <div className="p-6 sm:p-10">
                {/* Header */}
                <div className="border-b border-gray-100 pb-6 mb-7">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm">
                      <Handshake size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {isClaim ? 'Claim Submission' : 'Match Coordination'}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">• Official Verification</span>
                      </div>
                      <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                        {isClaim ? 'Submit Ownership Claim' : 'Report Found Item Match'}
                      </h1>
                      <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                        {isClaim
                          ? 'Provide identifying evidence and circumstances so campus security can confirm your ownership.'
                          : 'Provide details confirming your recovered item matches this missing property report.'}
                      </p>
                    </div>
                  </div>

                  {/* Referenced Item Banner (if arrived from an item) */}
                  {item && (
                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 to-teal-50/40 p-4 text-xs shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover border border-emerald-200 bg-white shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                            <Tag size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                            Item Being Claimed
                          </span>
                          <p className="font-extrabold text-gray-900 truncate text-sm">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-[11px] truncate">
                            {item.category} • Location: {item.location} • Status: {item.status}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 self-start sm:self-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                          <Check size={12} /> Target Verified
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Notice */}
                {errorMessage && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 shadow-sm animate-in fade-in duration-200">
                    <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Please check your entries:</strong>
                      <span className="font-normal">{errorMessage}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* SECTION 1: Verified Student Identity */}
                  <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                          1
                        </span>
                        <span>{isClaim ? 'Claimant Credentials' : 'Finder Credentials'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <ShieldCheck size={12} /> Student Account
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder={isClaim ? "Claimant's full name" : "Finder's full name"}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          ASTU Student ID <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <IdCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            placeholder="e.g. UGR/12345/26"
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="+251 9... or 09..."
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Incident & Identifying Proof */}
                  <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        2
                      </span>
                      <span>{isClaim ? 'Loss Circumstances & Identifying Features' : 'Match Evidence'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          {isClaim ? 'Date When Lost *' : 'Date When Found *'}
                        </label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          {isClaim ? 'Estimated Loss Location *' : 'Discovery Location *'}
                        </label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder={isClaim ? "e.g. Central Library 2nd Floor, Main Cafeteria" : "Where item was found"}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                            {isClaim ? 'Detailed Identifying Features *' : 'Match Confirmation Details *'}
                          </label>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                            <Lock size={11} /> Admin Confidential
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={
                            isClaim
                              ? 'Provide secret identifying features: serial number, distinctive scratches, stickers, lock screen wallpaper, specific files/cards inside...'
                              : 'Provide details that confirm this matches the missing property: physical condition, exact markings, serial code...'
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 resize-none placeholder:text-gray-400"
                        />
                        <p className="mt-1 text-[11px] text-gray-400">
                          {isClaim
                            ? 'Your identifying description is never published publicly. Campus security uses it exclusively to verify legitimate ownership.'
                            : 'This information assists campus security in validating the item prior to contacting the student.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Evidence Upload */}
                  <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-3.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        3
                      </span>
                      <span>{isClaim ? 'Supporting Proof (Optional)' : 'Item Photo *'}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {isClaim
                        ? 'Upload a photo showing prior possession, purchase receipt, serial registration, or previous photo of the item.'
                        : 'Upload a clear photograph of the found item to aid admin verification.'}
                    </p>

                    {proofPreview ? (
                      <div className="relative inline-block rounded-2xl border border-emerald-200 overflow-hidden bg-white p-2 shadow-sm">
                        <img
                          src={proofPreview}
                          alt="Proof preview"
                          className="h-44 w-auto rounded-xl object-cover max-w-full"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute top-4 right-4 rounded-full bg-rose-600 p-2 text-white shadow-md hover:bg-rose-700 transition"
                          title="Remove uploaded file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-7 cursor-pointer bg-white hover:bg-emerald-50/20 transition duration-200 text-center">
                        <div className="mb-2.5 rounded-2xl bg-emerald-50 p-3 text-emerald-800 shadow-sm border border-emerald-100 group-hover:scale-110 transition duration-200">
                          <UploadCloud size={24} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          Click to upload {isClaim ? 'proof document or photo' : 'photo of item'}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          PNG, JPG, or WEBP up to 5 MB
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>

                  {/* Security Policy Reminder */}
                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/40 p-4 flex items-start gap-3 text-xs text-amber-950 shadow-sm">
                    <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="block font-bold">Campus Security Verification Policy</strong>
                      Submissions enter <strong>Pending Verification</strong> status. The university administrator cross-checks evidence before scheduling physical custody handover.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => (onClose ? onClose() : navigate(-1))}
                      disabled={loading}
                      className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-900 hover:to-black px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/25 transition active:scale-[0.99] disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting Verification...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>{isClaim ? 'Submit Official Claim' : 'Submit Found Match'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
