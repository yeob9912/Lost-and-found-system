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
  Phone,
  Shield,
  HelpCircle,
  LogIn,
  Sparkles,
  Layers,
  Palette,
  FileText,
  ArrowRight,
  Info,
  Check,
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

export interface LostItemFormProps {
  onSuccess?: (newItem: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function LostItemForm({ onSuccess, onCancel, isModal = false }: LostItemFormProps) {
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
    date: new Date().toISOString().split('T')[0],
    description: '',
    distinguishingFeatures: '',
    contactPhone: '',
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
      setErrorMessage('Please enter the name of the lost item.');
      return;
    }

    if (!formData.location) {
      setErrorMessage('Please select the location where you lost the item.');
      return;
    }

    if (formData.location === 'Other Campus Location' && !formData.customLocation.trim()) {
      setErrorMessage('Please specify the custom campus location.');
      return;
    }

    if (!formData.date) {
      setErrorMessage('Please select the date when the item was lost.');
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage('Please provide a description of the lost item.');
      return;
    }

    setLoading(true);

    try {
      const resolvedLocation =
        formData.location === 'Other Campus Location'
          ? formData.customLocation.trim()
          : formData.location;

      let responseData: any = null;

      if (token) {
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('category', formData.category);
        payload.append('location', resolvedLocation);
        payload.append('date', formData.date);
        payload.append('description', formData.description.trim());

        if (formData.brand.trim()) payload.append('brand', formData.brand.trim());
        if (formData.color.trim()) payload.append('color', formData.color.trim());
        if (formData.distinguishingFeatures.trim()) {
          payload.append('distinguishingFeatures', formData.distinguishingFeatures.trim());
        }
        if (formData.contactPhone.trim()) {
          payload.append('contactPhone', formData.contactPhone.trim());
        }

        if (imageFile) {
          payload.append('image', imageFile);
        } else if (imagePreview) {
          payload.append('image', imagePreview);
        }

        const res = await fetch('http://localhost:5000/api/lost-items', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json.message || 'Failed to submit lost item report.');
        }

        responseData = json.data || json;
      }

      const finalizedItem = {
        id: responseData?._id || responseData?.id || Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim() || 'Unknown',
        color: formData.color.trim() || 'Unspecified',
        location: resolvedLocation,
        date: formData.date,
        description: formData.description.trim(),
        distinguishingFeatures: formData.distinguishingFeatures.trim(),
        image:
          responseData?.image ||
          imagePreview ||
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900',
        status: 'Lost',
        reportedBy: currentUser?.fullName || 'ASTU Student',
      };

      setCreatedItem(finalizedItem);
      setSubmitted(true);

      if (onSuccess) {
        onSuccess(finalizedItem);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(
        err.message || 'An error occurred while submitting your lost item report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-6 sm:p-10 text-center shadow-2xl max-w-xl mx-auto animate-in zoom-in-95 duration-200">
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-rose-100/60 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-100/60 blur-2xl" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-xl shadow-rose-500/25">
            <CheckCircle2 size={40} />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700">
            <Sparkles size={14} /> Report Broadcasted to Campus
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Lost Item Report Published!
          </h2>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Your report for{' '}
            <strong className="text-gray-900 font-bold">
              {createdItem?.name || formData.name}
            </strong>{' '}
            is now registered. When someone reports finding it, you will receive an instant match alert.
          </p>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/40 p-4.5 text-xs text-gray-700 border border-rose-100 text-left space-y-2.5">
            <p className="font-bold text-gray-900 flex items-center gap-2">
              <Shield size={15} className="text-rose-600" />
              What happens next?
            </p>
            <div className="space-y-1.5 pl-6 text-gray-600 text-xs">
              <p>• Visible immediately on the <strong>ASTU Lost Items Directory</strong>.</p>
              <p>• Automatically matched against current and incoming found property.</p>
              <p>• You will be notified in <strong>My Claims</strong> or <strong>Notifications</strong> when verified.</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl bg-gray-900 hover:bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white transition shadow-md"
              >
                Close &amp; View List
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
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  distinguishingFeatures: '',
                  contactPhone: '',
                });
                setImageFile(null);
                setImagePreview('');
              }}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm"
            >
              Report Another Lost Item
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
      <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500" />

      {/* Main Container */}
      <div className="p-6 sm:p-9">
        {/* Header Bar */}
        <div className="mb-7 flex items-start justify-between border-b border-gray-100 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 border border-rose-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Lost Property Registry
                </span>
                <span className="text-[11px] font-medium text-gray-400">• ASTU Campus</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                Report a Lost Item
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                Provide details about your missing belongings so our community and security can identify them.
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

        {/* Authentication Notice if not signed in */}
        {!currentUser && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 text-xs text-amber-900 border border-amber-200/80 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 text-amber-700 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950">Student Login Recommended</strong>
                Sign in with your ASTU account to receive match notifications when someone finds this item.
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { returnTo: '/lost-items' } })}
              className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition"
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
          {/* SECTION 1: Item Core Identification */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[11px] font-black">
                1
              </span>
              <span>Item Overview &amp; Categorization</span>
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
                  placeholder="e.g. HP Pavilion 15 Silver Laptop, Black Leather Wallet"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 placeholder:text-gray-400"
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
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
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
                  Brand / Maker
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Dell, Apple, Samsung, Casio, Unknown"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Color & Date */}
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
                    placeholder="e.g. Matte Black, Metallic Blue, Silver"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Date Lost <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Location & Description */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[11px] font-black">
                2
              </span>
              <span>Where &amp; How It Was Lost</span>
            </div>

            {/* Campus Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Last Known Campus Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
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
                  placeholder="Specify exact building name, room, or floor number"
                  className="mt-2.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Item Description &amp; Circumstances <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe where you think you misplaced it, its condition, carrying pouch, or context..."
                required
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* SECTION 3: Secret Proof of Ownership */}
          <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-4.5 sm:p-5.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[11px] font-black">
                  3
                </span>
                <span>Secret Marks &amp; Proof (Admin Protected)</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                <Shield size={12} /> Confidential
              </span>
            </div>

            <p className="text-[12px] text-amber-800/90 leading-relaxed">
              List unique identifiers that only you know (serial number, distinctive scratch, internal stickers, wallpaper, or wallet contents). Campus security uses this to confirm ownership when someone turns in a matching item.
            </p>

            <textarea
              name="distinguishingFeatures"
              rows={2}
              value={formData.distinguishingFeatures}
              onChange={handleInputChange}
              placeholder="e.g. Serial #CNU1234, small scratch on top left bezel, ASTU library slip in side pocket"
              className="w-full rounded-xl border border-amber-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-500/15 resize-none placeholder:text-gray-400"
            />
          </div>

          {/* SECTION 4: Contact & Photo */}
          <div className="rounded-2xl border border-gray-100 bg-[#fbfdfa] p-4.5 sm:p-5.5 space-y-4.5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[11px] font-black">
                4
              </span>
              <span>Contact &amp; Photo Attachment</span>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Phone Number (for Coordination)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+251 9... or 09..."
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Photo (Item picture, previous photo, or model reference)
              </label>

              {imagePreview ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/30 p-2.5 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Lost item preview"
                    className="h-32 w-32 rounded-xl object-cover bg-white shadow-sm border border-gray-200"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-gray-900">
                      {imageFile ? imageFile.name : 'Image attached'}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Ready to upload'}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition shadow-sm"
                    >
                      <X size={14} /> Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 hover:border-rose-400 bg-white hover:bg-rose-50/20 px-6 py-7 text-center transition duration-200">
                  <div className="mb-2.5 rounded-2xl bg-rose-50 p-3 text-rose-600 shadow-sm border border-rose-100 group-hover:scale-110 transition duration-200">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    Click to attach or drag an image
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Lost Report...</span>
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  <span>Publish Lost Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
