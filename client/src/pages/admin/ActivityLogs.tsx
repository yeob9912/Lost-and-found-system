import { useState } from "react";
import { Search, Activity, User, Clock, Filter, RefreshCw, FileText } from "lucide-react";
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

export default function ActivityLogs() {
    const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All");

    const filtered = activities.filter((act) => {
        const matchesModule = moduleFilter === "All" || act.module === moduleFilter;
        const matchesSearch = `${act.user} ${act.action} ${act.module} ${act.type}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesModule && matchesSearch;
    });

    const getTypeColor = (type: ActivityItem["type"]) => {
        switch (type) {
            case "Create":
                return "bg-emerald-100 text-emerald-700";
            case "Update":
                return "bg-blue-100 text-blue-700";
            case "Delete":
                return "bg-red-100 text-red-700";
            case "Register":
                return "bg-purple-100 text-purple-700";
            case "Resolve":
                return "bg-teal-100 text-teal-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Monitor actions and audit administrative history across the system.
                        </p>
                    </div>

                    <button
                        onClick={() => setActivities([...initialActivities])}
                        className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                    >
                        <RefreshCw size={15} /> Refresh Logs
                    </button>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Total Activities</p>
                            <Activity className="text-blue-600" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-slate-800">{activities.length}</h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Today's Events</p>
                            <Clock className="text-emerald-600" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-slate-800">
                            {activities.filter((a) => a.date.includes("Nov 09")).length}
                        </h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Unique Users</p>
                            <User className="text-purple-600" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-slate-800">
                            {new Set(activities.map((a) => a.user)).size}
                        </h2>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={18} className="text-slate-500" /> System Audit Trail
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Search size={16} className="text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search logs..."
                                    className="w-full bg-transparent py-2 text-sm outline-none sm:w-48"
                                />
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Filter size={15} className="text-slate-400" />
                                <select
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm outline-none"
                                >
                                    <option value="All">All Modules</option>
                                    <option value="Users">Users</option>
                                    <option value="Lost Items">Lost Items</option>
                                    <option value="Found Items">Found Items</option>
                                    <option value="Claims">Claims</option>
                                    <option value="Settings">Settings</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                <tr>
                                    <th className="px-5 py-4">Actor</th>
                                    <th className="px-5 py-4">Action Performed</th>
                                    <th className="px-5 py-4">Module</th>
                                    <th className="px-5 py-4">Type</th>
                                    <th className="px-5 py-4">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            {activity.user}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 max-w-xs">{activity.action}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {activity.module}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeColor(activity.type)}`}>
                                                {activity.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 text-xs">
                                            <p className="font-medium text-slate-700">{activity.date}</p>
                                            <p className="text-slate-400 mt-0.5">{activity.time}</p>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-500">
                                            No activity logs match your filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
