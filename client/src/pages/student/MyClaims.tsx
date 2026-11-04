
import { useState } from "react";
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    CalendarDays,
    MapPin,
    Package,
    FileText,
} from "lucide-react";

// Claim status type
type ClaimStatus = "Pending" | "Approved" | "Rejected";

// Claim information type
interface Claim {
    id: number;
    itemName: string;
    category: string;
    description: string;
    image: string;
    location: string;
    submittedDate: string;
    status: ClaimStatus;
    claimMessage: string;
}

// Sample claim data
// Later, replace this data with information from your backend API.
const sampleClaims: Claim[] = [
    {
        id: 1,
        itemName: "HP Laptop",
        category: "Electronics",
        description: "HP laptop with a silver body and black keyboard.",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
        location: "ASTU Library",
        submittedDate: "October 28, 2026",
        status: "Pending",
        claimMessage:
            "This laptop belongs to me. It has a small scratch near the left side of the keyboard.",
    },
    {
        id: 2,
        itemName: "Student ID Card",
        category: "Personal Documents",
        description: "ASTU student identification card.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
        location: "Main Cafeteria",
        submittedDate: "October 20, 2026",
        status: "Approved",
        claimMessage:
            "I lost my student ID card near the cafeteria. The details match my identification.",
    },
    {
        id: 3,
        itemName: "Black Backpack",
        category: "Bags",
        description: "Black backpack with several compartments.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        location: "Computer Science Building",
        submittedDate: "October 15, 2026",
        status: "Rejected",
        claimMessage:
            "I believe this is my backpack because it looks similar to the one I lost.",
    },
];

