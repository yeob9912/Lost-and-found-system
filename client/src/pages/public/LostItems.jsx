import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ItemDetails, { formatDisplayDate } from '../../components/common/ItemDetails';

import React, { useMemo, useState } from "react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All Categories");
    const [expandedItem, setExpandedItem] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Search and filter lost items
    const filteredItems = useMemo(() => {
        return lostItems.filter((item) => {
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
                ].some((value) => value.toLowerCase().includes(search));

            const matchesCategory =
                selectedCategory === "All Categories" ||
                item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

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
        <div className="min-h-screen bg-[#f5faf7] text-gray-800">

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

                            <Link
                                to="/report-item"
                                className="flex items-center gap-2 rounded-lg border border-emerald-300/50 bg-emerald-700 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-600"
                            >
                                <PlusCircle size={16} />
                                Report an Item
                            </Link>

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
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            LOST PROPERTY
                        </div>

                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            Recently Reported Lost Items
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Find items reported missing around ASTU.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-lg border border-emerald-100 bg-white px-3.5 py-2 sm:self-auto">
                        <PackageSearch size={20} className="text-emerald-600" />
                        <span className="text-sm font-semibold text-gray-700">
                            {filteredItems.length} Items Found
                        </span>
                    </div>
                </div>

                {/* ================= SEARCH AND FILTER ================= */}

                <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">

                    <div className="mb-5 flex items-center gap-2">
                        <Filter size={19} className="text-emerald-600" />
                        <h3 className="font-bold text-gray-800">
                            Find Your Lost Item
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Search Input */}
                        <div className="relative md:col-span-2">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by item name, brand, color, or location..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs sm:text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                        <p className="text-xs text-gray-500">
                            Search using an item name or select a category to narrow
                            your results.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
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
                                key={item.id}
                                className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* Item Image */}
                                <div className="relative h-56 overflow-hidden bg-emerald-50">

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
                                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>

                                </div>

                                {/* Card Content */}
                                <div className="p-5">

                                    <div className="mb-3 flex items-start justify-between gap-3">

                                        <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-emerald-700">
                                            {item.name}
                                        </h3>

                                        <span className="shrink-0 rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-600">
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Basic Information */}
                                    <div className="space-y-2.5">

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={16} className="shrink-0 text-emerald-600" />
                                            <span>{item.location}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <CalendarDays size={16} className="shrink-0 text-emerald-600" />
                                            <span>{formatDate(item.date)}</span>
                                        </div>

                                    </div>

                                    <div className="my-5 border-t border-gray-100" />

                                    {/* Expand Details */}
                                    <button
                                        onClick={() => toggleDetails(item.id)}
                                        aria-expanded={expandedItem === item.id}
                                        className="flex w-full items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
                                    >
                                        {expandedItem === item.id
                                            ? "Hide Details"
                                            : "View Item Details"}

                                        {expandedItem === item.id ? (
                                            <ChevronUp size={18} />
                                        ) : (
                                            <ChevronDown size={18} />
                                        )}
                                    </button>

                                    {/* Expanded Details - Inline, not an overlay */}
                                    {expandedItem === item.id && (
                                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                            <ItemDetails item={{ ...item, status: item.status || 'Lost' }} />
                                        </div>
                                    )}

                                    {/* Reported Item Footer */}
                                    <div className="mt-5 flex items-center justify-between">

                                        <span className="text-xs font-medium text-gray-400">
                                            Reported on {formatDisplayDate(item.date)}
                                        </span>

                                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
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

                    <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-5 py-16 text-center">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                            <PackageSearch size={30} className="text-emerald-600" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            No Lost Items Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            We couldn't find any lost items matching your search.
                            Try another keyword or change your selected category.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
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

                        <Link
                            to="/report-item"
                            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                        >
                            Report an Item
                            <ArrowRight size={18} />
                        </Link>

                    </div>
                </section>

            </main>

            {/* ================= FOOTER ================= */}
            <Footer />

        </div>
    );
};

export default LostItems;
