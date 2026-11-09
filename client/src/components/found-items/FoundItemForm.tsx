import React, { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  Loader2,
  Shield,
  Building,
  Phone,
  Lock,
  LogIn,
  Layers,
  Palette,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getCurrentUser, getToken } from '../../services/authService';

const CATEGORIES = [
  'Electronics',
  'Personal Items',
  'Bags',
  'Accessories',
  'Educational Materials',
  'Documents / ID',
  'Clothing',
  'Keys',
  'Other',
];

const CAMPUS_LOCATIONS = [
  'ASTU Main Library',
  'Main Cafeteria',
  'Engineering Block',
  'Applied Science Building',
  'Freshman Building',
  'Block 500 / 501 / 502',
  'Dormitory Block',
  'Sports Field / Stadium',
  'Student Lounge / Recreation',
  'Administration Building',
  'Campus Gate / Security Post',
  'Other Campus Location',
];

const STORAGE_LOCATIONS = [
  'ASTU Campus Security Office (Main Gate)',
  'Main Library Information Desk',
  'Student Union / Affairs Office',
  'Department Academic Office',
  'Main Cafeteria Administration',
  'Held by Finder (Will surrender upon admin match)',
];

export interface FoundItemFormProps {
  onSuccess?: (newItem: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function FoundItemForm({ onSuccess, onCancel, isModal = false }: FoundItemFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();
  const token = getToken();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    brand: '',
    color: '',
    location: 'ASTU Main Library',
    customLocation: '',
    storageLocation: 'ASTU Campus Security Office (Main Gate)',
    date: new Date().toISOString().split('T')[0],
    description: '',
    privateDetails: '',
    finderContact: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [createdItem, setCreatedItem] = useState<any>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5 MB.');
      return;
    }

    setErrorMessage('');
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter the name of the found item.');
      return;
    }

    if (!formData.location) {
      setErrorMessage('Please specify where you found the item.');
      return;
    }

    if (formData.location === 'Other Campus Location' && !formData.customLocation.trim()) {
      setErrorMessage('Please specify the custom campus location.');
      return;
    }

    if (!formData.storageLocation) {
      setErrorMessage('Please select where the found item is currently kept.');
      return;
    }

    if (!formData.date) {
      setErrorMessage('Please select the date when the item was found.');
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage('Please provide a general public description.');
      return;
    }

    setLoading(true);

