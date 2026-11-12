import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ItemDetails, { formatDisplayDate } from '../../components/common/ItemDetails';

import React, { useMemo, useState, useEffect } from "react";
import LostItemForm from '../../components/lost-items/LostItemForm';
import { Link } from "react-router-dom";
import {
    Search,
    MapPin,
    CalendarDays,
    Clock,
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    PackageSearch,
    PlusCircle,
    Filter,
    AlertCircle,
    Eye,
    Phone,
    ShieldCheck,
    Laptop,
    Smartphone,
    BookOpen,
    Wallet,
    KeyRound,
    Watch,
    Briefcase,
} from "lucide-react";

// Sample lost items
// Replace these sample records with your backend API data.

const lostItems = [
    {
        id: 1,
        name: "HP Laptop",
        category: "Electronics",
        brand: "HP",
        color: "Silver",
        location: "ASTU Library",
        date: "2026-10-28",
        description:
            "A silver HP laptop was lost around the library study area. It was inside a black laptop bag.",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900",
        status: "Lost",
    },
    {
        id: 2,
        name: "Black Wallet",
        category: "Personal Items",
        brand: "Unknown",
        color: "Black",
        location: "Main Cafeteria",
        date: "2026-10-29",
        description:
            "A black wallet was lost near the main cafeteria. It contains personal cards and other belongings.",
        image:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900",
        status: "Lost",
    },
    {
        id: 3,
        name: "Samsung Phone",
        category: "Electronics",
        brand: "Samsung",
        color: "Blue",
        location: "Engineering Block",
        date: "2026-10-30",
        description:
            "A blue Samsung smartphone was reported missing around the Engineering Block.",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900",
        status: "Lost",
    },
    {
        id: 4,
        name: "Student Backpack",
        category: "Bags",
        brand: "Unknown",
        color: "Black",
        location: "ASTU Dormitory",
        date: "2026-10-31",
        description:
            "A black student backpack was lost near the dormitory entrance. It contains educational materials.",
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
        status: "Lost",
    },
    {
        id: 5,
        name: "Wrist Watch",
        category: "Accessories",
        brand: "Casio",
        color: "Silver",
        location: "Sports Field",
        date: "2026-11-01",
        description:
            "A silver Casio wristwatch was lost around the university sports field.",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
        status: "Lost",
    },
    {
        id: 6,
        name: "Mathematics Notebook",
        category: "Educational Materials",
        brand: "Unknown",
        color: "Blue",
        location: "Classroom Block",
        date: "2026-11-02",
        description:
            "A blue mathematics notebook was lost in one of the classrooms. It contains handwritten study notes.",
        image:
            "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=900",
        status: "Lost",
    },
];

const categories = [
    "All Categories",
    "Electronics",
    "Personal Items",
    "Bags",
    "Accessories",
    "Educational Materials",
    "Other",
];

