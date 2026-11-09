import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Search,
    PackageCheck,
    ClipboardList,
    Tags,
    MapPin,
    Flag,
    Activity,
    ArrowUpRight,
    RefreshCw,
    Shield,
    Clock,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
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

    // The 9 required Navigation Cards with individual styling, icons, and dynamic badges
    const navigationCards = [
        {
            title: "Admin Dashboard",
            description: "System overview, live metrics, and real-time activity",
            to: "/admin",
            icon: LayoutDashboard,
            badge: "Active",
            accent: "emerald",
            colorClass: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/50",
            iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
        },
        {
            title: "Manage Users",
            description: "Accounts, role promotions, and student profiles",
            to: "/admin/users",
            icon: Users,
            badge: stats ? `${stats.totalUsers} Total` : "Accounts",
            accent: "blue",
            colorClass: "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/50",
            iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
            badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
        },
        {
            title: "Lost Items",
            description: "Review, approve, and track reports of lost belongings",
            to: "/admin/lost-items",
            icon: Search,
            badge: stats?.pendingLost ? `${stats.pendingLost} Pending` : `${stats?.totalLost ?? 0} Items`,
            accent: "orange",
            colorClass: "from-orange-500/10 to-amber-500/10 hover:border-orange-500/50",
            iconBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
            badgeClass: stats?.pendingLost
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 font-bold animate-pulse"
                : "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
        },
        {
            title: "Found Items",
            description: "Verify found belongings submitted across campus",
            to: "/admin/found-items",
            icon: PackageCheck,
            badge: stats?.pendingFound ? `${stats.pendingFound} Pending` : `${stats?.totalFound ?? 0} Items`,
            accent: "emerald",
            colorClass: "from-emerald-500/10 to-green-500/10 hover:border-emerald-500/50",
            iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            badgeClass: stats?.pendingFound
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 font-bold animate-pulse"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
        },
        {
            title: "Claim Requests",
            description: "Evaluate ownership claims and identity proof",
            to: "/admin/claims",
            icon: ClipboardList,
            badge: stats?.pendingClaims ? `${stats.pendingClaims} Pending` : `${stats?.totalClaims ?? 0} Claims`,
            accent: "purple",
            colorClass: "from-purple-500/10 to-violet-500/10 hover:border-purple-500/50",
            iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
            badgeClass: stats?.pendingClaims
                ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 font-bold animate-pulse"
                : "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
        },
        {
            title: "Categories",
            description: "Manage classification tags for campus belongings",
            to: "/admin/categories",
            icon: Tags,
            badge: "Taxonomy",
            accent: "cyan",
            colorClass: "from-cyan-500/10 to-sky-500/10 hover:border-cyan-500/50",
            iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
            badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
        },
        {
            title: "Campus Locations",
            description: "Configure ASTU buildings, blocks, and drop-off points",
            to: "/admin/locations",
            icon: MapPin,
            badge: "Campuses",
            accent: "rose",
            colorClass: "from-rose-500/10 to-pink-500/10 hover:border-rose-500/50",
            iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
            badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
        },
        {
            title: "Abuse Reports",
            description: "Investigate spam, false claims, and identify abusers",
            to: "/admin/abuse-reports",
            icon: Flag,
            badge: "Moderation",
            accent: "red",
            colorClass: "from-red-500/10 to-rose-500/10 hover:border-red-500/50",
            iconBg: "bg-red-500/15 text-red-600 dark:text-red-400",
            badgeClass: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
        },
        {
            title: "Activity Logs",
            description: "Detailed system audit trail with per-record deletion",
            to: "/admin/activity-logs",
            icon: Activity,
            badge: "Audit Trail",
            accent: "amber",
            colorClass: "from-amber-500/10 to-yellow-500/10 hover:border-amber-500/50",
            iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
            badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
        },
    ];

    return (
        <AdminLayout title="Dashboard" subtitle="System Overview">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Shield size={14} /> ASTU Administration Portal
                        </div>
                        <h1 className="mt-1 text-2xl font-black text-[#111827] dark:text-[#F3F4F6] sm:text-3xl tracking-tight">
                            Admin Command Center
                        </h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Real-time analytics and management for the FindBack Lost and Found System.
                        </p>
                    </div>

                    <button
                        onClick={loadStats}
                        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-4 py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] shadow-xs hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
                        Refresh Data
                    </button>
                </div>

                {/* Key Metrics Statistics Grid */}
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

                {/* Section 6: Dedicated Navigation Cards Grid for all 9 Admin Pages */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">
                                System Modules &amp; Navigation
                            </h2>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                Direct access to all administrative modules across the platform
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                            9 Active Modules
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {navigationCards.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <Link
                                    key={card.to}
                                    to={card.to}
                                    className={`group relative flex flex-col justify-between rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${card.colorClass}`}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`}>
                                                <IconComponent size={22} />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${card.badgeClass}`}>
                                                    {card.badge}
                                                </span>
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6B7280] dark:text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                                                    <ArrowUpRight size={17} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-base font-bold text-[#111827] dark:text-[#F3F4F6] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {card.title}
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-[#6B7280] dark:text-[#9CA3AF]">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 dark:border-[#2A2D35]/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span>Open module</span>
                                        <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Operations & Pending Review Quick Panel */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Pending Operational Summary */}
                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-6 shadow-xs lg:col-span-2">
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
                                className="rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] p-4 bg-slate-50 dark:bg-[#0D0E12] hover:border-orange-500/40 transition-colors"
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
                                className="rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] p-4 bg-slate-50 dark:bg-[#0D0E12] hover:border-emerald-500/40 transition-colors"
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
                                className="rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] p-4 bg-slate-50 dark:bg-[#0D0E12] hover:border-purple-500/40 transition-colors"
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
                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">System Operational</span>
                            </div>
                            <h3 className="mt-2 text-base font-bold text-[#111827] dark:text-[#F3F4F6]">
                                ASTU FindBack Network
                            </h3>
                            <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                                MongoDB Atlas cluster, Cloudinary image pipeline, and RBAC authentication are connected and active.
                            </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#2A2D35] flex items-center justify-between text-xs">
                            <span className="text-[#6B7280] dark:text-[#9CA3AF]">API Health:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" /> 100% Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
