
import { useMemo, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import {
    Search,
    Filter,
    Clock3,
    CheckCircle2,
    XCircle,
    Eye,
    CalendarDays,
    MapPin,
    Package,
    FileText,
    AlertCircle,
    ArrowUpRight,
    X,
} from "lucide-react";

type ReportType = "Lost" | "Found";
type ReportStatus = "Pending" | "Approved" | "Resolved" | "Rejected";

interface Report {
    id: number;
    itemName: string;
    type: ReportType;
    category: string;
    description: string;
    image: string;
    location: string;
    submittedDate: string;
    status: ReportStatus;
}

const sampleReports: Report[] = [
    {
        id: 1,
        itemName: "HP Laptop",
        type: "Lost",
        category: "Electronics",
        description:
            "I lost my HP laptop with a silver body and black keyboard around the university library.",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
        location: "ASTU Library",
        submittedDate: "October 28, 2026",
        status: "Pending",
    },
    {
        id: 2,
        itemName: "Student ID Card",
        type: "Found",
        category: "Personal Documents",
        description:
            "I found an ASTU student ID card near the main cafeteria.",
        image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
        location: "Main Cafeteria",
        submittedDate: "October 24, 2026",
        status: "Approved",
    },
    {
        id: 3,
        itemName: "Black Backpack",
        type: "Lost",
        category: "Bags",
        description:
            "I lost my black backpack containing some notebooks and personal belongings.",
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        location: "Computer Science Building",
        submittedDate: "October 20, 2026",
        status: "Resolved",
    },
    {
        id: 4,
        itemName: "Wireless Headphones",
        type: "Found",
        category: "Electronics",
        description:
            "I found wireless headphones inside one of the university classrooms.",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        location: "Classroom Building",
        submittedDate: "October 15, 2026",
        status: "Rejected",
    },
];

const statusStyles: Record<ReportStatus, string> = {
    Pending: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800",
    Approved: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800",
    Resolved: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 ring-blue-200 dark:ring-blue-800",
    Rejected: "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 ring-red-200 dark:ring-red-800",
};

const StatusBadge = ({ status }: { status: ReportStatus }) => {
    const icons = {
        Pending: <Clock3 size={13} />,
        Approved: <CheckCircle2 size={13} />,
        Resolved: <CheckCircle2 size={13} />,
        Rejected: <XCircle size={13} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
        >
            {icons[status]}
            {status}
        </span>
    );
};

const TypeBadge = ({ type }: { type: ReportType }) => (
    <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${type === "Lost"
                ? "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400"
                : "bg-[#E9F0E6] dark:bg-emerald-950/60 text-[#2D5A46] dark:text-emerald-400"
            }`}
    >
        {type === "Lost" ? "Lost Item" : "Found Item"}
    </span>
);

const MyReports = () => {
    const [reports] = useState<Report[]>(sampleReports);
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const statistics = [
        {
            label: "Total Reports",
            value: reports.length,
            icon: <FileText size={19} />,
            color: "bg-[#E9F0E6] text-[#2D5A46]",
        },
        {
            label: "Lost Items",
            value: reports.filter((r) => r.type === "Lost").length,
            icon: <AlertCircle size={19} />,
            color: "bg-orange-50 text-orange-600",
        },
        {
            label: "Found Items",
            value: reports.filter((r) => r.type === "Found").length,
            icon: <Package size={19} />,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Pending Review",
            value: reports.filter((r) => r.status === "Pending").length,
            icon: <Clock3 size={19} />,
            color: "bg-amber-50 text-amber-600",
        },
    ];

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchesStatus =
                activeFilter === "All" || report.status === activeFilter;

            const matchesType =
                activeType === "All" || report.type === activeType;

            const search = searchTerm.toLowerCase();

            const matchesSearch =
                report.itemName.toLowerCase().includes(search) ||
                report.category.toLowerCase().includes(search) ||
                report.location.toLowerCase().includes(search);

            return matchesStatus && matchesType && matchesSearch;
        });
    }, [reports, activeFilter, activeType, searchTerm]);

    return (
        <div className="min-h-screen bg-[#F4F6F0]/85 dark:bg-[#0D0E12]/85 flex flex-col transition-colors">
            <Navbar />
            <div className="flex-1 px-4 py-7 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-[fadeUp_.5s_ease-out]">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#789080] dark:text-[#9CA3AF]">
                            <span>Student Portal</span>
                            <span className="h-1 w-1 rounded-full bg-[#A5B7A8] dark:bg-[#4B5563]" />
                            <span>My Activities</span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#1A362B] dark:text-[#F3F4F6] sm:text-3xl">
                            My Reports
                        </h1>

                        <p className="mt-1.5 text-sm text-[#718276] dark:text-[#9CA3AF]">
                            Keep track of the items you have reported.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-[#DDE7D9] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-3.5 py-2.5 shadow-sm">
                        <FileText size={17} className="text-[#2D5A46] dark:text-emerald-400" />
                        <span className="text-sm font-medium text-[#40594A] dark:text-[#9CA3AF]">
                            {reports.length} Total Reports
                        </span>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {statistics.map((stat, index) => (
                        <div
                            key={stat.label}
                            style={{ animationDelay: `${index * 90}ms` }}
                            className="group glass-card rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[fadeUp_.5s_ease-out_both]"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-[#718276] dark:text-[#9CA3AF] sm:text-sm">
                                    {stat.label}
                                </p>

                                <div className={`rounded-xl p-2 ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <h2 className="mt-3 text-2xl font-bold text-[#1A362B] dark:text-[#F3F4F6]">
                                {stat.value}
                            </h2>

                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#F0F3ED] dark:bg-[#2A2D35]">
                                <div
                                    className="h-full rounded-full bg-[#789D7E] dark:bg-emerald-600 transition-all duration-700"
                                    style={{
                                        width: `${reports.length ? (stat.value / reports.length) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Reports Container */}
                <div className="glass-panel overflow-hidden rounded-2xl shadow-xl">

                    {/* Search and Filters */}
                    <div className="border-b border-[#EDF0EA] dark:border-[#2A2D35] p-4 sm:p-5">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-base font-bold text-[#1A362B] dark:text-[#F3F4F6]">
                                    Submitted Reports
                                </h2>
                                <p className="mt-1 text-xs text-[#849187] dark:text-[#9CA3AF]">
                                    View and track your lost and found reports.
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-xs">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849187] dark:text-[#6B7280]"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search reports..."
                                    className="w-full rounded-xl border border-[#E2E9DF] dark:border-[#2A2D35] bg-[#FAFBF8] dark:bg-[#181A20] py-2.5 pl-9 pr-3 text-sm text-[#1A362B] dark:text-[#F3F4F6] outline-none transition-all duration-200 placeholder:text-[#A0ACA1] dark:placeholder:text-[#6B7280] focus:border-[#789D7E] dark:focus:border-emerald-600 focus:bg-white dark:focus:bg-[#1E2028] focus:ring-4 focus:ring-[#2D5A46]/10 dark:focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mt-5 flex flex-col gap-4">

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold text-[#849187] dark:text-[#9CA3AF]">
                                    <Package size={14} />
                                    TYPE
                                </span>

                                {["All", "Lost", "Found"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveType(type)}
                                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${activeType === type
                                                ? "bg-[#2D5A46] dark:bg-emerald-700 text-white shadow-sm"
                                                : "bg-[#F4F6F0] dark:bg-[#1E2028] text-[#718276] dark:text-[#9CA3AF] hover:bg-[#E5EDE1] dark:hover:bg-[#2A2D35] hover:text-[#2D5A46] dark:hover:text-emerald-400"
                                            }`}
                                    >
                                        {type === "All"
                                            ? "All Reports"
                                            : type === "Lost"
                                                ? "Lost Items"
                                                : "Found Items"}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold text-[#849187] dark:text-[#9CA3AF]">
                                    <Filter size={14} />
                                    STATUS
                                </span>

                                {["All", "Pending", "Approved", "Resolved", "Rejected"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() => setActiveFilter(status)}
                                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${activeFilter === status
                                                    ? "bg-[#E2EBDF] dark:bg-emerald-950/60 text-[#2D5A46] dark:text-emerald-400 ring-1 ring-[#C8D8C5] dark:ring-emerald-800"
                                                    : "text-[#849187] dark:text-[#9CA3AF] hover:bg-[#F4F6F0] dark:hover:bg-[#1E2028] hover:text-[#2D5A46] dark:hover:text-emerald-400"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between border-b border-[#F0F2ED] dark:border-[#2A2D35] bg-[#FCFDFB] dark:bg-[#181A20]/60 px-4 py-3 sm:px-5">
                        <p className="text-xs text-[#849187] dark:text-[#9CA3AF]">
                            Showing{" "}
                            <span className="font-semibold text-[#40594A] dark:text-emerald-400">
                                {filteredReports.length}
                            </span>{" "}
                            of {reports.length} reports
                        </p>
                    </div>

                    {/* Report Cards */}
                    <div className="space-y-3 p-4 sm:p-5">

                        {filteredReports.length > 0 ? (
                            filteredReports.map((report, index) => (
                                <div
                                    key={report.id}
                                    style={{ animationDelay: `${index * 80}ms` }}
                                    className="group flex flex-col gap-4 rounded-xl border border-[#E9EEE6] dark:border-[#2A2D35] bg-white dark:bg-[#181A20]/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B9CDBB] dark:hover:border-emerald-800 hover:bg-[#FCFDFB] dark:hover:bg-[#1E2028] hover:shadow-md sm:flex-row sm:items-center sm:p-4 animate-[fadeUp_.45s_ease-out_both]"
                                >
                                    {/* Item Image */}
                                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-[#F4F6F0] dark:bg-[#2A2D35] sm:h-28 sm:w-32">
                                        <img
                                            src={report.image}
                                            alt={report.itemName}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        <div className="absolute left-2 top-2">
                                            <TypeBadge type={report.type} />
                                        </div>
                                    </div>

                                    {/* Information */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <h3 className="font-bold text-[#1A362B] dark:text-[#F3F4F6] transition-colors group-hover:text-[#2D5A46] dark:group-hover:text-emerald-400">
                                                    {report.itemName}
                                                </h3>
                                                <p className="mt-0.5 text-xs text-[#849187] dark:text-[#9CA3AF]">
                                                    {report.category}
                                                </p>
                                            </div>

                                            <StatusBadge status={report.status} />
                                        </div>

                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#718276] dark:text-[#9CA3AF]">
                                            {report.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#849187] dark:text-[#6B7280]">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={13} />
                                                {report.location}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={13} />
                                                {report.submittedDate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Button */}
                                    <div className="flex shrink-0 items-center justify-end sm:self-center">
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#E9F0E6] dark:bg-emerald-950/60 px-3.5 py-2.5 text-xs font-semibold text-[#2D5A46] dark:text-emerald-400 transition-all duration-200 hover:bg-[#2D5A46] dark:hover:bg-emerald-700 hover:text-white active:scale-95"
                                        >
                                            <Eye size={15} />
                                            View Details
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-14 text-center animate-[fadeUp_.3s_ease-out]">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F0E6] dark:bg-emerald-950/60">
                                    <Package size={27} className="text-[#2D5A46] dark:text-emerald-400" />
                                </div>

                                <h3 className="font-bold text-[#1A362B] dark:text-[#F3F4F6]">
                                    No reports found
                                </h3>

                                <p className="mt-1 max-w-xs text-sm text-[#849187] dark:text-[#9CA3AF]">
                                    Try changing your search or filters to find your reports.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveFilter("All");
                                        setActiveType("All");
                                    }}
                                    className="mt-4 rounded-lg bg-[#2D5A46] dark:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1A362B] dark:hover:bg-emerald-800"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* Report Details Modal */}
            {selectedReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#10251D]/55 dark:bg-black/70 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
                    onClick={() => setSelectedReport(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-[#181A20] shadow-2xl animate-[modalIn_.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EDF0EA] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-5 py-4">
                            <div>
                                <h2 className="font-bold text-[#1A362B] dark:text-[#F3F4F6]">
                                    Report Details
                                </h2>
                                <p className="mt-0.5 text-xs text-[#849187] dark:text-[#9CA3AF]">
                                    Report #{selectedReport.id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedReport(null)}
                                className="rounded-lg bg-[#F4F6F0] dark:bg-[#2A2D35] p-2 text-[#718276] dark:text-[#9CA3AF] transition hover:bg-[#E5EDE1] dark:hover:bg-[#333740] hover:text-[#2D5A46] dark:hover:text-emerald-400"
                                aria-label="Close details"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5">
                            <div className="relative mb-5 overflow-hidden rounded-xl">
                                <img
                                    src={selectedReport.image}
                                    alt={selectedReport.itemName}
                                    className="h-52 w-full object-cover"
                                />

                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <TypeBadge type={selectedReport.type} />
                                    <StatusBadge status={selectedReport.status} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#1A362B] dark:text-[#F3F4F6]">
                                {selectedReport.itemName}
                            </h3>

                            <p className="mt-1 text-sm text-[#849187] dark:text-[#9CA3AF]">
                                {selectedReport.category}
                            </p>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#849187] dark:text-[#9CA3AF]">
                                        Description
                                    </p>
                                    <p className="text-sm leading-relaxed text-[#40594A] dark:text-[#D1D5DB]">
                                        {selectedReport.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-[#F4F6F0] dark:bg-[#2A2D35] p-3">
                                        <MapPin size={16} className="mb-2 text-[#2D5A46] dark:text-emerald-400" />
                                        <p className="text-xs text-[#849187] dark:text-[#9CA3AF]">Location</p>
                                        <p className="mt-1 text-sm font-semibold text-[#40594A] dark:text-[#F3F4F6]">
                                            {selectedReport.location}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#F4F6F0] dark:bg-[#2A2D35] p-3">
                                        <CalendarDays size={16} className="mb-2 text-[#2D5A46] dark:text-emerald-400" />
                                        <p className="text-xs text-[#849187] dark:text-[#9CA3AF]">Submitted Date</p>
                                        <p className="mt-1 text-sm font-semibold text-[#40594A] dark:text-[#F3F4F6]">
                                            {selectedReport.submittedDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#E5EAE2] dark:border-[#2A2D35] bg-[#FAFBF8] dark:bg-[#1E2028] p-4">
                                    <p className="text-sm font-semibold text-[#1A362B] dark:text-[#F3F4F6]">
                                        Report Status
                                    </p>

                                    <p className="mt-2 text-sm leading-relaxed text-[#718276] dark:text-[#9CA3AF]">
                                        {selectedReport.status === "Pending" &&
                                            "Your report is waiting for admin review. You will receive an update when its status changes."}

                                        {selectedReport.status === "Approved" &&
                                            "Your report has been approved. It can now be handled according to the system's publishing rules."}

                                        {selectedReport.status === "Resolved" &&
                                            "This report has been marked as resolved."}

                                        {selectedReport.status === "Rejected" &&
                                            "Your report was not approved. Contact the administration if you need further clarification."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-[#EDF0EA] dark:border-[#2A2D35] px-5 py-4">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="rounded-lg bg-[#2D5A46] dark:bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1A362B] dark:hover:bg-emerald-800 active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Animations */}
            <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
        </div>
    );
};

export default MyReports;
