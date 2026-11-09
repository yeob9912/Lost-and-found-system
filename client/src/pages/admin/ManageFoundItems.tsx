import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Check, X, RefreshCw, RotateCw } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    fetchAdminFoundItems,
    approveFoundItem,
    rejectFoundItem,
    confirmFoundReturn,
} from "../../services/adminService";

interface FoundItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    foundLocation?: string;
    location?: string;
    foundDate?: string;
    date?: string;
    approvalStatus: "pending" | "approved" | "rejected" | "returned";
    reportedBy?: { fullName: string; email: string; studentId: string };
    createdAt: string;
    image?: string;
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        rejected: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
        returned: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    };
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || "bg-slate-100 text-slate-600 dark:bg-[#2A2D35] dark:text-[#9CA3AF]"}`}>
            {status}
        </span>
    );
}

export default function ManageFoundItems() {
    const [items, setItems] = useState<FoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionMsg, setActionMsg] = useState("");
    const [rejectTarget, setRejectTarget] = useState<FoundItem | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [viewItem, setViewItem] = useState<FoundItem | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params: Record<string, string> = {};
            if (statusFilter !== "all") params.approvalStatus = statusFilter;
            const data = await fetchAdminFoundItems(params);
            setItems(data?.items || data?.foundItems || data?.data || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (!msg.toLowerCase().includes("access denied") && !msg.toLowerCase().includes("administrator")) {
                setError(msg || "Failed to load found items");
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    const notify = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const handleApprove = async (item: FoundItem) => {
        try {
            await approveFoundItem(item._id);
            notify(`"${item.title}" approved successfully.`);
            load();
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        try {
            await rejectFoundItem(rejectTarget._id, rejectReason || "Rejected by admin");
            notify(`"${rejectTarget.title}" rejected.`);
            setRejectTarget(null);
            setRejectReason("");
            load();
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const handleConfirmReturn = async (item: FoundItem) => {
        try {
            await confirmFoundReturn(item._id);
            notify(`"${item.title}" confirmed as returned.`);
            load();
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const filtered = items.filter((item) =>
        `${item.title} ${item.category} ${item.reportedBy?.fullName || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Found Items" subtitle="Inventory & Turn-ins">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Manage Found Items</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Review and approve found item submissions turned in across ASTU campus.
                        </p>
                    </div>
                    <button
                        onClick={load}
                        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-4 py-2.5 text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors shadow-xs cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} /> Refresh
                    </button>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total Found", value: items.length, color: "text-blue-600 dark:text-blue-400" },
                        { label: "Pending", value: items.filter(i => i.approvalStatus === "pending").length, color: "text-amber-600 dark:text-amber-400" },
                        { label: "Approved", value: items.filter(i => i.approvalStatus === "approved").length, color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Returned", value: items.filter(i => i.approvalStatus === "returned").length, color: "text-purple-600 dark:text-purple-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-colors">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] shadow-xs transition-colors">
                    <div className="flex flex-col gap-3 border-b border-[#E2E8F0] dark:border-[#2A2D35] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6]">Found Item Submissions</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search submissions..."
                                    className="w-full bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none sm:w-48 placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF]"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 py-2 text-sm outline-none bg-slate-50 dark:bg-[#0D0E12] text-[#111827] dark:text-[#F3F4F6]"
                            >
                                <option value="all" className="dark:bg-[#181A20]">All Status</option>
                                <option value="pending" className="dark:bg-[#181A20]">Pending</option>
                                <option value="approved" className="dark:bg-[#181A20]">Approved</option>
                                <option value="rejected" className="dark:bg-[#181A20]">Rejected</option>
                                <option value="returned" className="dark:bg-[#181A20]">Returned</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">Loading submissions…</div>
                        ) : (
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-[#0D0E12] text-xs uppercase text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                                    <tr>
                                        <th className="px-5 py-4">Item</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Turned in By</th>
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2D35]">
                                    {filtered.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-[#2A2D35]/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-[#111827] dark:text-[#F3F4F6]">{item.title}</p>
                                                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] line-clamp-1">{item.description}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF]">{item.category || "—"}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#111827] dark:text-[#F3F4F6]">{item.reportedBy?.fullName || "Anonymous"}</p>
                                                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{item.reportedBy?.studentId || ""}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] text-xs">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge status={item.approvalStatus} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button title="View" onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"><Eye size={16} /></button>
                                                    {item.approvalStatus === "pending" && (
                                                        <>
                                                            <button title="Approve" onClick={() => handleApprove(item)} className="rounded-lg p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"><Check size={16} /></button>
                                                            <button title="Reject" onClick={() => setRejectTarget(item)} className="rounded-lg p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"><X size={16} /></button>
                                                        </>
                                                    )}
                                                    {item.approvalStatus === "approved" && (
                                                        <button title="Mark returned" onClick={() => handleConfirmReturn(item)} className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"><RotateCw size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={6} className="p-10 text-center text-[#6B7280] dark:text-[#9CA3AF]">No found item submissions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View Modal */}
                {viewItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
                        <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">{viewItem.title}</h2>
                                <button onClick={() => setViewItem(null)} className="rounded-lg p-1 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#2A2D35] cursor-pointer"><X size={18} /></button>
                            </div>
                            {viewItem.image && (
                                <img src={viewItem.image} alt={viewItem.title} className="mb-4 w-full rounded-2xl object-cover h-48 border border-[#E2E8F0] dark:border-[#2A2D35]" />
                            )}
                            <div className="space-y-3 text-sm">
                                {[
                                    ["Category", viewItem.category || "—"],
                                    ["Found Location", viewItem.foundLocation || viewItem.location || "—"],
                                    ["Date Found", viewItem.foundDate || viewItem.date ? new Date(viewItem.foundDate || viewItem.date!).toLocaleDateString() : "—"],
                                    ["Status", viewItem.approvalStatus],
                                    ["Turned In By", viewItem.reportedBy?.fullName || "Anonymous"],
                                    ["Student ID", viewItem.reportedBy?.studentId || "—"],
                                    ["Email", viewItem.reportedBy?.email || "—"],
                                    ["Submitted", new Date(viewItem.createdAt).toLocaleString()],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-[#E2E8F0] dark:border-[#2A2D35] pb-2 last:border-0">
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">{k}</span>
                                        <span className="font-medium text-[#111827] dark:text-[#F3F4F6] text-right max-w-[60%]">{v}</span>
                                    </div>
                                ))}
                                <div className="border-b border-[#E2E8F0] dark:border-[#2A2D35] pb-2">
                                    <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-1">Description</p>
                                    <p className="text-[#111827] dark:text-[#F3F4F6] text-xs leading-5">{viewItem.description}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewItem(null)} className="mt-5 w-full rounded-xl bg-slate-100 dark:bg-[#2A2D35] py-2.5 text-sm font-semibold text-[#111827] dark:text-[#F3F4F6] hover:bg-slate-200 dark:hover:bg-[#2A2D35]/80 transition-colors cursor-pointer">Close</button>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {rejectTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
                        <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] mb-1">Reject Submission</h2>
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">Provide a reason for rejecting <strong>"{rejectTarget.title}"</strong>.</p>
                            <textarea
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection (optional)..."
                                className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#0D0E12] px-4 py-3 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-red-400 resize-none"
                                rows={3}
                            />
                            <div className="mt-4 flex gap-3">
                                <button onClick={handleReject} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer">Reject</button>
                                <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors cursor-pointer">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
