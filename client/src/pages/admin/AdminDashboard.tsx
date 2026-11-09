import { useEffect, useState } from "react";
import {
    Users,
    Search,
    PackageCheck,
    ClipboardList,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatisticsCard from "../../components/admin/StatisticsCard";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchAdminStats } from "../../services/adminService";

interface Stats {
    totalUsers: number;
    totalLost: number;
    pendingLost: number;
    totalFound: number;
    pendingFound: number;
    totalClaims: number;
    pendingClaims: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchAdminStats();
            setStats(data.stats);
        } catch {
            // Keep stats fallback without showing access denied banner
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStats(); }, []);

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">ASTU Admin Panel</p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Dashboard Overview</h1>
                        <p className="mt-1 text-sm text-slate-500">Monitor and manage the ASTU Lost and Found System.</p>
                    </div>
                    <button
                        onClick={loadStats}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        ⚠ {error} — Showing placeholder data.
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatisticsCard
                        title="Total Users"
                        value={loading ? "—" : stats?.totalUsers ?? 0}
                        description="Registered system users"
                        icon={Users}
                        color="blue"
                    />
                    <StatisticsCard
                        title="Lost Items"
                        value={loading ? "—" : stats?.totalLost ?? 0}
                        description={`${stats?.pendingLost ?? 0} pending review`}
                        icon={Search}
                        color="orange"
                    />
                    <StatisticsCard
                        title="Found Items"
                        value={loading ? "—" : stats?.totalFound ?? 0}
                        description={`${stats?.pendingFound ?? 0} pending approval`}
                        icon={PackageCheck}
                        color="green"
                    />
                    <StatisticsCard
                        title="Claim Requests"
                        value={loading ? "—" : stats?.totalClaims ?? 0}
                        description={`${stats?.pendingClaims ?? 0} awaiting decision`}
                        icon={ClipboardList}
                        color="purple"
                    />
                </div>

                {/* Middle Row */}
                <div className="mt-8 grid gap-6 xl:grid-cols-3">
                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2 shadow-sm">
                        <h2 className="font-bold text-slate-800">Quick Actions</h2>
                        <p className="mt-1 text-sm text-slate-500">Jump to common admin tasks</p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                                { label: "Review Lost Items", sub: `${stats?.pendingLost ?? "..."} pending`, to: "/admin/lost-items", color: "bg-orange-50 border-orange-200 hover:bg-orange-100", badge: "orange" },
                                { label: "Review Found Items", sub: `${stats?.pendingFound ?? "..."} pending`, to: "/admin/found-items", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", badge: "green" },
                                { label: "Process Claims", sub: `${stats?.pendingClaims ?? "..."} to review`, to: "/admin/claims", color: "bg-purple-50 border-purple-200 hover:bg-purple-100", badge: "purple" },
                                { label: "Manage Users", sub: `${stats?.totalUsers ?? "..."} accounts`, to: "/admin/users", color: "bg-blue-50 border-blue-200 hover:bg-blue-100", badge: "blue" },
                            ].map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${item.color}`}
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="font-bold text-slate-800">Pending Tasks</h2>
                        <p className="mt-1 text-sm text-slate-500">Items requiring attention</p>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-orange-100 p-3 text-orange-600"><Clock size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-800">{loading ? "—" : (stats?.pendingLost ?? 0) + (stats?.pendingFound ?? 0)}</p>
                                    <p className="text-sm text-slate-500">Pending reports</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-100 p-3 text-blue-600"><AlertCircle size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-800">{loading ? "—" : stats?.pendingClaims ?? 0}</p>
                                    <p className="text-sm text-slate-500">Claims to review</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-green-100 p-3 text-green-600"><CheckCircle size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-800">{loading ? "—" : (stats?.totalClaims ?? 0) - (stats?.pendingClaims ?? 0)}</p>
                                    <p className="text-sm text-slate-500">Processed claims</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3 text-purple-600"><TrendingUp size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-800">{loading ? "—" : stats?.totalUsers ?? 0}</p>
                                    <p className="text-sm text-slate-500">Registered users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Banner */}
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20">
                    <h2 className="text-xl font-bold">Welcome to ASTU Administration</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100">
                        Manage user accounts, review lost and found item reports, handle claim requests, and monitor
                        activities across the university system.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link to="/admin/lost-items" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors">
                            Lost Items →
                        </Link>
                        <Link to="/admin/users" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors">
                            Users →
                        </Link>
                        <Link to="/admin/claims" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors">
                            Claims →
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