const LostItems = () => {
    const [items, setItems] = useState(lostItems);
    const [showReportModal, setShowReportModal] = useState(false);
    const [successBanner, setSuccessBanner] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All Categories");
    const [expandedItem, setExpandedItem] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fetch live lost items from backend API
    useEffect(() => {
        let isMounted = true;
        const fetchItems = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/lost-items");
                if (res.ok) {
                    const data = await res.json();
                    const apiItems = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                    if (isMounted && apiItems.length > 0) {
                        const normalized = apiItems.map((it) => ({
                            id: it._id || it.id,
                            name: it.name,
                            category: it.category,
                            brand: it.brand || 'Unknown',
                            color: it.color || 'Unknown',
                            location: it.location,
                            date: it.date ? String(it.date).split('T')[0] : new Date().toISOString().split('T')[0],
                            description: it.description,
                            image: it.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900',
                            status: it.status || 'Lost',
                        }));
                        setItems((prev) => {
                            const apiIds = new Set(normalized.map((x) => String(x.id)));
                            const remaining = prev.filter((p) => !apiIds.has(String(p.id)));
                            return [...normalized, ...remaining];
                        });
                    }
                }
            } catch {
                // Keep sample items if server is offline
            }
        };
        fetchItems();
        return () => {
            isMounted = false;
        };
    }, []);

    // Search and filter lost items
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const search = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                [
                    item.name,
                    item.category,
                    item.brand,
                    item.color,
                    item.location,
                    item.description,
                ].some((value) => value && value.toLowerCase().includes(search));

            const matchesCategory =
                selectedCategory === "All Categories" ||
                item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [items, searchTerm, selectedCategory]);

    const toggleDetails = (id) => {
        setExpandedItem((previous) => (previous === id ? null : id));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All Categories");
        setExpandedItem(null);
    };

    const formatDate = (date) => {
        return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#f5faf7]/85 dark:bg-[#0D0E12]/85 text-gray-800 dark:text-gray-100 relative z-10 transition-colors">

            {/* ================= NAVBAR ================= */}
            <Navbar />

            {/* ================= HERO SECTION ================= */}

            <section className="relative overflow-hidden bg-emerald-800">
                <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-600/30 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-8 sm:py-10 md:py-12 lg:px-8">

                    <div className="max-w-3xl">

                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-700/80 px-3 py-1 text-xs font-semibold text-emerald-100">
                            <AlertCircle size={15} />
                            ASTU Lost Items Directory
                        </div>

                        <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                            Lost Something?
                            <span className="mt-2 block text-emerald-300">
                                Let's Help You Find It.
                            </span>
                        </h2>

                        <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-emerald-100/90">
                            Browse items reported missing within Adama Science and
                            Technology University. Your lost belongings might already
                            have been reported by someone.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-2.5">

                            <a
                                href="#browse-items"
                                className="flex items-center gap-2 rounded-lg bg-white px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 shadow-sm"
                            >
                                <Search size={16} />
                                Search Items
                            </a>

                            <button
                                type="button"
                                onClick={() => setShowReportModal(true)}
                                className="flex items-center gap-2 rounded-xl border border-red-300/50 bg-red-600 px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-red-700 shadow-sm"
                            >
                                <PlusCircle size={16} />
                                Report a Lost Item
                            </button>

                        </div>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}

            <main
                id="browse-items"
                className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8"
            >

                {/* Section Heading */}
                <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            LOST PROPERTY
                        </div>

                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                            Recently Reported Lost Items
                        </h2>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Find items reported missing around ASTU.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-lg border border-emerald-100 dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-3.5 py-2 sm:self-auto shadow-sm">
                        <PackageSearch size={20} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {filteredItems.length} Items Found
                        </span>
                    </div>
                </div>

                {/* ================= SEARCH AND FILTER ================= */}

                <div className="glass-panel mb-6 rounded-2xl p-4 shadow-lg sm:p-5">

                    <div className="mb-5 flex items-center gap-2">
                        <Filter size={19} className="text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">
                            Find Your Lost Item
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Search Input */}
                        <div className="relative md:col-span-2">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by item name, brand, color, or location..."
                                className="w-full rounded-xl border border-gray-200 dark:border-[#2A2D35] bg-gray-50 dark:bg-[#181A20] py-2.5 pl-11 pr-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E2028] focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 dark:border-[#2A2D35] bg-gray-50 dark:bg-[#181A20] px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category} className="dark:bg-[#181A20] dark:text-gray-200">
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Search using an item name or select a category to narrow
                            your results.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:text-emerald-900 dark:hover:text-emerald-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* ================= LOST ITEM CARDS ================= */}

                {filteredItems.length > 0 ? (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredItems.map((item) => (

                            <article
                                key={item.id || item._id}
                                className="glass-card group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >

                                {/* Item Image */}
                                <div className="relative h-56 overflow-hidden bg-emerald-50 dark:bg-emerald-950/20">

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                            Lost Item
                                        </span>
                                    </div>

                                    <div className="absolute right-4 top-4">
                                        <span className="rounded-full bg-white/95 dark:bg-[#181A20]/90 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm border border-transparent dark:border-[#2A2D35]">
                                            {item.category}
                                        </span>
                                    </div>

                                </div>

                                {/* Card Content */}
                                <div className="p-5">

                                    <div className="mb-3 flex items-start justify-between gap-3">

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white transition group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                            {item.name}
                                        </h3>

                                        <span className="shrink-0 rounded-md bg-red-50 dark:bg-red-950/50 px-2 py-1 text-[10px] font-bold uppercase text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Basic Information */}
                                    <div className="space-y-2.5">

                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span>{item.location}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <CalendarDays size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span>{formatDate(item.date)}</span>
                                        </div>

                                    </div>

                                    <div className="my-5 border-t border-gray-100 dark:border-[#2A2D35]" />

                                    {/* Expand Details */}
                                    <button
                                        onClick={() => toggleDetails(item.id || item._id)}
                                        aria-expanded={expandedItem === (item.id || item._id)}
                                        className="flex w-full items-center justify-between rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-4 py-3 text-sm font-bold text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                                    >
                                        {expandedItem === (item.id || item._id)
                                            ? "Hide Details"
                                            : "View Item Details"}

                                        {expandedItem === (item.id || item._id) ? (
                                            <ChevronUp size={18} />
                                        ) : (
                                            <ChevronDown size={18} />
                                        )}
                                    </button>

                                    {/* Expanded Details - Inline, not an overlay */}
                                    {expandedItem === (item.id || item._id) && (
                                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-[#2A2D35] shadow-sm">
                                            <ItemDetails item={{ ...item, status: item.status || 'Lost' }} />
                                        </div>
                                    )}

                                    {/* Reported Item Footer */}
                                    <div className="mt-5 flex items-center justify-between">

                                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                            Reported on {formatDisplayDate(item.date)}
                                        </span>

                                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                            <Eye size={14} />
                                            Public Report
                                        </span>

                                    </div>

                                </div>
                            </article>
                        ))}

                    </div>

                ) : (

                    /* ================= EMPTY STATE ================= */

                    <div className="rounded-2xl border border-dashed border-emerald-200 dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-5 py-16 text-center">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                            <PackageSearch size={30} className="text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            No Lost Items Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                            We couldn't find any lost items matching your search.
                            Try another keyword or change your selected category.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-lg bg-emerald-600 dark:bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600"
                        >
                            Clear Search
                        </button>

                    </div>
                )}

                {/* ================= REPORT CTA ================= */}

                <section className="mt-16 overflow-hidden rounded-2xl bg-emerald-800">

                    <div className="flex flex-col items-center justify-between gap-8 px-6 py-10 text-center md:flex-row md:px-12 md:text-left">

                        <div className="max-w-xl">

                            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                                <AlertCircle size={17} />
                                YOUR ITEM IS STILL MISSING?
                            </div>

                            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                                Report Your Lost Item
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-emerald-100">
                                Submit a lost item report with its image and details.
                                Help the ASTU community recognize and return your
                                belongings.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => setShowReportModal(true)}
                            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                        >
                            Report a Lost Item
                            <ArrowRight size={18} />
                        </button>

                    </div>
                </section>

            </main>
            {/* ================= LOST ITEM REPORT MODAL ================= */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-3xl my-8">
                        <LostItemForm
                            isModal
                            onCancel={() => setShowReportModal(false)}
                            onSuccess={(newItem) => {
                                setItems((prev) => [newItem, ...prev]);
                                setShowReportModal(false);
                                setSuccessBanner(`Your lost item "${newItem.name}" has been successfully reported!`);
                                setTimeout(() => setSuccessBanner(""), 6000);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* ================= SUCCESS BANNER ================= */}
            {successBanner && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 px-5 py-4 text-xs sm:text-sm font-semibold text-white shadow-2xl">
                    <span className="text-emerald-400">&#10003;</span>
                    <span>{successBanner}</span>
                </div>
            )}

            {/* ================= FOOTER ================= */}
            <Footer />

        </div>
    );
};

export default LostItems;
