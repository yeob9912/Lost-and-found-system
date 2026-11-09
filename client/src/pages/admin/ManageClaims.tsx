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
        pending: "bg-amber-100 text-amber-700",
        verification_requested: "bg-purple-100 text-purple-700",
        approved: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
    };
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
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
            setClaims(data.claims || data.data || []);
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
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Claims</h1>
                        <p className="mt-1 text-sm text-slate-500">Review ownership claims and verification responses.</p>
                    </div>
                    <button onClick={load} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {actionMsg && <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">✓ {actionMsg}</div>}

                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total", value: claims.length, color: "text-blue-600" },
                        { label: "Pending", value: claims.filter(c => c.status === "pending").length, color: "text-amber-600" },
                        { label: "Verification", value: claims.filter(c => c.status === "verification_requested").length, color: "text-purple-600" },
                        { label: "Approved", value: claims.filter(c => c.status === "approved").length, color: "text-emerald-600" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-slate-800">Claim Requests</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Search size={16} className="text-slate-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims..." className="w-full bg-transparent py-2 text-sm outline-none sm:w-48" />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm outline-none bg-slate-50">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="verification_requested">Verification</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-slate-400">Loading claims…</div>
                        ) : (
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                    <tr>
                                        <th className="px-5 py-4">Item Claimed</th>
                                        <th className="px-5 py-4">Claimant</th>
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map(claim => (
                                        <tr key={claim._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-slate-800">{claim.foundItem?.title || "Unknown Item"}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-700">{claim.claimedBy?.fullName || "Unknown"}</p>
                                                <p className="text-xs text-slate-400">{claim.claimedBy?.studentId || ""}</p>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 text-xs">{new Date(claim.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4"><StatusBadge status={claim.status} /></td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1">
                                                    <button title="View" onClick={() => setViewClaim(claim)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={16} /></button>
                                                    {claim.status === "pending" && (
                                                        <button title="Request verification" onClick={() => action(() => requestVerification(claim._id), "Verification requested.")} className="rounded-lg p-2 text-purple-600 hover:bg-purple-50 transition-colors"><MessageSquare size={16} /></button>
                                                    )}
                                                    {(claim.status === "pending" || claim.status === "verification_requested") && <>
                                                        <button title="Approve" onClick={() => action(() => approveClaim(claim._id), "Claim approved.")} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"><Check size={16} /></button>
                                                        <button title="Reject" onClick={() => action(() => rejectClaim(claim._id), "Claim rejected.")} className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"><X size={16} /></button>
                                                    </>}
                                                    {claim.status === "approved" && (
                                                        <button title="Mark complete" onClick={() => action(() => completeClaim(claim._id), "Claim completed.")} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"><CheckCheck size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-slate-500">No claims found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View Modal */}
                {viewClaim && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-lg font-bold text-slate-800">Claim Details</h2>
                                <button onClick={() => setViewClaim(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
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
                                    <div key={k} className="flex justify-between border-b pb-2 last:border-0">
                                        <span className="text-slate-500">{k}</span>
                                        <span className="font-medium text-slate-800">{v}</span>
                                    </div>
                                ))}
                                {(viewClaim.explanation || viewClaim.description) && (
                                    <div>
                                        <p className="text-slate-500 mb-1">Explanation</p>
                                        <p className="text-slate-700 text-xs leading-5 bg-slate-50 rounded-lg p-3">{viewClaim.explanation || viewClaim.description}</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setViewClaim(null)} className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
