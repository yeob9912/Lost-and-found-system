import React, { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Shield,
  Phone,
  Image as ImageIcon,
} from 'lucide-react';

export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected' | 'Pending Verification';

export interface ClaimItem {
  id: string | number;
  itemName: string;
  category: string;
  description: string;
  image: string;
  location: string;
  submittedDate: string;
  status: ClaimStatus;
  claimMessage: string;
  claimantName?: string;
  studentId?: string;
  phoneNumber?: string;
  proofImage?: string;
  adminNote?: string;
}

export interface ClaimCardProps {
  claim: ClaimItem;
  onViewDetails?: (claim: ClaimItem) => void;
  onCancelClaim?: (id: string | number) => void;
}

export default function ClaimCard({ claim, onViewDetails, onCancelClaim }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            <XCircle size={13} className="text-red-600" />
            Rejected
          </span>
        );
      case 'Pending':
      case 'Pending Verification':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Claim Item Image */}
          <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-emerald-50/50 sm:h-32 sm:w-36">
            <img
              src={claim.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'}
              alt={claim.itemName}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute left-2.5 top-2.5">
              <span className="rounded-md bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
                {claim.category}
              </span>
            </div>
          </div>

          {/* Claim Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 transition hover:text-emerald-800">
                  {claim.itemName}
                </h3>
                <p className="mt-1 text-xs font-medium text-emerald-800">
                  Category: {claim.category}
                </p>
              </div>
              <div className="self-start">{getStatusBadge(claim.status)}</div>
            </div>

            <p className="mt-2.5 line-clamp-2 text-sm text-gray-600 leading-relaxed">
              {claim.description}
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-700 shrink-0" />
                {claim.location}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-emerald-700 shrink-0" />
                Submitted: {claim.submittedDate}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setExpanded(!expanded);
                  if (onViewDetails) onViewDetails(claim);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100"
              >
                <Eye size={14} />
                {expanded ? 'Hide Claim Details' : 'View Claim Details'}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {claim.status === 'Pending' && onCancelClaim && (
                <button
                  type="button"
                  onClick={() => onCancelClaim(claim.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                >
                  Withdraw Claim
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Claim Details Drawer */}
        {expanded && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-[#fbfdfa] p-4.5 text-xs text-gray-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <p className="flex items-center gap-1.5 font-bold text-emerald-950">
                <FileText size={14} className="text-emerald-700" />
                Ownership Statement / Claim Message:
              </p>
              <p className="mt-1.5 rounded-lg bg-white p-3 text-gray-700 border border-gray-100 leading-relaxed">
                {claim.claimMessage || 'No message provided.'}
              </p>
            </div>

            {(claim.claimantName || claim.studentId || claim.phoneNumber) && (
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-100 sm:grid-cols-3">
                {claim.claimantName && (
                  <div>
                    <span className="text-gray-400 block text-[11px]">Claimant Name</span>
                    <span className="font-semibold text-gray-800">{claim.claimantName}</span>
                  </div>
                )}
                {claim.studentId && (
                  <div>
                    <span className="text-gray-400 block text-[11px]">Student ID</span>
                    <span className="font-semibold text-gray-800">{claim.studentId}</span>
                  </div>
                )}
                {claim.phoneNumber && (
                  <div>
                    <span className="text-gray-400 block text-[11px]">Contact Phone</span>
                    <span className="font-semibold text-gray-800">{claim.phoneNumber}</span>
                  </div>
                )}
              </div>
            )}

            {claim.proofImage && (
              <div className="pt-2 border-t border-gray-100">
                <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-emerald-700" />
                  Uploaded Proof Photo:
                </p>
                <img
                  src={claim.proofImage}
                  alt="Proof"
                  className="h-28 rounded-lg border border-gray-200 object-cover"
                />
              </div>
            )}

            {claim.adminNote && (
              <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-2.5 text-amber-900">
                <span className="font-bold block">Admin Feedback:</span>
                <span>{claim.adminNote}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

