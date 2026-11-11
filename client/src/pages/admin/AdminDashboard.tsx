import { useEffect, useState } from "react";
import {
    Users,
    Search,
    PackageCheck,
    ClipboardList,
    RefreshCw,
    Clock,
    AlertCircle,
    CheckCircle2,
    Shield,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatisticsCard from "../../components/admin/StatisticsCard";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchAdminStats } from "../../services/adminService";
import LostVsFoundBarChart from "../../components/admin/charts/LostVsFoundBarChart";
import ItemStatusPieChart, { StatusSegment } from "../../components/admin/charts/ItemStatusPieChart";
import RecoveryTrendLineChart, { TrendPoint } from "../../components/admin/charts/RecoveryTrendLineChart";

interface Stats {
    totalUsers: number;
    totalLost: number;
    pendingLost: number;
    totalFound: number;
    pendingFound: number;
    totalClaims: number;
    pendingClaims: number;
    lostVsFound?: {
        lost: number;
        found: number;
    };
    statusDistribution?: StatusSegment[];
    recoveryTrends?: TrendPoint[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminStats();
            if (data?.stats) {
                setStats(data.stats);
            }
        } catch {
            // Keep stats fallback gracefully
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Fallback status distribution computed directly from live DB counts if array is missing
    const statusData: StatusSegment[] = stats?.statusDistribution || [
        { status: "Lost", count: stats?.totalLost ?? 0, color: "#F43F5E" },
        { status: "Found", count: stats?.totalFound ?? 0, color: "#F59E0B" },
        { status: "Claimed", count: stats?.totalClaims ?? 0, color: "#0EA5E9" },
        { status: "Returned", count: 0, color: "#10B981" },
    ];

    const recoveryData: TrendPoint[] = stats?.recoveryTrends || [];

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Shield size={14} /> FindBack System Command Center
                        </div>
                        <h1 className="mt-1 text-2xl font-black text-[#111827] dark:text-[#F3F4F6] sm:text-3xl tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Real-time database analytics and monitoring for reported belongings across campus.
                        </p>
                    </div>

                    <button
                        onClick={loadStats}
                        className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 bg-white/70 dark:bg-[#181A20]/75 backdrop-blur-[14px] px-4 py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] shadow-md shadow-black/5 dark:shadow-black/30 hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-all cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
                        Refresh Analytics
                    </button>
                </div>

                {/* Key Metrics Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatisticsCard
                        title="Registered Users"
                        value={loading ? "—" : stats?.totalUsers ?? 0}
                        description="Student & admin accounts"
                        icon={Users}
                        color="blue"
                    />
                    <StatisticsCard
                        title="Reported Lost Items"
                        value={loading ? "—" : stats?.totalLost ?? 0}
                        description={`${stats?.pendingLost ?? 0} awaiting approval`}
                        icon={Search}
                        color="orange"
                    />
                    <StatisticsCard
                        title="Found Belongings"
                        value={loading ? "—" : stats?.totalFound ?? 0}
                        description={`${stats?.pendingFound ?? 0} pending verification`}
                        icon={PackageCheck}
                        color="green"
                    />
                    <StatisticsCard
                        title="Claim Requests"
                        value={loading ? "—" : stats?.totalClaims ?? 0}
                        description={`${stats?.pendingClaims ?? 0} pending review`}
                        icon={ClipboardList}
                        color="purple"
                    />
                </div>

                {/* 
                  Analytics Section: 3 Interactive Animated Charts 
                  1. Lost vs. Found Items Bar Chart
                  2. Item Status Distribution Pie Chart
                  3. Item Recovery Trends Line Chart
                */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                                <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Analytics &amp; Reporting Intelligence
                            </h2>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                Real-time dynamic visual telemetry powered by database records
                            </p>
                        </div>
                    </div>

                    {/* Top Row: 2 Charts (Bar Chart & Pie Chart) */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* 1. Lost vs. Found Items – Bar Chart */}
                        <LostVsFoundBarChart
                            lost={stats?.lostVsFound?.lost ?? stats?.totalLost ?? 0}
                            found={stats?.lostVsFound?.found ?? stats?.totalFound ?? 0}
                            loading={loading}
                        />

                        {/* 2. Item Status Distribution – Pie Chart */}
                        <ItemStatusPieChart
                            data={statusData}
                            loading={loading}
                        />
                    </div>

                    {/* Bottom Row: Item Recovery Trends Line Chart */}
                    <div>
                        {/* 3. Item Recovery Trends – Line Chart */}
                        <RecoveryTrendLineChart
                            data={recoveryData}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Operations & Pending Review Quick Panel */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Pending Operational Summary */}
                    <div className="glass-panel rounded-3xl p-6 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[#111827] dark:text-[#F3F4F6]">
                                    Items Requiring Administrative Attention
                                </h3>
                                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                                    Pending user requests that need moderation or review
                                </p>
                            </div>
                            <span className="rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold px-2.5 py-1">
                                Action Required
                            </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <Link
                                to="/admin/lost-items"
                                className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 p-4 bg-white/50 dark:bg-[#0D0E12]/50 hover:border-orange-500/40 transition-all hover:-translate-y-0.5 shadow-sm"
                            >
                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-semibold">
                                    <Clock size={15} /> Lost Submissions
                                </div>
                                <p className="mt-2 text-2xl font-black text-[#111827] dark:text-[#F3F4F6]">
                                    {stats?.pendingLost ?? 0}
                                </p>
                                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Awaiting verification</p>
                            </Link>

                            <Link
                                to="/admin/found-items"
                                className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 p-4 bg-white/50 dark:bg-[#0D0E12]/50 hover:border-emerald-500/40 transition-all hover:-translate-y-0.5 shadow-sm"
                            >
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                    <PackageCheck size={15} /> Found Belongings
                                </div>
                                <p className="mt-2 text-2xl font-black text-[#111827] dark:text-[#F3F4F6]">
                                    {stats?.pendingFound ?? 0}
                                </p>
                                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Awaiting publishing</p>
                            </Link>

                            <Link
                                to="/admin/claims"
                                className="rounded-2xl border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 p-4 bg-white/50 dark:bg-[#0D0E12]/50 hover:border-purple-500/40 transition-all hover:-translate-y-0.5 shadow-sm"
                            >
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                                    <AlertCircle size={15} /> Claim Petitions
                                </div>
                                <p className="mt-2 text-2xl font-black text-[#111827] dark:text-[#F3F4F6]">
                                    {stats?.pendingClaims ?? 0}
                                </p>
                                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Ownership reviews</p>
                            </Link>
                        </div>
                    </div>

                    {/* System Status Banner */}
                    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">System Operational</span>
                            </div>
                            <h3 className="mt-2 text-base font-bold text-[#111827] dark:text-[#F3F4F6]">
                                FindBack Telemetry
                            </h3>
                            <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                                Real-time particle plexus network, MongoDB Atlas cluster, and live analytics pipeline active.
                            </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#E2E8F0]/60 dark:border-[#2A2D35]/60 flex items-center justify-between text-xs">
                            <span className="text-[#6B7280] dark:text-[#9CA3AF]">Engine Status:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" /> 100% Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
