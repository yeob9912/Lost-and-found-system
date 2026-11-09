import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PackageSearch,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import LostItemCard, { type LostItemData } from './LostItemCard';

export interface LostItemListProps {
  items?: LostItemData[];
  onViewDetails?: (item: LostItemData) => void;
  onReportMatch?: (item: LostItemData) => void;
  title?: string;
  subtitle?: string;
}

const DEFAULT_CATEGORIES = [
  'All Categories',
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

export default function LostItemList({
  items = [],
  onViewDetails,
  onReportMatch,
  title,
  subtitle,
}: LostItemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesQuery =
          !query ||
          [
            item.name,
            item.category,
            item.brand || '',
            item.color || '',
            item.location,
            item.description,
          ].some((val) => val.toLowerCase().includes(query));

        const matchesCategory =
          selectedCategory === 'All Categories' || item.category === selectedCategory;

        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [items, searchTerm, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSortBy('newest');
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-black text-gray-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-4.5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-12">
          {/* Search input */}
          <div className="relative md:col-span-6">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, item name, brand, or location..."
              className="w-full rounded-xl border border-gray-200 bg-[#fbfdfa] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-[#fbfdfa] px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-[#fbfdfa] px-3 py-2.5 text-xs sm:text-sm text-gray-800 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Status & Results bar */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredItems.length}</strong> of{' '}
            <strong className="text-gray-900">{items.length}</strong> lost items
          </span>

          {(searchTerm || selectedCategory !== 'All Categories' || sortBy !== 'newest') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <RotateCcw size={13} />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Lost Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <LostItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewDetails}
              onReportMatch={onReportMatch}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-16 px-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No lost items found</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'All Categories'
              ? 'Try modifying your search keywords or resetting the category filter.'
              : 'There are currently no lost items recorded in this section.'}
          </p>
          {(searchTerm || selectedCategory !== 'All Categories') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 rounded-xl bg-emerald-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-emerald-900"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

