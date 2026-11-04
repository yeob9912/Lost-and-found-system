import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tag,
  ClipboardList,
  Palette,
  FileText,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Handshake
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';

export const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return 'Not specified';
  // Try parsing YYYY-MM-DD or standard date string
  const cleanStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
  const parsed = new Date(cleanStr);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const month = parsed.toLocaleString('en-US', { month: 'short' });
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return dateStr;
};

export default function ItemDetails({ item }: { item: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = () => {
    const user = getCurrentUser();
    const mode = item.status?.toLowerCase() === 'lost' ? 'match' : 'claim';

    if (!user) {
      // If not authenticated, redirect to login first
      navigate('/login', { state: { returnTo: location.pathname } });
    } else {
      // If authenticated, navigate to claim form
      navigate('/claim', { state: { item, mode } });
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'found':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'lost':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'claimed':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-[#f7faf7] p-4 text-left">
      <h4 className="mb-4 text-sm font-bold text-emerald-950 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-800"></span>
        Item Information
      </h4>

      <div className="space-y-3 text-xs">
        {/* Item Name */}
        <div className="flex items-start gap-2">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Item Name</p>
            <p className="mt-1 font-medium text-gray-900">{item.name}</p>
          </div>
        </div>

        {/* Item Category */}
        <div className="flex items-start gap-2">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Item Category</p>
            <p className="mt-1 font-medium text-gray-900">{item.category}</p>
          </div>
        </div>

        {/* Brand / Manufacturer */}
        <div className="flex items-start gap-2">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Brand / Manufacturer</p>
            <p className="mt-1 font-medium text-gray-900">{item.brand || 'Unknown'}</p>
          </div>
        </div>

        {/* Color */}
        <div className="flex items-start gap-2">
          <Palette className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Color</p>
            <p className="mt-1 font-medium text-gray-900">{item.color || 'Unknown'}</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Description</p>
            <p className="mt-1 leading-relaxed text-gray-900">{item.description}</p>
          </div>
        </div>

        {/* Lost / Found Location */}
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Lost / Found Location</p>
            <p className="mt-1 font-medium text-gray-900">{item.location}</p>
          </div>
        </div>

        {/* Lost / Found Date */}
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Lost / Found Date</p>
            <p className="mt-1 font-medium text-gray-900">{formatDisplayDate(item.date)}</p>
          </div>
        </div>

        {/* Item Status */}
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
          <div>
            <p className="font-semibold text-gray-500">Item Status</p>
            <span className={`mt-1 inline-block rounded-full px-3 py-1 font-bold ${getStatusBadge(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>
      </div>

      {/* Claim Button / Action */}
      <div className="mt-4 border-t border-gray-200/60 pt-3">
        <button
          type="button"
          onClick={handleAction}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-xs font-bold text-white transition duration-200 hover:bg-emerald-950 shadow-sm cursor-pointer"
        >
          <Handshake size={15} />
          {item.status === 'Found' ? 'Claim this item' : 'Report Found Match'}
        </button>
      </div>
    </div>
  );
}

