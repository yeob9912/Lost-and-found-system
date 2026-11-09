import { useState, useEffect } from "react";
import {
    Search,
    Activity,
    User,
    Clock,
    Filter,
    RefreshCw,
    FileText,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

interface ActivityItem {
    id: number;
    user: string;
    action: string;
    module: "Users" | "Lost Items" | "Found Items" | "Claims" | "Settings";
    date: string;
    time: string;
    type: "Create" | "Update" | "Delete" | "Register" | "Resolve";
}

const initialActivities: ActivityItem[] = [
    { id: 1, user: "Abebe Kebede", action: "Submitted a lost item report for 'HP Pavilion Laptop'", module: "Lost Items", date: "Nov 09, 2026", time: "10:30 AM", type: "Create" },
    { id: 2, user: "Sara Ahmed", action: "Submitted a found item report for 'Samsung Galaxy Phone'", module: "Found Items", date: "Nov 09, 2026", time: "10:15 AM", type: "Create" },
    { id: 3, user: "Administrator", action: "Approved found item report #FOUND-002", module: "Found Items", date: "Nov 09, 2026", time: "09:45 AM", type: "Update" },
    { id: 4, user: "Dawit Tadesse", action: "Submitted a claim request for 'Student ID Card'", module: "Claims", date: "Nov 08, 2026", time: "04:20 PM", type: "Create" },
    { id: 5, user: "Administrator", action: "Requested additional claim verification for claim #CLM-002", module: "Claims", date: "Nov 08, 2026", time: "03:10 PM", type: "Update" },
    { id: 6, user: "Meron Bekele", action: "Registered a new student account", module: "Users", date: "Nov 08, 2026", time: "01:20 PM", type: "Register" },
    { id: 7, user: "Hana Ali", action: "Reported abuse on suspicious item post", module: "Settings", date: "Nov 08, 2026", time: "11:05 AM", type: "Create" },
    { id: 8, user: "Administrator", action: "Confirmed return of lost item #LOST-001 to verified owner", module: "Lost Items", date: "Nov 07, 2026", time: "02:30 PM", type: "Resolve" },
];

const STORAGE_KEY = "findback_admin_activity_logs_v1";

export default function ActivityLogs() {
    const [activities, setActivities] = useState<ActivityItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : initialActivities;
        } catch {
            return initialActivities;
        }
    });

    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All");
    const [confirmDelete, setConfirmDelete] = useState<ActivityItem | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Save to localStorage whenever activities change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch {
            // ignore
        }
    }, [activities]);

    const showMsg = (type: "success" | "error", message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3500);
    };

    const handleDelete = (item: ActivityItem) => {
        try {
            const updated = activities.filter((a) => a.id !== item.id);
            setActivities(updated);
            setConfirmDelete(null);
            showMsg("success", `Activity record #${item.id} has been permanently deleted.`);
        } catch {
            showMsg("error", "Failed to delete the activity record.");
        }
    };

    const handleReset = () => {
        setActivities([...initialActivities]);
        showMsg("success", "Activity logs reloaded to default records.");
    };

    const filtered = activities.filter((act) => {
        const matchesModule = moduleFilter === "All" || act.module === moduleFilter;
        const matchesSearch = `${act.user} ${act.action} ${act.module} ${act.type}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesModule && matchesSearch;
    });

    const getTypeBadgeClass = (type: ActivityItem["type"]) => {
        switch (type) {
            case "Create":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
            case "Update":
                return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
            case "Delete":
                return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
            case "Register":
                return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300";
            case "Resolve":
                return "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-[#2A2D35] dark:text-[#9CA3AF]";
        }
    };

    return (
        <AdminLayout title="Activity Logs" subtitle="Audit Trail">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Activity Logs</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Monitor actions and audit administrative history across the system.
                        </p>
                    </div>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-4 py-2.5 text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] shadow-xs transition-colors"
                    >
                        <RefreshCw size={15} /> Reset / Reload Logs
                    </button>
                </div>

                {/* Feedback Toast */}
                {feedback && (
                    <div
                        className={`mb-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium animate-in fade-in ${
                            feedback.type === "success"
                                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300"
                                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-800 dark:text-red-300"
                        }`}
                    >
                        {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                        <span>{feedback.message}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Activities</p>
                            <Activity className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">{activities.length}</h2>
                    </div>

                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Today's Events</p>
                            <Clock className="text-emerald-600 dark:text-emerald-400" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">
                            {activities.filter((a) => a.date.includes("Nov 09")).length}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-colors">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Unique Actors</p>
                            <User className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">
                            {new Set(activities.map((a) => a.user)).size}
                        </h2>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] shadow-xs transition-colors">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 border-b border-[#E2E8F0] dark:border-[#2A2D35] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                            <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                            System Audit Trail
                        </h2>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search logs..."
                                    className="w-full bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none sm:w-48 placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF]"
                                />
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Filter size={15} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <select
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none"
                                >
                                    <option value="All" className="dark:bg-[#181A20]">All Modules</option>
                                    <option value="Users" className="dark:bg-[#181A20]">Users</option>
                                    <option value="Lost Items" className="dark:bg-[#181A20]">Lost Items</option>
                                    <option value="Found Items" className="dark:bg-[#181A20]">Found Items</option>
                                    <option value="Claims" className="dark:bg-[#181A20]">Claims</option>
                                    <option value="Settings" className="dark:bg-[#181A20]">Settings</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-[#0D0E12] text-xs uppercase text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                                <tr>
                                    <th className="px-5 py-4">Actor</th>
                                    <th className="px-5 py-4">Action Performed</th>
                                    <th className="px-5 py-4">Module</th>
                                    <th className="px-5 py-4">Type</th>
                                    <th className="px-5 py-4">Date & Time</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2D35]">
                                {filtered.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50/70 dark:hover:bg-[#2A2D35]/30 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-[#111827] dark:text-[#F3F4F6]">
                                            {activity.user}
                                        </td>
                                        <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] max-w-xs">{activity.action}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-lg bg-slate-100 dark:bg-[#2A2D35] px-2.5 py-1 text-xs font-semibold text-[#111827] dark:text-[#F3F4F6]">
                                                {activity.module}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClass(activity.type)}`}>
                                                {activity.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs">
                                            <p className="font-medium text-[#111827] dark:text-[#F3F4F6]">{activity.date}</p>
                                            <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">{activity.time}</p>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => setConfirmDelete(activity)}
                                                title="Delete activity record"
                                                aria-label="Delete activity record"
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                                            No activity logs match your filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
                        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                                <ShieldAlert size={24} />
                            </div>

                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">
                                Delete Activity Log Record?
                            </h2>

                            <p className="mt-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                                Are you sure you want to permanently delete this audit record?
                            </p>

                            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-[#0D0E12] border border-[#E2E8F0] dark:border-[#2A2D35] p-3 text-xs space-y-1">
                                <p><strong className="text-[#111827] dark:text-[#F3F4F6]">Actor:</strong> {confirmDelete.user}</p>
                                <p><strong className="text-[#111827] dark:text-[#F3F4F6]">Action:</strong> {confirmDelete.action}</p>
                                <p><strong className="text-[#111827] dark:text-[#F3F4F6]">Timestamp:</strong> {confirmDelete.date} at {confirmDelete.time}</p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => handleDelete(confirmDelete)}
                                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all active:scale-95"
                                >
                                    Confirm &amp; Delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
