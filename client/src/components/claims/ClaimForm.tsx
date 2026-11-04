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
    date: '',
    location: '',
    description: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // 1. Authentication Check
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Redirect unauthenticated user to login/registration
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
    }));
  }, [navigate, location]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      setErrorMessage('Please provide the date, location, and details.');
      return;
    }

    setLoading(true);

    // Simulate backend submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }, 700);
  };

  const isClaim = mode === 'claim';

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex flex-col font-sans text-[#2D3748]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          {/* Top back navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (onClose ? onClose() : navigate(-1))}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#527063] hover:text-[#1A362B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                ASTU Verified Portal
              </span>
            </div>
          </div>

          {/* Submission Success State */}
          {submitted ? (
            <div className="rounded-3xl border border-[#D5E2D1] bg-white p-8 sm:p-12 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Clock className="h-8 w-8 animate-pulse" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 mb-3">
                <Clock className="h-3.5 w-3.5" />
                Status: Pending Verification
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A362B]">
                {isClaim ? 'Claim Submitted Successfully' : 'Found Match Report Submitted'}
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm text-[#4A6B5D] leading-relaxed">
                {isClaim
                  ? 'Your claim status is now Pending Verification. The campus admin is reviewing your ownership details before approving or coordinating pickup.'
                  : 'Your found match report status is now Pending Verification. The admin will verify the match and coordinate with both you and the owner to safely return the item.'}
              </p>

              {/* Summary Card */}
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#E2E9DF] bg-[#F9FBF8] p-5 text-left text-xs">
                <h4 className="font-bold text-[#1A362B] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Submission Summary
                </h4>
                <div className="space-y-1.5 text-gray-600">
                  <p><strong className="text-gray-900">Name:</strong> {formData.fullName}</p>
                  <p><strong className="text-gray-900">Student ID:</strong> {formData.studentId}</p>
                  <p><strong className="text-gray-900">Phone:</strong> {formData.phoneNumber}</p>
                  <p><strong className="text-gray-900">{isClaim ? 'Lost Date:' : 'Found Date:'}</strong> {formData.date}</p>
                  <p><strong className="text-gray-900">{isClaim ? 'Lost Location:' : 'Found Location:'}</strong> {formData.location}</p>
                  {item && <p><strong className="text-gray-900">Referenced Item:</strong> {item.name}</p>}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to={isClaim ? '/my-claims' : '/my-reports'}
                  className="w-full sm:w-auto rounded-xl bg-emerald-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-950 transition duration-200"
                >
                  {isClaim ? 'View in My Claims' : 'View in My Reports'}
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div className="rounded-3xl border border-[#D5E2D1] bg-white p-6 sm:p-10 shadow-xl">
              {/* Header */}
              <div className="border-b border-[#E0E7DC] pb-6 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A6B5D] mb-1">
                  <Handshake className="h-4 w-4 text-[#2D5A46]" />
                  <span>{isClaim ? 'Claim Form' : 'Found Match Form'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A362B]">
                  {isClaim ? 'Submit Ownership Claim' : 'Report Found Item Match'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#527063]">
                  {isClaim
                    ? 'Please provide identifying evidence so campus security can confirm your ownership.'
                    : 'Help return this lost item to its rightful student owner by submitting match details.'}
                </p>

                {/* Referenced Item Banner (if arrived from an item) */}
                {item && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-[#E9F0E6] p-3 text-xs">
                    <Tag className="h-5 w-5 text-emerald-800 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A362B] truncate">
                        Target Item: {item.name}
                      </p>
                      <p className="text-[#4A6B5D] truncate">
                        {item.category} • Location: {item.location} • Status: {item.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Student / Finder Identity Section */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{isClaim ? "Claimant Information" : "Finder Information"}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={isClaim ? "Claimant's name" : "Finder's name"}
                        className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] px-4 py-2.5 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        placeholder="e.g. UGR/12345/26"
                        className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] px-4 py-2.5 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder={isClaim ? "Contact information" : "How admin can contact the finder"}
                          className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] pl-10 pr-4 py-2.5 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Loss or Discovery Details */}
                <div className="border-t border-[#E0E7DC] pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{isClaim ? "Incident Details" : "Discovery Details"}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        {isClaim ? "When did you lose it? *" : "When did you find it? *"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] pl-10 pr-4 py-2.5 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        {isClaim ? "Where did you lose it? *" : "Where did you find it? *"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder={isClaim ? "Approximate location (e.g. Student Centre)" : "Actual location found"}
                          className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] pl-10 pr-4 py-2.5 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                        {isClaim
                          ? "Describe identifying features *"
                          : "Describe the found item *"}
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={
                          isClaim
                            ? "Unique marks, stickers, scratches, lock-screen details, contents inside, serial number, etc."
                            : "Details confirming the match: physical condition, distinctive markings, exact brand details..."
                        }
                        className="w-full rounded-xl border border-[#D5E2D1] bg-[#FAFCFA] p-3 text-sm focus:border-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/20 transition duration-150"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {isClaim
                          ? "Evidence & identifying proof remain strictly private to protect your ownership."
                          : "This information helps the admin confirm the match before contacting the student."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Supporting Evidence Upload */}
                <div className="border-t border-[#E0E7DC] pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                    <UploadCloud className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{isClaim ? "Upload Proof (Optional)" : "Upload Photo *"}</span>
                  </h3>
                  <p className="text-xs text-[#527063] mb-3">
                    {isClaim
                      ? "Optional supporting photo, invoice, serial receipt, or identifying document."
                      : "Photo of the physically found item to assist admin verification."}
                  </p>

                  {proofPreview ? (
                    <div className="relative inline-block rounded-2xl border border-emerald-200 overflow-hidden bg-emerald-50/50 p-2">
                      <img
                        src={proofPreview}
                        alt="Uploaded preview"
                        className="h-40 w-auto rounded-xl object-cover max-w-full"
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-3 right-3 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700 transition duration-150"
                        title="Remove uploaded image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D5E2D1] hover:border-emerald-700 rounded-2xl p-6 cursor-pointer bg-[#FAFCFA] hover:bg-[#F3F7F2] transition duration-200">
                      <UploadCloud className="h-8 w-8 text-[#4A6B5D] mb-2" />
                      <span className="text-xs font-semibold text-[#1A362B]">
                        Click to upload {isClaim ? 'proof' : 'photo'}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, or WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Status Notice */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-3 text-xs text-amber-900">
                  <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Review Policy</span>
                    <span>
                      After submission, the {isClaim ? 'claim' : 'report'} status becomes{' '}
                      <strong>Pending Verification</strong>. The admin reviews the ownership information before approving or rejecting it.
                    </span>
                  </div>
                </div>

                {/* C. Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#E0E7DC]">
                  <button
                    type="button"
                    onClick={() => (onClose ? onClose() : navigate(-1))}
                    disabled={loading}
                    className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 px-7 py-2.5 text-xs font-bold text-white shadow-sm transition duration-150 disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>{isClaim ? 'Submit Claim' : 'Submit Found Match'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

