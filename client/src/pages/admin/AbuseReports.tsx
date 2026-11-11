import { useState } from "react";
import { Search, Eye, Check, X, Flag, Trash2, Filter, AlertTriangle, UserX, ShieldCheck } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

interface AbuseReport {
    id: string;
    abuser: {
        name: string;
        studentId: string;
        email: string;
        role: string;
    };
    reporter: {
        name: string;
        studentId: string;
        email: string;
    };
    target: string;
    reason: string;
    details: string;
    date: string;
    status: "Pending" | "Under Review" | "Resolved" | "Dismissed";
}

const initialReports: AbuseReport[] = [
    {
        id: "REP-001",
        abuser: {
            name: "Dawit Tadesse",
            studentId: "UGR/13890/14",
            email: "dawit@gmail.com",
            role: "student",
        },
        reporter: {
            name: "Abebe Kebede",
            studentId: "UGR/12045/14",
            email: "abebe@gmail.com",
        },
        target: "Lost Report #LOST-104 (HP Laptop)",
        reason: "False Information / Fake Report",
        details: "User claimed serial number CN482910 belongs to him, but actual owner verified physical ownership with receipt.",
        date: "Nov 08, 2026",
        status: "Pending",
    },
    {
        id: "REP-002",
        abuser: {
            name: "Kalkidan Yilma",
            studentId: "UGR/16201/15",
            email: "kalkidan@gmail.com",
            role: "student",
        },
        reporter: {
            name: "Sara Ahmed",
            studentId: "UGR/14290/15",
            email: "sara@gmail.com",
        },
        target: "Found Item #FOUND-042 (Samsung Galaxy)",
        reason: "Spam Claim Submissions",
        details: "Submitted 6 repetitive fraudulent claims within 10 minutes with fabricated descriptions.",
        date: "Nov 07, 2026",
        status: "Under Review",
    },
    {
        id: "REP-003",
        abuser: {
            name: "Yared Haile",
            studentId: "UGR/17894/16",
            email: "yared@gmail.com",
            role: "student",
        },
        reporter: {
            name: "Hana Ali",
            studentId: "UGR/11094/14",
            email: "hana@gmail.com",
        },
        target: "Report: Bag with books",
        reason: "Inappropriate Content / Language",
        details: "Used offensive and threatening remarks in the private verification description.",
        date: "Nov 06, 2026",
        status: "Resolved",
    },
    {
        id: "REP-004",
        abuser: {
            name: "Binyam Worku",
            studentId: "UGR/14980/15",
            email: "binyam@gmail.com",
            role: "student",
        },
        reporter: {
            name: "Meron Bekele",
            studentId: "UGR/15520/15",
            email: "meron@gmail.com",
        },
        target: "Claim: iPhone 13 Pro",
        reason: "Impersonation Attempt",
        details: "Attempted to pose as faculty member to collect high-value device.",
        date: "Nov 05, 2026",
        status: "Dismissed",
    },
];

