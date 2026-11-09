import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Building,
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';

export interface FoundItemData {
  id: string | number;
  name: string;
  category: string;
  brand?: string;
  color?: string;
  location: string;
  date: string;
  description: string;
  image: string;
  status?: string;
  storageLocation?: string;
  foundBy?: string;
}

export interface FoundItemCardProps {
  item: FoundItemData;
  onViewDetails?: (item: FoundItemData) => void;
  onClaim?: (item: FoundItemData) => void;
}

export default function FoundItemCard({ item, onViewDetails, onClaim }: FoundItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClaimClick = () => {
    if (onClaim) {
      onClaim(item);
      return;
    }
    const user = getCurrentUser();
    if (!user) {
      navigate('/login', {
        state: {
          returnTo: '/claim',
          claimItem: { ...item, status: 'Found' },
          mode: 'claim',
        },
      });
      return;
    }
    navigate('/claim', {
      state: {
        item: { ...item, status: 'Found' },
        mode: 'claim',
      },
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-emerald-100/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
      <div>
        {/* Item Image with Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-emerald-50/50">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute left-3.5 top-3.5">
            <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white shadow-md">
              Found Item
            </span>
          </div>

          <div className="absolute right-3.5 top-3.5">
            <span className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
              {item.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="mb-2.5 flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-gray-900 transition group-hover:text-emerald-800 line-clamp-1">
              {item.name}
            </h3>
            <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              {item.status || 'Found'}
            </span>
          </div>

          {/* Key Meta */}
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-emerald-700" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="shrink-0 text-emerald-700" />
              <span>Found on {formatDate(item.date)}</span>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-xs text-gray-600 leading-relaxed">
            {item.description}
          </p>

          {/* Expandable Details */}
          {expanded && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 text-xs text-gray-700 space-y-2 animate-in fade-in duration-150">
              {item.brand && (
                <div>
                  <span className="text-gray-400 block text-[11px]">Brand / Model</span>
                  <span className="font-semibold text-gray-900">{item.brand}</span>
                </div>
              )}
              {item.color && (
                <div>
                  <span className="text-gray-400 block text-[11px]">Primary Color</span>
                  <span className="font-semibold text-gray-900">{item.color}</span>
                </div>
              )}
              {item.storageLocation && (
                <div>
                  <span className="text-gray-400 block text-[11px] flex items-center gap-1">
                    <Building size={12} className="text-emerald-700" />
                    Holding / Safeguard Location
                  </span>
                  <span className="font-semibold text-emerald-950">{item.storageLocation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="border-t border-gray-100 bg-[#fcfdfa] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setExpanded(!expanded);
              if (onViewDetails) onViewDetails(item);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200/90 bg-white py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50"
          >
            {expanded ? 'Hide Details' : 'View Details'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={handleClaimClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-900"
          >
            <ShieldCheck size={14} />
            Claim Item
          </button>
        </div>
      </div>
    </article>
  );
}