// Status badge component
const StatusBadge = ({ status }: { status: ClaimStatus }) => {
    const styles = {
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
        Approved: "bg-green-50 text-green-700 border-green-200",
        Rejected: "bg-red-50 text-red-700 border-red-200",
    };

    const icons = {
        Pending: <Clock size={14} />,
        Approved: <CheckCircle2 size={14} />,
        Rejected: <XCircle size={14} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${styles[status]}`}
        >
            {icons[status]}
            {status}
        </span>
    );
};

const MyClaims = () => {
    const [claims] = useState<Claim[]>(sampleClaims);

    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    // Count claims by status
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(
        (claim) => claim.status === "Pending"
    ).length;
    const approvedClaims = claims.filter(
        (claim) => claim.status === "Approved"
    ).length;
    const rejectedClaims = claims.filter(
        (claim) => claim.status === "Rejected"
    ).length;

    // Filter claims by status and search term
    const filteredClaims = claims.filter((claim) => {
        const matchesStatus =
            activeFilter === "All" || claim.status === activeFilter;

        const matchesSearch =
            claim.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F4F6F0] px-4 py-8 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Page Heading */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-[#E2EBDF] flex items-center justify-center">
                            <FileText className="text-[#2D5A46]" size={23} />
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A362B]">
                                My Claims
                            </h1>
                            <p className="text-sm text-[#718276] mt-1">
                                Manage and track your submitted item claims.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white rounded-2xl p-5 border border-[#E5EAE2] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[#718276] font-medium">
                                Total Claims
                            </span>
                            <div className="w-9 h-9 rounded-lg bg-[#E9F0E6] flex items-center justify-center">
                                <FileText size={19} className="text-[#2D5A46]" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A362B]">
                            {totalClaims}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-[#E5EAE2] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[#718276] font-medium">
                                Pending
                            </span>
                            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Clock size={19} className="text-amber-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A362B]">
                            {pendingClaims}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-[#E5EAE2] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[#718276] font-medium">
                                Approved
                            </span>
                            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                                <CheckCircle2 size={19} className="text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A362B]">
                            {approvedClaims}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-[#E5EAE2] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[#718276] font-medium">
                                Rejected
                            </span>
                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                                <XCircle size={19} className="text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#1A362B]">
                            {rejectedClaims}
                        </h2>
                    </div>

                </div>

                {/* Claims Section */}
                <div className="bg-white rounded-2xl border border-[#E5EAE2] shadow-sm overflow-hidden">

                    {/* Search and Filters */}
                    <div className="p-5 sm:p-6 border-b border-[#EDF0EA]">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            <div>
                                <h2 className="text-lg font-bold text-[#1A362B]">
                                    Submitted Claims
                                </h2>
                                <p className="text-sm text-[#849187] mt-1">
                                    View the status of your item ownership requests.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:w-80">
                                <Search
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849187]"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search your claims..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E9DF] bg-[#FAFBF8] text-sm text-[#1A362B] outline-none focus:border-[#2D5A46] focus:ring-2 focus:ring-[#2D5A46]/10 transition"
                                />
                            </div>

                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2 flex-wrap mt-6">
                            <Filter size={17} className="text-[#718276]" />

                            {["All", "Pending", "Approved", "Rejected"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter
                                            ? "bg-[#2D5A46] text-white shadow-sm"
                                            : "bg-[#F4F6F0] text-[#718276] hover:bg-[#E9F0E6] hover:text-[#2D5A46]"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* Claims List */}
                    <div className="p-5 sm:p-6">

                        {filteredClaims.length > 0 ? (
                            <div className="space-y-4">

                                {filteredClaims.map((claim) => (
                                    <div
                                        key={claim.id}
                                        className="border border-[#E9EEE6] rounded-2xl p-4 hover:border-[#B9CDBB] hover:shadow-sm transition-all"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4">

                                            {/* Item Image */}
                                            <img
                                                src={claim.image}
                                                alt={claim.itemName}
                                                className="w-full sm:w-36 h-44 sm:h-32 object-cover rounded-xl bg-[#F4F6F0]"
                                            />

                                            {/* Claim Information */}
                                            <div className="flex-1 min-w-0">

                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                                    <div>
                                                        <h3 className="text-lg font-bold text-[#1A362B]">
                                                            {claim.itemName}
                                                        </h3>

                                                        <p className="text-sm text-[#849187] mt-1">
                                                            {claim.category}
                                                        </p>
                                                    </div>

                                                    <StatusBadge status={claim.status} />

                                                </div>

                                                <p className="text-sm text-[#718276] mt-3 leading-relaxed">
                                                    {claim.description}
                                                </p>

                                                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-[#849187]">

                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} />
                                                        {claim.location}
                                                    </span>

                                                    <span className="flex items-center gap-1.5">
                                                        <CalendarDays size={14} />
                                                        {claim.submittedDate}
                                                    </span>

                                                </div>

                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        onClick={() => setSelectedClaim(claim)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E9F0E6] text-[#2D5A46] text-sm font-semibold hover:bg-[#DCE8D9] transition"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (

                            /* Empty State */
                            <div className="py-16 text-center">

                                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E9F0E6] flex items-center justify-center mb-4">
                                    <Package size={30} className="text-[#2D5A46]" />
                                </div>

                                <h3 className="text-lg font-bold text-[#1A362B]">
                                    No claims found
                                </h3>

                                <p className="text-sm text-[#849187] mt-2 max-w-sm mx-auto">
                                    {searchTerm
                                        ? "No claims match your search. Try another keyword."
                                        : "You have not submitted any claims with this status yet."}
                                </p>

                            </div>

                        )}

                    </div>
                </div>

            </div>

            {/* Claim Details Modal */}
            {selectedClaim && (
                <div
                    className="fixed inset-0 z-50 bg-[#10251D]/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedClaim(null)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDF0EA]">
                            <div>
                                <h2 className="text-lg font-bold text-[#1A362B]">
                                    Claim Details
                                </h2>
                                <p className="text-xs text-[#849187] mt-1">
                                    Claim #{selectedClaim.id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="w-9 h-9 rounded-full bg-[#F4F6F0] text-[#718276] hover:bg-[#E9F0E6] hover:text-[#2D5A46] transition text-xl"
                                aria-label="Close details"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">

                            <img
                                src={selectedClaim.image}
                                alt={selectedClaim.itemName}
                                className="w-full h-48 object-cover rounded-xl mb-5"
                            />

                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1A362B]">
                                        {selectedClaim.itemName}
                                    </h3>
                                    <p className="text-sm text-[#849187] mt-1">
                                        {selectedClaim.category}
                                    </p>
                                </div>

                                <StatusBadge status={selectedClaim.status} />
                            </div>

                            <div className="space-y-3 text-sm">

                                <div>
                                    <p className="text-xs font-semibold text-[#849187] mb-1">
                                        Item Description
                                    </p>
                                    <p className="text-[#40594A]">
                                        {selectedClaim.description}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-[#849187] mb-1">
                                        Your Claim Message
                                    </p>
                                    <p className="text-[#40594A] leading-relaxed">
                                        {selectedClaim.claimMessage}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-[#718276]">
                                    <MapPin size={16} />
                                    {selectedClaim.location}
                                </div>

                                <div className="flex items-center gap-2 text-[#718276]">
                                    <CalendarDays size={16} />
                                    Submitted: {selectedClaim.submittedDate}
                                </div>

                            </div>

                            {/* Status Information */}
                            <div className="mt-6 p-4 rounded-xl bg-[#F4F6F0]">
                                <p className="text-sm font-semibold text-[#1A362B] mb-1">
                                    Claim Status
                                </p>

                                <p className="text-sm text-[#718276]">
                                    {selectedClaim.status === "Pending" &&
                                        "Your claim is waiting for admin review. Please wait for an update."}

                                    {selectedClaim.status === "Approved" &&
                                        "Your claim has been approved. Please follow the instructions provided by the administration to collect your item."}

                                    {selectedClaim.status === "Rejected" &&
                                        "Your claim was not approved. Contact the administration if you need further clarification."}
                                </p>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-[#EDF0EA] flex justify-end">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="px-5 py-2.5 rounded-lg bg-[#2D5A46] text-white text-sm font-semibold hover:bg-[#1A362B] transition"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MyClaims;