export default function AbuseReports() {
    const [reports, setReports] = useState<AbuseReport[]>(() => {
        const saved = localStorage.getItem("findback_admin_abuse_reports_v2");
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
            localStorage.setItem("findback_admin_abuse_reports_v2", JSON.stringify(updated));
            return updated;
        });
        notify(`Report ${id} marked as ${status}.`);
    };

    const deleteReport = (id: string) => {
        if (!confirm("Are you sure you want to delete this report record?")) return;
        setReports((old) => {
            const updated = old.filter((r) => r.id !== id);
            localStorage.setItem("findback_admin_abuse_reports_v2", JSON.stringify(updated));
            return updated;
        });
        notify(`Report ${id} deleted.`);
    };

    const filtered = reports.filter((report) => {
        const matchesFilter = statusFilter === "All" || report.status === statusFilter;
        const matchesSearch = `${report.id} ${report.abuser.name} ${report.abuser.studentId} ${report.abuser.email} ${report.reporter.name} ${report.target} ${report.reason}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const badgeClass = (status: AbuseReport["status"]) => {
        switch (status) {
            case "Resolved":
                return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300";
            case "Under Review":
                return "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300";
            case "Dismissed":
                return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
            default:
                return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300";
        }
    };

    return (
        <AdminLayout title="Abuse Reports" subtitle="Fraud & Spam Prevention">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Abuse Reports</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Investigate reports of false claims, misleading submissions, and policy violations.
                        </p>
                    </div>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <div className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Incidents</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{reports.length}</h2>
                    </div>
                    <div className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Pending Review</p>
                        <h2 className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {reports.filter((r) => r.status === "Pending").length}
                        </h2>
                    </div>
                    <div className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Under Investigation</p>
                        <h2 className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {reports.filter((r) => r.status === "Under Review").length}
                        </h2>
                    </div>
                    <div className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Resolved</p>
                        <h2 className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {reports.filter((r) => r.status === "Resolved").length}
                        </h2>
                    </div>
                </div>

                {/* Table Container */}
                <div className="glass-panel overflow-hidden rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 transition-colors">
                    <div className="flex flex-col gap-3 border-b border-[#E2E8F0] dark:border-[#2A2D35] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                            <Flag size={18} className="text-rose-500" /> Reported Abusers & Incidents
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search abuser, ID or reason..."
                                    className="w-full bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none sm:w-56 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Filter size={15} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none"
                                >
                                    <option value="All" className="dark:bg-[#181A20]">All Status</option>
                                    <option value="Pending" className="dark:bg-[#181A20]">Pending</option>
                                    <option value="Under Review" className="dark:bg-[#181A20]">Under Review</option>
                                    <option value="Resolved" className="dark:bg-[#181A20]">Resolved</option>
                                    <option value="Dismissed" className="dark:bg-[#181A20]">Dismissed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] text-left text-sm">
                            <thead className="bg-slate-50/70 dark:bg-[#0D0E12]/60 text-xs uppercase text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                                <tr>
                                    <th className="px-5 py-4">Report ID</th>
                                    <th className="px-5 py-4">Abuser (Accused)</th>
                                    <th className="px-5 py-4">Reported By</th>
                                    <th className="px-5 py-4">Targeted Entity</th>
                                    <th className="px-5 py-4">Violation Reason</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2D35]">
                                {filtered.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50/60 dark:hover:bg-[#2A2D35]/30 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-[#111827] dark:text-[#F3F4F6] font-mono text-xs">
                                            {report.id}
                                        </td>
                                        {/* ABUSER COLUMN: Clearly Identified */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                                                    <UserX size={15} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-rose-600 dark:text-rose-400">
                                                        {report.abuser.name}
                                                    </p>
                                                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                                                        {report.abuser.studentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* REPORTER COLUMN */}
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-[#111827] dark:text-[#F3F4F6] text-xs">
                                                {report.reporter.name}
                                            </p>
                                            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                                                {report.reporter.studentId}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-medium text-[#111827] dark:text-[#F3F4F6] max-w-xs">
                                            {report.target}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                            <span className="rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 font-medium border border-amber-200/50 dark:border-amber-800/30">
                                                {report.reason}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] text-xs whitespace-nowrap">
                                            {report.date}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-1">
                                                <button
                                                    title="View investigation details"
                                                    onClick={() => setSelectedReport(report)}
                                                    className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {report.status !== "Resolved" && (
                                                    <button
                                                        title="Resolve report"
                                                        onClick={() => updateStatus(report.id, "Resolved")}
                                                        className="rounded-lg p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                {report.status !== "Dismissed" && (
                                                    <button
                                                        title="Dismiss report"
                                                        onClick={() => updateStatus(report.id, "Dismissed")}
                                                        className="rounded-lg p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    title="Delete report"
                                                    onClick={() => deleteReport(report.id)}
                                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-10 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                                            No abuse reports match your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* INVESTIGATION DETAILS MODAL */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4">
                        <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                                        <AlertTriangle size={18} className="text-rose-500" />
                                        Abuse Investigation ({selectedReport.id})
                                    </h2>
                                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                                        Submitted on {selectedReport.date}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2A2D35]"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Clear distinction: Abuser vs Reporter Cards */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {/* Abuser Info */}
                                    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 p-3.5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold uppercase text-[10px] tracking-wider">
                                            <UserX size={13} />
                                            Accused Abuser
                                        </div>
                                        <p className="text-sm font-bold text-rose-900 dark:text-rose-200">
                                            {selectedReport.abuser.name}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400 font-mono">
                                            ID: {selectedReport.abuser.studentId}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Email: {selectedReport.abuser.email}
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-500 capitalize">
                                            Role: {selectedReport.abuser.role}
                                        </p>
                                    </div>

                                    {/* Reporter Info */}
                                    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-3.5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold uppercase text-[10px] tracking-wider">
                                            <ShieldCheck size={13} />
                                            Reporting User
                                        </div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                                            {selectedReport.reporter.name}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400 font-mono">
                                            ID: {selectedReport.reporter.studentId}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Email: {selectedReport.reporter.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-slate-50 dark:bg-[#0D0E12] p-4 space-y-2">
                                    <div>
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Target Entity:</span>
                                        <p className="font-medium text-[#111827] dark:text-[#F3F4F6] mt-0.5">{selectedReport.target}</p>
                                    </div>
                                    <div>
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Violation Reason:</span>
                                        <p className="font-medium text-[#111827] dark:text-[#F3F4F6] mt-0.5">{selectedReport.reason}</p>
                                    </div>
                                    <div>
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Investigation Evidence & Details:</span>
                                        <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-3 rounded-xl">
                                            {selectedReport.details}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[#6B7280] dark:text-[#9CA3AF]">Status:</span>
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
                                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                                >
                                    Resolve Report
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] py-2.5 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors"
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