    try {
      const resolvedLocation =
        formData.location === 'Other Campus Location'
          ? formData.customLocation.trim()
          : formData.location;

      const finalizedItem = {
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim() || 'Unknown',
        color: formData.color.trim() || 'Unspecified',
        location: resolvedLocation,
        storageLocation: formData.storageLocation,
        date: formData.date,
        description: formData.description.trim(),
        privateDetails: formData.privateDetails.trim(),
        image:
          imagePreview ||
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85',
        status: 'Found',
        reportedBy: currentUser?.fullName || 'ASTU Good Samaritan',
        finderContact: formData.finderContact.trim(),
      };

      // Simulating network delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      setCreatedItem(finalizedItem);
      setSubmitted(true);

      if (onSuccess) {
        onSuccess(finalizedItem);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(
        err.message || 'An error occurred while registering the found item. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 sm:p-10 text-center shadow-2xl max-w-xl mx-auto animate-in zoom-in-95 duration-200">
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-teal-100/60 blur-2xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-700/25">
            <CheckCircle2 size={40} />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles size={14} /> Registered in ASTU Found Custody
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Thank You for Doing the Right Thing!
          </h2>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Your found item report for{' '}
            <strong className="text-gray-900 font-bold">
              {createdItem?.name || formData.name}
            </strong>{' '}
            is now visible in the registry. The rightful owner can now identify and file a claim.
          </p>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4.5 text-xs text-emerald-950 border border-emerald-100 text-left space-y-2">
            <p className="font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" />
              Item Custody Reference
            </p>
            <div className="space-y-1.5 pl-6 text-emerald-900/90 text-xs">
              <p>• <strong>Holding Location:</strong> {formData.storageLocation}</p>
              <p>• <strong>Private Verification Details:</strong> Safely secured for admin proof challenges.</p>
              <p>• When a claimant files for this item, you will be coordinated via campus security.</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl bg-emerald-900 hover:bg-emerald-950 px-6 py-3 text-xs sm:text-sm font-bold text-white transition shadow-md"
              >
                Close &amp; View Found Items
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setCreatedItem(null);
                setFormData({
                  name: '',
                  category: 'Electronics',
                  brand: '',
                  color: '',
                  location: 'ASTU Main Library',
                  customLocation: '',
                  storageLocation: 'ASTU Campus Security Office (Main Gate)',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  privateDetails: '',
                  finderContact: '',
                });
                setImageFile(null);
                setImagePreview('');
              }}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm"
            >
              Report Another Found Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl ${
        isModal ? 'max-h-[90vh] overflow-y-auto' : 'mx-auto max-w-3xl'
      }`}
    >
      {/* Decorative Top Accent Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

      {/* Main Container */}
      <div className="p-6 sm:p-9">
        {/* Header Bar */}
        <div className="mb-7 flex items-start justify-between border-b border-gray-100 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Found Property Registry
                </span>
                <span className="text-[11px] font-medium text-gray-400">• ASTU Campus</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                Register a Found Item
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                Help reunite this item with its rightful owner by recording where it was recovered and where it is kept.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Security Tip Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 text-xs text-amber-900 border border-amber-200/80 shadow-sm">
          <Lock size={18} className="shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold text-amber-950">Fraud Prevention Guideline:</strong>
            Keep identifying serial numbers, stickers, or specific wallet contents confidential! Place them in the{' '}
            <span className="font-bold underline">Private Verification Details</span> field below so only the true owner can claim it.
          </div>
        </div>

        {/* Authentication Notice if not signed in */}
        {!currentUser && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 p-4 text-xs text-emerald-950 border border-emerald-200 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 text-emerald-700 mt-0.5" />
              <div>
                <strong className="block font-bold">Sign In to Earn ASTU Community Trust</strong>
                Recording under your verified student account connects your profile and enables direct updates.
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { returnTo: '/found-items' } })}
              className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition"
            >
              <LogIn size={13} /> Log In
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 shadow-sm animate-in fade-in duration-200">
            <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="block font-bold">Please check your inputs:</span>
              <span className="font-normal">{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* SECTION 1: Item Basic Information */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                1
              </span>
              <span>Found Item Overview</span>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Item Title / Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sony Wireless Headphones, Scientific Calculator, ASTU ID Card"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Sony, Casio, ASTU, Apple, Unknown"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Color & Date Found */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Primary Color
                </label>
                <div className="relative">
                  <Palette size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. Forest Green, Matte Black, Navy Blue"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Date Found <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Location Recovered & Current Custody */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                2
              </span>
              <span>Discovery Location &amp; Physical Custody</span>
            </div>

            {/* Campus Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Where on Campus Did You Find It? <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▼
                </div>
              </div>

              {formData.location === 'Other Campus Location' && (
                <input
                  type="text"
                  name="customLocation"
                  value={formData.customLocation}
                  onChange={handleInputChange}
                  placeholder="Specify building name, floor, or room number"
                  className="mt-2.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                />
              )}
            </div>

            {/* Current Storage Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Current Storage / Custody Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {STORAGE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▼
                </div>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-400">
                Informs the claimant and security where the physical item can be handed over upon proof of ownership.
              </p>
            </div>
          </div>

          {/* SECTION 3: Public Description vs Private Proof */}
          <div className="space-y-4">
            {/* Public Description */}
            <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                  3
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={13} className="text-emerald-700" />
                  Public Description (Visible to Campus) <span className="text-rose-500">*</span>
                </span>
              </div>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="General description visible on the public feed (e.g. Sony wireless headphones with green ear padding found on 2nd floor desk)."
                required
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 resize-none placeholder:text-gray-400"
              />
            </div>

            {/* Private Verification Details */}
            <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-4.5 sm:p-5.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-950">
                  <Lock size={14} className="text-emerald-700" />
                  <span>Private Verification Details (Admin-Only Challenge)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                  <Shield size={12} /> Hidden from Public
                </span>
              </div>
              <p className="text-[12px] text-emerald-900/80 leading-relaxed">
                Provide secret identifying details (e.g. initials, exact serial number, stickers, background wallpaper) so admins can verify anyone who attempts to claim this item.
              </p>
              <textarea
                name="privateDetails"
                rows={2}
                value={formData.privateDetails}
                onChange={handleInputChange}
                placeholder="e.g. Engraved initials 'D.M.' on inside band, specific serial #123456, or lock-screen photo"
                className="w-full rounded-xl border border-emerald-300 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-600/15 resize-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* SECTION 4: Contact & Photo */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                4
              </span>
              <span>Finder Contact &amp; Photo</span>
            </div>

            {/* Finder Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Finder Contact Phone (Optional)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  name="finderContact"
                  value={formData.finderContact}
                  onChange={handleInputChange}
                  placeholder="+251 9... or 09..."
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Photo of the Recovered Item
              </label>

              {imagePreview ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/30 p-2.5 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Found item preview"
                    className="h-32 w-32 rounded-xl object-cover bg-white shadow-sm border border-gray-200"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-gray-900">
                      {imageFile ? imageFile.name : 'Image attached'}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Ready to submit'}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition shadow-sm"
                    >
                      <X size={14} /> Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 px-6 py-7 text-center transition duration-200">
                  <div className="mb-2.5 rounded-2xl bg-emerald-50 p-3 text-emerald-700 shadow-sm border border-emerald-100 group-hover:scale-110 transition duration-200">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    Click to attach photo of found item
                  </span>
                  <span className="mt-1 text-[11px] text-gray-400">
                    PNG, JPG, JPEG, WEBP up to 5 MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-gray-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-800/25 transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering Found Item...</span>
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  <span>Publish Found Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
