import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Check, X, MessageSquare, RefreshCw, CheckCheck } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    fetchAdminClaims,
    approveClaim,
    rejectClaim,
    requestVerification,
    completeClaim,
} from "../../services/adminService";

interface Claim {
    _id: string;
    foundItem?: { title?: string; _id?: string };
    claimedBy?: { fullName: string; email: string; studentId: string };
    explanation?: string;
    description?: string;
    status: "pending" | "verification_requested" | "approved" | "rejected" | "completed";
    createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
    const labels: Record<string, string> = {
        pending: "Pending",
        verification_requested: "Verification",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed",
    };
    const styles: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        verification_requested: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
        approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        rejected: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
        completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    };
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600 dark:bg-[#2A2D35] dark:text-[#9CA3AF]"}`}>
            {labels[status] || status}
        </span>
    );
}

export default function ManageClaims() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionMsg, setActionMsg] = useState("");
    const [viewClaim, setViewClaim] = useState<Claim | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params: Record<string, string> = {};
            if (statusFilter !== "all") params.status = statusFilter;
            const data = await fetchAdminClaims(params);
            setClaims(data?.claims || data?.data || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            if (!msg.toLowerCase().includes("access denied") && !msg.toLowerCase().includes("administrator")) {
                setError(msg || "Failed to load claims");
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    const notify = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3000); };

    const action = async (fn: () => Promise<unknown>, msg: string) => {
        try { await fn(); notify(msg); load(); }
        catch (err: unknown) { notify(err instanceof Error ? err.message : "Action failed"); }
    };

    const filtered = claims.filter(c =>
        `${c.foundItem?.title || ""} ${c.claimedBy?.fullName || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Claims" subtitle="Ownership Verification">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Manage Claims</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">Review ownership claims and verification responses.</p>
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

                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total Claims", value: claims.length, color: "text-blue-600 dark:text-blue-400" },
                        { label: "Pending", value: claims.filter(c => c.status === "pending").length, color: "text-amber-600 dark:text-amber-400" },
                        { label: "Verification", value: claims.filter(c => c.status === "verification_requested").length, color: "text-purple-600 dark:text-purple-400" },
                        { label: "Approved", value: claims.filter(c => c.status === "approved").length, color: "text-emerald-600 dark:text-emerald-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                <div className="glass-panel overflow-hidden rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 transition-colors">
                    <div className="flex flex-col gap-3 border-b border-[#E2E8F0] dark:border-[#2A2D35] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6]">Claim Requests</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search claims..."
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
                                <option value="verification_requested" className="dark:bg-[#181A20]">Verification</option>
                                <option value="approved" className="dark:bg-[#181A20]">Approved</option>
                                <option value="rejected" className="dark:bg-[#181A20]">Rejected</option>
                                <option value="completed" className="dark:bg-[#181A20]">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">Loading claims…</div>
                        ) : (
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-[#0D0E12] text-xs uppercase text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                                    <tr>
                                        <th className="px-5 py-4">Item Claimed</th>
                                        <th className="px-5 py-4">Claimant</th>
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2D35]">
                                    {filtered.map(claim => (
                                        <tr key={claim._id} className="hover:bg-slate-50/70 dark:hover:bg-[#2A2D35]/30 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-[#111827] dark:text-[#F3F4F6]">{claim.foundItem?.title || "Unknown Item"}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#111827] dark:text-[#F3F4F6]">{claim.claimedBy?.fullName || "Unknown"}</p>
                                                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{claim.claimedBy?.studentId || ""}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] text-xs">{new Date(claim.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4"><StatusBadge status={claim.status} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button title="View" onClick={() => setViewClaim(claim)} className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"><Eye size={16} /></button>
                                                    {claim.status === "pending" && (
                                                        <button title="Request verification" onClick={() => action(() => requestVerification(claim._id), "Verification requested.")} className="rounded-lg p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"><MessageSquare size={16} /></button>
                                                    )}
                                                    {(claim.status === "pending" || claim.status === "verification_requested") && <>
                                                        <button title="Approve" onClick={() => action(() => approveClaim(claim._id), "Claim approved.")} className="rounded-lg p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"><Check size={16} /></button>
                                                        <button title="Reject" onClick={() => action(() => rejectClaim(claim._id), "Claim rejected.")} className="rounded-lg p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"><X size={16} /></button>
                                                    </>}
                                                    {claim.status === "approved" && (
                                                        <button title="Mark complete" onClick={() => action(() => completeClaim(claim._id), "Claim completed.")} className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"><CheckCheck size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-[#6B7280] dark:text-[#9CA3AF]">No claims found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View Modal */}
                {viewClaim && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
                        <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">Claim Details</h2>
                                <button onClick={() => setViewClaim(null)} className="rounded-lg p-1 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#2A2D35] cursor-pointer"><X size={18} /></button>
                            </div>
                            <div className="space-y-3 text-sm">
                                {[
                                    ["Item", viewClaim.foundItem?.title || "Unknown"],
                                    ["Claimant", viewClaim.claimedBy?.fullName || "Unknown"],
                                    ["Student ID", viewClaim.claimedBy?.studentId || "—"],
                                    ["Email", viewClaim.claimedBy?.email || "—"],
                                    ["Status", viewClaim.status],
                                    ["Submitted", new Date(viewClaim.createdAt).toLocaleString()],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-[#E2E8F0] dark:border-[#2A2D35] pb-2 last:border-0">
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">{k}</span>
                                        <span className="font-medium text-[#111827] dark:text-[#F3F4F6]">{v}</span>
                                    </div>
                                ))}
                                {(viewClaim.explanation || viewClaim.description) && (
                                    <div>
                                        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-1">Explanation</p>
                                        <p className="text-[#111827] dark:text-[#F3F4F6] text-xs leading-5 bg-slate-50 dark:bg-[#0D0E12] border border-[#E2E8F0] dark:border-[#2A2D35] rounded-xl p-3">{viewClaim.explanation || viewClaim.description}</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setViewClaim(null)} className="mt-5 w-full rounded-xl bg-slate-100 dark:bg-[#2A2D35] py-2.5 text-sm font-semibold text-[#111827] dark:text-[#F3F4F6] hover:bg-slate-200 dark:hover:bg-[#2A2D35]/80 transition-colors cursor-pointer">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
