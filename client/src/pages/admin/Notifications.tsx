import { useState, useEffect, useCallback } from "react";
import {
    Bell,
    UserPlus,
    Search,
    Package,
    ClipboardList,
    MessageSquare,
    CheckCheck,
    Trash2,
    Filter,
    RefreshCw,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications,
} from "../../services/adminService";

interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type?: string;
    read: boolean;
    createdAt: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [actionMsg, setActionMsg] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchNotifications();
            setNotifications(data.notifications || data.data || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const notify = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationRead(id);
            setNotifications((old) =>
                old.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            notify("Notification marked as read");
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((old) => old.map((n) => ({ ...n, read: true })));
            notify("All notifications marked as read");
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
            setNotifications((old) => old.filter((n) => n._id !== id));
            notify("Notification deleted");
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await deleteAllNotifications();
            setNotifications([]);
            notify("All notifications cleared");
        } catch (err: unknown) {
            notify(err instanceof Error ? err.message : "Action failed");
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filtered = notifications.filter((n) => {
        if (filter === "Unread") return !n.read;
        if (filter === "Read") return n.read;
        return true;
    });

    const getIcon = (type?: string) => {
        switch (type?.toLowerCase()) {
            case "user":
            case "user_registered":
                return <UserPlus size={20} />;
            case "lost":
            case "lost_item":
            case "lost_item_submitted":
                return <Search size={20} />;
            case "found":
            case "found_item":
            case "found_item_submitted":
                return <Package size={20} />;
            case "claim":
            case "claim_submitted":
            case "claim_approved":
            case "claim_rejected":
                return <ClipboardList size={20} />;
            case "verification":
                return <MessageSquare size={20} />;
            default:
                return <Bell size={20} />;
        }
    };

    const getIconColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case "user":
            case "user_registered":
                return "bg-blue-100 text-blue-600";
            case "lost":
            case "lost_item":
            case "lost_item_submitted":
                return "bg-rose-100 text-rose-600";
            case "found":
            case "found_item":
            case "found_item_submitted":
                return "bg-emerald-100 text-emerald-600";
            case "claim":
            case "claim_submitted":
            case "claim_approved":
            case "claim_rejected":
                return "bg-purple-100 text-purple-600";
            case "verification":
                return "bg-indigo-100 text-indigo-600";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Stay updated about important activities in the system.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={load}
                            className="flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                        >
                            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50"
                        >
                            <CheckCheck size={16} /> Mark all read
                        </button>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 shadow-sm transition-colors"
                            >
                                <Trash2 size={16} /> Clear all
                            </button>
                        )}
                    </div>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Total Notifications</p>
                            <Bell className="text-blue-600" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-slate-800">{notifications.length}</h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Unread</p>
                            <span className="rounded-lg bg-orange-100 p-1.5 text-orange-600">
                                <Bell size={18} />
                            </span>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-orange-600">{unreadCount}</h2>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Read</p>
                            <CheckCheck className="text-emerald-600" size={20} />
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-emerald-600">
                            {notifications.length - unreadCount}
                        </h2>
                    </div>
                </div>

                {/* Notification List Container */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-bold text-slate-800">System Notifications</h2>
                            <p className="mt-0.5 text-xs text-slate-500">{unreadCount} unread items</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                            <Filter size={15} className="text-slate-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-transparent py-2 text-sm outline-none"
                            >
                                <option value="All">All</option>
                                <option value="Unread">Unread</option>
                                <option value="Read">Read</option>
                            </select>
                        </div>
                    </div>

                    <div className="divide-y">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-slate-400">Loading notifications...</div>
                        ) : (
                            filtered.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-start ${
                                        !notification.read ? "bg-emerald-50/30" : ""
                                    }`}
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${getIconColor(
                                            notification.type
                                        )}`}
                                    >
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-slate-800 text-sm">
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            )}
                                            {notification.type && (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                                                    {notification.type.replace(/_/g, " ")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <p className="mt-1.5 text-xs text-slate-400">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-1 self-end sm:self-center">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                title="Mark as read"
                                                className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                                            >
                                                <CheckCheck size={17} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification._id)}
                                            title="Delete notification"
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && filtered.length === 0 && (
                            <div className="p-12 text-center">
                                <Bell size={36} className="mx-auto text-slate-300" />
                                <h3 className="mt-3 font-semibold text-slate-700">No notifications</h3>
                                <p className="mt-1 text-sm text-slate-500">There are no notifications in this section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
