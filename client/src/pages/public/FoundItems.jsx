import React, { useMemo, useState, useEffect } from "react";
import FoundItemForm from '../../components/found-items/FoundItemForm';
import { Link } from "react-router-dom";
import {
    Search,
    MapPin,
    CalendarDays,
    ChevronDown,
    ChevronUp,
    PackageSearch,
    PlusCircle,
    AlertCircle,
    Eye,
    Tag,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ItemDetails, { formatDisplayDate } from "../../components/common/ItemDetails";

const sampleFoundItems = [
    {
        id: 1,
        name: "Green Wireless Headphones",
        category: "Electronics",
        brand: "Sony",
        color: "Green",
        location: "Central Library",
        date: "2026-10-21",
        description: "Wireless Sony headphones with padded ear cushions found on a study desk.",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85",
        status: "Found",
    },
    {
        id: 2,
        name: "Navy Canvas Backpack",
        category: "Bags",
        brand: "Unknown",
        color: "Navy Blue",
        location: "Science Building",
        date: "2026-10-22",
        description: "A navy-blue backpack suitable for carrying books, left near Lecture Hall 3.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
        status: "Found",
    },
    {
        id: 3,
        name: "Scientific Calculator",
        category: "Educational Materials",
        brand: "Casio",
        color: "Black",
        location: "Engineering Lab 2",
        date: "2026-10-24",
        description: "Casio scientific calculator with sliding hard cover found on lab bench.",
        image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=85",
        status: "Found",
    },
    {
        id: 4,
        name: "Student ID Card with Blue Lanyard",
        category: "Personal Items",
        brand: "ASTU",
        color: "Blue",
        location: "Main Cafeteria",
        date: "2026-10-25",
        description: "ASTU Student ID card in a transparent card holder attached to a university blue lanyard.",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85",
        status: "Found",
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

export default function FoundItems() {
    const [items, setItems] = useState(sampleFoundItems);
    const [showReportModal, setShowReportModal] = useState(false);
    const [successBanner, setSuccessBanner] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [expandedItem, setExpandedItem] = useState(null);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const search = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !search ||
                [item.name, item.category, item.brand, item.color, item.location, item.description]
                    .some((value) => value.toLowerCase().includes(search));

            const matchesCategory =
                selectedCategory === "All Categories" || item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const toggleDetails = (id) => {
        setExpandedItem((prev) => (prev === id ? null : id));
    };

    return (
        <div className="min-h-screen bg-[#f5faf7] text-gray-800 flex flex-col justify-between">
            <div>
                <Navbar />

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-emerald-800">
                    <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-600/30 blur-3xl" />
                    <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-5 py-8 sm:py-10 md:py-8 sm:py-10 lg:px-8">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-700/80 px-3 py-1 text-xs font-semibold text-emerald-100">
                                <AlertCircle size={15} />
                                ASTU Found Items Registry
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                                Found Belongings on Campus
                            </h1>

                            <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-emerald-100/90">
                                Recovered items handed over to university custody or reported by ASTU community members. Browse the records below to identify and claim your missing belongings.
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowReportModal(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
                                >
                                    <PlusCircle size={16} />
                                    Report a Found Item
                                </button>
                                <a
                                    href="#found-items-list"
                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-700/60 px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    <Search size={16} />
                                    Search Found Items
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main id="found-items-list" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
                    {/* Search and Category Filters */}
                    <div className="mb-6 space-y-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
                                <input
                                    type="text"
                                    placeholder="Search by item name, brand, color, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-500">
                                    Showing {filteredItems.length} found items
                                </span>
                            </div>
                        </div>

                        {/* Category Badges */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                        selectedCategory === cat
                                            ? "bg-emerald-800 text-white shadow-sm"
                                            : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:border-emerald-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Items Grid */}
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((item) => (
                                <article
                                    key={item.id || item._id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div>
                                        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute left-3 top-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                                                <Tag size={13} />
                                                {item.category}
                                            </div>

                                            <h2 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition">
                                                {item.name}
                                            </h2>

                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span>Found at {item.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays size={14} className="text-gray-400" />
                                                    <span>{formatDisplayDate(item.date)}</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 border-t border-gray-100 pt-4">
                                                <button
                                                    onClick={() => toggleDetails(item.id || item._id)}
                                                    className="flex w-full items-center justify-between text-xs font-semibold text-emerald-900"
                                                >
                                                    <span>{expandedItem === (item.id || item._id) ? "Hide Details" : "View Item Details"}</span>
                                                    {expandedItem === (item.id || item._id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedItem === (item.id || item._id) && (
                                        <ItemDetails item={item} />
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                            <PackageSearch className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                            <h3 className="font-bold text-gray-800">No found items match your criteria</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Try searching with different keywords or choosing another category.
                            </p>
                        </div>
                    )}
                    {/* Bottom CTA for reporting found items */}
                    <section className="mt-16 overflow-hidden rounded-2xl bg-emerald-800 text-white">
                        <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:px-12 md:text-left">
                            <div className="max-w-xl">
                                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                                    <ShieldCheck size={16} />
                                    FOUND SOMETHING ON CAMPUS?
                                </div>
                                <h2 className="text-2xl font-extrabold sm:text-3xl">
                                    Help Return It to Its Owner
                                </h2>
                                <p className="mt-2 text-xs sm:text-sm text-emerald-100">
                                    Log the item in the university registry so the true owner can identify and claim it.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowReportModal(true)}
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                            >
                                <PlusCircle size={17} />
                                Report a Found Item
                            </button>
                        </div>
                    </section>

                    {/* Success Banner */}
                    {successBanner && (
                        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 px-5 py-4 text-xs sm:text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                            <span>{successBanner}</span>
                        </div>
                    )}
                </main>
            </div>

            {/* Dedicated Found Item Reporting Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-3xl my-8">
                        <FoundItemForm
                            isModal
                            onCancel={() => setShowReportModal(false)}
                            onSuccess={(newItem) => {
                                setItems((prev) => [newItem, ...prev]);
                                setShowReportModal(false);
                                setSuccessBanner(`The found item "${newItem.name}" has been successfully registered!`);
                                setTimeout(() => setSuccessBanner(""), 6000);
                            }}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

