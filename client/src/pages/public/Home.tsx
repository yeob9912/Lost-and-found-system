import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { formatDisplayDate } from '../../components/common/ItemDetails';

import { useState } from 'react';

import {
    Search,
    MapPin,
    ArrowRight,
    FileText,
    Crosshair,
    ShieldCheck,
    Handshake,
    Heart,
    Shield,
    GraduationCap,
    CalendarDays,
    Plus,
    Tag,
    Palette,
    Eye,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Menu,
    X,
} from 'lucide-react';

export default function Home() {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Sample items.
    // Later, replace this array with data retrieved from your backend.
    const items = [
        {
            id: 1,
            name: 'Green wireless headphones',
            category: 'Electronics',
            brand: 'Sony',
            color: 'Green',
            description:
                'Wireless headphones with padded ear cushions and Bluetooth connectivity.',
            location: 'Central Library',
            date: '21 Oct 2026',
            image:
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=85&w=800',
            status: 'Found',
        },
        {
            id: 2,
            name: 'Cream insulated bottle',
            category: 'Personal Belongings',
            brand: 'Unknown',
            color: 'Cream',
            description:
                'A cream-colored insulated water bottle with a stainless-steel lid.',
            location: 'Student Centre',
            date: '22 Oct 2026',
            image:
                'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=85&w=800',
            status: 'Lost',
        },
        {
            id: 3,
            name: 'Navy canvas backpack',
            category: 'Bags',
            brand: 'Unknown',
            color: 'Navy Blue',
            description:
                'A navy-blue backpack suitable for carrying books and a laptop.',
            location: 'Science Building',
            date: '22 Oct 2026',
            image:
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=85&w=800',
            status: 'Claimed',
        },
        {
            id: 4,
            name: 'Terracotta notebook',
            category: 'Books and Stationery',
            brand: 'Unknown',
            color: 'Terracotta',
            description:
                'A terracotta-colored notebook with a hardcover and lined pages.',
            location: 'Arts Building',
            date: '21 Oct 2026',
            image:
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=85&w=800',
            status: 'Found',
        },
    ];

    const steps = [
        {
            icon: ClipboardList,
            title: 'Report it',
            description: 'Share where and when. Our team reviews reports.',
        },
        {
            icon: Search,
            title: 'Look for a match',
            description: 'We suggest items with similar details.',
        },
        {
            icon: ShieldCheck,
            title: 'Verify ownership',
            description: 'Submit proof for administrator review.',
        },
        {
            icon: Handshake,
            title: 'Meet & return',
            description: 'Coordinate a safe collection.',
        },
    ];

    // Filter items according to the search text.
    const filteredItems = items.filter((item) =>
        `${item.name} ${item.category} ${item.brand} ${item.location} ${item.status}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Status badge styles.
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Lost':
                return 'bg-red-100 text-red-700';

            case 'Found':
                return 'bg-emerald-100 text-emerald-800';

            case 'Claimed':
                return 'bg-amber-100 text-amber-800';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Expand or collapse item details.
    const toggleItemDetails = (itemId) => {
        setExpandedItemId((currentId) =>
            currentId === itemId ? null : itemId
        );
    };

    // Redirect the student to authentication before submitting a claim.
    const handleClaimRequest = (item) => {
        const claimUrl = `/claims/new/${item.id}`;

        window.location.href = `/login?redirect=${encodeURIComponent(claimUrl)}`;
    };

    return (
        <div
            id="home"
            className="min-h-screen overflow-hidden bg-white/85 dark:bg-[#0D0E12]/85 font-sans text-gray-800 dark:text-gray-100 relative z-10 transition-colors"
        >
            <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fb-fade-up {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fb-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes fb-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 91, 69, 0.12);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(16, 91, 69, 0);
          }
        }

        .fb-fade-up {
          animation: fb-fade-up 0.7s ease-out both;
        }

        .fb-delay-1 {
          animation-delay: 0.12s;
        }

        .fb-delay-2 {
          animation-delay: 0.24s;
        }

        .fb-delay-3 {
          animation-delay: 0.36s;
        }

        .fb-float {
          animation: fb-float 5s ease-in-out infinite;
        }

        .fb-pulse {
          animation: fb-pulse 2.5s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fb-fade-up,
          .fb-float,
          .fb-pulse {
            animation: none !important;
          }

          html {
            scroll-behavior: auto;
          }

          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            {/* ================= NAVBAR ================= */}
            <Navbar />

            <main>

                {/* ================= HERO SECTION ================= */}

                <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden px-6 py-12 lg:grid-cols-2 lg:py-16">

                    {/* Hero Text */}
                    <div className="fb-fade-up relative z-10 space-y-6">

                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 dark:text-emerald-300">
                            <GraduationCap className="h-4 w-4 text-emerald-900 dark:text-emerald-400" />
                            Adama Science and Technology University
                        </div>

                        <h2 className="max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight text-emerald-950 dark:text-white sm:text-4xl lg:text-5xl">
                            Find What You Lost
                            <br />
                            or Help Someone
                            <br />
                            <span className="text-emerald-800 dark:text-emerald-400">
                                Find It Back.
                            </span>
                        </h2>

                        <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                            University FindBack connects ASTU students to recover lost
                            items and return found belongings.
                        </p>

                        {/* Hero Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">

                            <a
                                href="/lost-items"
                                className="group inline-flex items-center gap-3 rounded-full bg-emerald-900 dark:bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-950 dark:hover:bg-emerald-500 hover:shadow-md sm:px-6 sm:py-3"
                            >
                                <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                                Search Items
                            </a>

                            <a
                                href="/report-item"
                                className="inline-flex items-center gap-3 rounded-full border border-emerald-900 dark:border-emerald-600 bg-white dark:bg-[#181A20] px-5 py-2.5 text-sm font-bold text-emerald-950 dark:text-emerald-300 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 sm:px-6 sm:py-3"
                            >
                                <Plus className="h-4 w-4" />
                                Report an Item
                            </a>

                        </div>

                    </div>

                    {/* Hero Image */}
                    <div className="fb-fade-up fb-delay-2 relative">

                        <div className="absolute -left-12 -top-12 h-80 w-80 rounded-full bg-emerald-100/70 dark:bg-emerald-900/30 blur-3xl" />

                        <div className="relative overflow-hidden rounded-l-[45%] rounded-r-2xl border-l-[12px] border-emerald-700 dark:border-emerald-600 shadow-xl">

                            <img
                                src="/images/campus-gate.jpg"
                                alt="ASTU University Campus Gate"
                                className="h-[350px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[420px]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 dark:from-black/40 to-transparent" />

                        </div>

                        {/* Floating Message */}
                        <div className="fb-float absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white dark:border-[#2A2D35] bg-white/95 dark:bg-[#181A20]/95 p-4 shadow-xl backdrop-blur-md sm:bottom-8 sm:left-8">

                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-2 text-emerald-900 dark:text-emerald-300">
                                <Heart className="h-4 w-4" />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Help it find its owner.
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Together, we help our community.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= HOW IT WORKS STRIP ================= */}

                <section
                    id="how"
                    className="mx-auto mb-10 max-w-7xl px-6"
                >

                    <div className="glass-panel grid grid-cols-1 gap-6 rounded-2xl bg-[#edf4ee]/85 dark:bg-[#181A20]/80 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3.5">

                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="fb-fade-up group flex items-center gap-3"
                                >

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-800 dark:bg-emerald-700 text-white shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-emerald-950 dark:group-hover:bg-emerald-600">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                                            {step.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                            {step.description}
                                        </p>
                                    </div>

                                    {index !== steps.length - 1 && (
                                        <ArrowRight className="ml-auto hidden h-4 w-4 shrink-0 text-emerald-800/70 dark:text-emerald-400 lg:block" />
                                    )}

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* ================= RECENT ITEMS ================= */}

                <section
                    id="recent-items"
                    className="mx-auto mb-20 max-w-7xl px-6"
                >

                    {/* Section Heading */}
                    <div className="mb-7 flex items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1.5 rounded-full bg-emerald-800 dark:bg-emerald-500" />

                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950 dark:text-white">
                                    Recent Items
                                </h2>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Recently reported items at ASTU.
                                </p>
                            </div>
                        </div>

                        <a
                            href="/found-items"
                            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-800/20 dark:border-[#2A2D35] bg-emerald-50/60 dark:bg-[#181A20] px-3.5 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-300 transition hover:bg-emerald-100 dark:hover:bg-emerald-950/60 sm:text-sm"
                        >
                            <span className="hidden sm:inline">View All Items</span>
                            <span className="sm:hidden">View All</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>

                    </div>

                    {/* Search Field */}
                    <div className="glass-card mb-6 flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition focus-within:border-emerald-800 dark:focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-800/15">

                        <Search className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search items by name, category, brand or location..."
                            className="w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300"
                            >
                                Clear
                            </button>
                        )}

                    </div>

                    {/* Item Cards */}
                    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {filteredItems.map((item, index) => (

                            <article
                                key={item.id}
                                className={`fb-fade-up group overflow-hidden rounded-xl glass-card transition duration-300 hover:-translate-y-1 hover:shadow-2xl fb-delay-${index + 1}`}
                            >

                                {/* Item Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Category Badge */}
                                    <span className="absolute right-3 top-3 rounded-full border border-white/70 dark:border-[#2A2D35] bg-emerald-100/95 dark:bg-[#181A20]/95 px-3 py-2 text-[11px] font-semibold text-emerald-950 dark:text-emerald-300 shadow-sm">
                                        {item.category}
                                    </span>

                                    {/* Status Badge */}
                                    <span
                                        className={`absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm ${getStatusStyle(item.status)}`}
                                    >
                                        {item.status}
                                    </span>

                                </div>

                                {/* Item Summary */}
                                <div className="p-4">

                                    <h3 className="mb-3 text-sm font-bold text-gray-950 dark:text-white">
                                        {item.name}
                                    </h3>

                                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <MapPin className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                        {item.location}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <CalendarDays className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                        {formatDisplayDate(item.date)}
                                    </div>

                                    {/* View Details Button */}
                                    <button
                                        onClick={() => toggleItemDetails(item.id)}
                                        aria-expanded={expandedItemId === item.id}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-800/30 dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-400 transition duration-300 hover:bg-emerald-900 hover:text-white dark:hover:bg-emerald-700"
                                    >
                                        <Eye className="h-4 w-4" />

                                        {expandedItemId === item.id
                                            ? 'Hide Details'
                                            : 'View Details'}

                                        {expandedItemId === item.id ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}

                                    </button>

                                </div>

                                {/* ================= EXPANDABLE ITEM DETAILS ================= */}

                                {expandedItemId === item.id && (

                                    <div className="border-t border-gray-200 dark:border-[#2A2D35] bg-[#f7faf7] dark:bg-[#181A20] p-4">

                                        <h4 className="mb-4 text-sm font-bold text-emerald-950 dark:text-emerald-400">
                                            Item Information
                                        </h4>

                                        <div className="space-y-3 text-xs">

                                            <div className="flex items-start gap-2">
                                                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Item Name
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Item Category
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.category}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Brand / Manufacturer
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.brand || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Palette className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Color
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.color || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Description
                                                    </p>
                                                    <p className="mt-1 leading-relaxed text-gray-900 dark:text-white">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Lost / Found Location
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Lost / Found Date
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                                        {item.date}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                                                        Item Status
                                                    </p>

                                                    <span
                                                        className={`mt-1 inline-block rounded-full px-3 py-1 font-bold ${getStatusStyle(item.status)}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Privacy Notice */}
                                        <div className="mt-4 rounded-lg border border-emerald-900/10 dark:border-[#2A2D35] bg-emerald-50 dark:bg-[#1E2028] p-3">

                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 dark:text-emerald-300">
                                                <Shield className="h-4 w-4" />
                                                Private Identifying Information
                                            </div>

                                            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                                Additional identifying information is kept private.
                                                It is used during ownership verification and is only
                                                available to authorized administrators.
                                            </p>

                                        </div>

                                        {/* Claim Request: Found Items Only */}
                                        {item.status === 'Found' && (

                                            <button
                                                onClick={() => handleClaimRequest(item)}
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 dark:bg-emerald-700 hover:dark:bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-300 hover:bg-emerald-950 hover:shadow-md"
                                            >
                                                <Handshake className="h-4 w-4" />
                                                Send Claim Request
                                            </button>

                                        )}

                                        {/* Lost Item Message */}
                                        {item.status === 'Lost' && (
                                            <p className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-transparent dark:border-red-900/30 p-3 text-xs leading-relaxed text-red-700 dark:text-red-300">
                                                This item has been reported as lost. You can check
                                                the found items section for possible matches.
                                            </p>
                                        )}

                                        {/* Claimed Item Message */}
                                        {item.status === 'Claimed' && (
                                            <p className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-transparent dark:border-amber-900/30 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                                                This item has already been claimed and is awaiting
                                                or has completed the recovery process.
                                            </p>
                                        )}

                                    </div>

                                )}

                            </article>

                        ))}

                    </div>

                    {/* No Results */}
                    {filteredItems.length === 0 && (

                        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-[#2A2D35] py-16 text-center">

                            <Search className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />

                            <h3 className="font-bold text-gray-800 dark:text-gray-200">
                                No items found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Try searching with another item name or keyword.
                            </p>

                        </div>

                    )}

                </section>

                {/* ================= PRIVACY SECTION ================= */}

                <section className="mx-auto mb-20 max-w-7xl px-6">

                    <div className="glass-panel flex flex-col gap-5 rounded-2xl bg-[#edf4ee]/80 dark:bg-[#181A20]/80 p-6 sm:flex-row sm:items-center sm:p-8">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
                                Your information stays protected.
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                Ownership evidence, private identifying information and
                                personal contact details are not displayed in public item
                                reports. Authorized administrators review ownership claims
                                before an item is returned.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

            {/* ================= FOOTER ================= */}
            <Footer />

        </div>
    );
}
