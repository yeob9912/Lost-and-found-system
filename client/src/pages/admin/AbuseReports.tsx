import { useState } from "react";
import { Search, Eye, Check, X, Flag, Trash2, Filter } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

interface AbuseReport {
    id: string;
    reporter: string;
    target: string;
    reason: string;
    details: string;
    date: string;
    status: "Pending" | "Under Review" | "Resolved" | "Dismissed";
}

const initialReports: AbuseReport[] = [
    {
        id: "REP-001",
        reporter: "Abebe Kebede (UGR/12045/14)",
        target: "Report: HP Laptop (Lost Item #104)",
        reason: "False Information / Fake Report",
        details: "The serial number provided belongs to another student who is currently using the machine.",
        date: "Nov 08, 2026",
        status: "Pending",
    },
    {
        id: "REP-002",
        reporter: "Sara Ahmed (UGR/14290/15)",
        target: "User: Dawit Tadesse",
        reason: "Suspicious Activity",
        details: "Multiple false claim attempts on high-value electronics without verification proof.",
        date: "Nov 07, 2026",
        status: "Under Review",
    },
    {
        id: "REP-003",
        reporter: "Hana Ali (UGR/11094/14)",
        target: "Report: Bag with books",
        reason: "Inappropriate Content",
        details: "Offensive language inside the item description field.",
        date: "Nov 06, 2026",
        status: "Resolved",
    },
    {
        id: "REP-004",
        reporter: "Meron Bekele (UGR/15520/15)",
        target: "Claim: iPhone 13 Pro",
        reason: "Spam Claim",
        details: "Identical claim message submitted repeatedly under different names.",
        date: "Nov 05, 2026",
        status: "Dismissed",
    },
];

export default function AbuseReports() {
    const [reports, setReports] = useState<AbuseReport[]>(() => {
        const saved = localStorage.getItem("findback_admin_abuse_reports");
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignore */ }
        }
        return initialReports;
    });

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null);
    const [actionMsg, setActionMsg] = useState("");

    const notify = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const updateStatus = (id: string, status: AbuseReport["status"]) => {
        setReports((old) => {
            const updated = old.map((r) => (r.id === id ? { ...r, status } : r));
            localStorage.setItem("findback_admin_abuse_reports", JSON.stringify(updated));
            return updated;
        });
        notify(`Report ${id} marked as ${status}.`);
    };

    const deleteReport = (id: string) => {
        if (!confirm("Are you sure you want to delete this report?")) return;
        setReports((old) => {
            const updated = old.filter((r) => r.id !== id);
            localStorage.setItem("findback_admin_abuse_reports", JSON.stringify(updated));
            return updated;
        });
        notify(`Report ${id} deleted.`);
    };

    const filtered = reports.filter((report) => {
        const matchesFilter = statusFilter === "All" || report.status === statusFilter;
        const matchesSearch = `${report.id} ${report.reporter} ${report.target} ${report.reason}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const badgeClass = (status: AbuseReport["status"]) => {
        switch (status) {
            case "Resolved":
                return "bg-emerald-100 text-emerald-700";
            case "Under Review":
                return "bg-purple-100 text-purple-700";
            case "Dismissed":
                return "bg-slate-100 text-slate-600";
            default:
                return "bg-amber-100 text-amber-700";
        }
    };

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Abuse Reports</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review reports about suspicious activities, fake posts, and inappropriate conduct.
                        </p>
                    </div>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Reports</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-600">{reports.length}</h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Pending Review</p>
                        <h2 className="mt-2 text-2xl font-bold text-amber-600">
                            {reports.filter((r) => r.status === "Pending").length}
                        </h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Under Review</p>
                        <h2 className="mt-2 text-2xl font-bold text-purple-600">
                            {reports.filter((r) => r.status === "Under Review").length}
                        </h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Resolved</p>
                        <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                            {reports.filter((r) => r.status === "Resolved").length}
                        </h2>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Flag size={18} className="text-rose-500" /> Reported Incidents
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Search size={16} className="text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by ID, reporter, or reason..."
                                    className="w-full bg-transparent py-2 text-sm outline-none sm:w-56"
                                />
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Filter size={15} className="text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm outline-none"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Dismissed">Dismissed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                <tr>
                                    <th className="px-5 py-4">Report ID</th>
                                    <th className="px-5 py-4">Reporter</th>
                                    <th className="px-5 py-4">Targeted Entity</th>
                                    <th className="px-5 py-4">Reason</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-slate-800">{report.id}</td>
                                        <td className="px-5 py-4 text-slate-600">{report.reporter}</td>
                                        <td className="px-5 py-4 font-medium text-slate-800">{report.target}</td>
                                        <td className="px-5 py-4 text-slate-600">{report.reason}</td>
                                        <td className="px-5 py-4 text-slate-500 text-xs">{report.date}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-1">
                                                <button
                                                    title="View details"
                                                    onClick={() => setSelectedReport(report)}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {report.status !== "Resolved" && (
                                                    <button
                                                        title="Resolve report"
                                                        onClick={() => updateStatus(report.id, "Resolved")}
                                                        className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                {report.status !== "Dismissed" && (
                                                    <button
                                                        title="Dismiss report"
                                                        onClick={() => updateStatus(report.id, "Dismissed")}
                                                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    title="Delete report"
                                                    onClick={() => deleteReport(report.id)}
                                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-10 text-center text-slate-500">
                                            No abuse reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Report Details ({selectedReport.id})
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Submitted on {selectedReport.date}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="border-b pb-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Reporter</p>
                                    <p className="font-medium text-slate-800 mt-0.5">{selectedReport.reporter}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Target Item / Account</p>
                                    <p className="font-medium text-slate-800 mt-0.5">{selectedReport.target}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Reason</p>
                                    <p className="font-medium text-slate-800 mt-0.5">{selectedReport.reason}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Detailed Description</p>
                                    <p className="text-slate-700 mt-1 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl">
                                        {selectedReport.details}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs text-slate-500">Current Status:</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(selectedReport.status)}`}>
                                        {selectedReport.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <button
                                    onClick={() => {
                                        updateStatus(selectedReport.id, "Resolved");
                                        setSelectedReport(null);
                                    }}
                                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                                >
                                    Mark Resolved
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
