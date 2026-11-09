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
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
        returned: "bg-blue-100 text-blue-700",
    };
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || "bg-slate-100 text-slate-600"}`}>
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
            setItems(data.items || data.foundItems || data.data || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (!msg.toLowerCase().includes("access denied") && !msg.toLowerCase().includes("administrator")) {
                setError(msg || "Failed to load items");
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    const notify = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3000); };

    const handleApprove = async (item: FoundItem) => {
        try { await approveFoundItem(item._id); notify(`"${item.title}" approved.`); load(); }
        catch (err: unknown) { notify(err instanceof Error ? err.message : "Action failed"); }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        try { await rejectFoundItem(rejectTarget._id, rejectReason || "Rejected by admin"); notify(`"${rejectTarget.title}" rejected.`); setRejectTarget(null); setRejectReason(""); load(); }
        catch (err: unknown) { notify(err instanceof Error ? err.message : "Action failed"); }
    };

    const handleConfirmReturn = async (item: FoundItem) => {
        try { await confirmFoundReturn(item._id); notify(`"${item.title}" marked as returned.`); load(); }
        catch (err: unknown) { notify(err instanceof Error ? err.message : "Action failed"); }
    };

    const filtered = items.filter(item =>
        `${item.title} ${item.category} ${item.reportedBy?.fullName || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Found Items</h1>
                        <p className="mt-1 text-sm text-slate-500">Review found item reports before making them visible to users.</p>
                    </div>
                    <button onClick={load} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {actionMsg && <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">✓ {actionMsg}</div>}

                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total", value: items.length, color: "text-blue-600" },
                        { label: "Pending", value: items.filter(i => i.approvalStatus === "pending").length, color: "text-amber-600" },
                        { label: "Approved", value: items.filter(i => i.approvalStatus === "approved").length, color: "text-emerald-600" },
                        { label: "Returned", value: items.filter(i => i.approvalStatus === "returned").length, color: "text-blue-600" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-slate-800">Found Item Reports</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Search size={16} className="text-slate-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." className="w-full bg-transparent py-2 text-sm outline-none sm:w-48" />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm outline-none bg-slate-50">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="returned">Returned</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-slate-400">Loading reports…</div>
                        ) : (
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                    <tr>
                                        <th className="px-5 py-4">Item</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Found By</th>
                                        <th className="px-5 py-4">Location</th>
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map(item => (
                                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">{item.title}</p>
                                                <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">{item.category || "—"}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-700">{item.reportedBy?.fullName || "Unknown"}</p>
                                                <p className="text-xs text-slate-400">{item.reportedBy?.studentId || ""}</p>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 text-xs">{item.foundLocation || item.location || "—"}</td>
                                            <td className="px-5 py-4 text-slate-500 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4"><StatusBadge status={item.approvalStatus} /></td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1">
                                                    <button title="View" onClick={() => setViewItem(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={16} /></button>
                                                    {item.approvalStatus === "pending" && <>
                                                        <button title="Approve" onClick={() => handleApprove(item)} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"><Check size={16} /></button>
                                                        <button title="Reject" onClick={() => setRejectTarget(item)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"><X size={16} /></button>
                                                    </>}
                                                    {item.approvalStatus === "approved" && (
                                                        <button title="Mark returned" onClick={() => handleConfirmReturn(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"><RotateCw size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-slate-500">No found item reports found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View Modal */}
                {viewItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-lg font-bold text-slate-800">{viewItem.title}</h2>
                                <button onClick={() => setViewItem(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
                            </div>
                            {viewItem.image && <img src={viewItem.image} alt={viewItem.title} className="mb-4 w-full rounded-xl object-cover h-48" />}
                            <div className="space-y-3 text-sm">
                                {[
                                    ["Category", viewItem.category || "—"],
                                    ["Found Location", viewItem.foundLocation || viewItem.location || "—"],
                                    ["Found Date", viewItem.foundDate || viewItem.date ? new Date(viewItem.foundDate || viewItem.date || "").toLocaleDateString() : "—"],
                                    ["Status", viewItem.approvalStatus],
                                    ["Reported By", viewItem.reportedBy?.fullName || "Unknown"],
                                    ["Student ID", viewItem.reportedBy?.studentId || "—"],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b pb-2 last:border-0">
                                        <span className="text-slate-500">{k}</span>
                                        <span className="font-medium text-slate-800">{v}</span>
                                    </div>
                                ))}
                                <div className="border-b pb-2">
                                    <p className="text-slate-500 mb-1">Description</p>
                                    <p className="text-slate-700 text-xs leading-5">{viewItem.description}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewItem(null)} className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Close</button>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {rejectTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-1">Reject Report</h2>
                            <p className="text-sm text-slate-500 mb-4">Rejecting <strong>"{rejectTarget.title}"</strong>.</p>
                            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-red-400 resize-none" rows={3} />
                            <div className="mt-4 flex gap-3">
                                <button onClick={handleReject} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">Reject</button>
                                <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="flex-1 rounded-xl border py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
