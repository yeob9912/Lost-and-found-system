import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CheckCheck,
    Trash2,
    X,
    UserPlus,
    Search,
    Package,
    ClipboardList,
    MessageSquare,
    ExternalLink,
    RefreshCw,
} from "lucide-react";
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications,
} from "../../services/adminService";

export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type?: string;
    read: boolean;
    createdAt: string;
    relatedId?: string;
    link?: string;
}

interface AdminNotificationOverlayProps {
    open: boolean;
    onClose: () => void;
    onUnreadCountChange?: (count: number) => void;
}

export default function AdminNotificationOverlay({
    open,
    onClose,
    onUnreadCountChange,
}: AdminNotificationOverlayProps) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"All" | "Unread">("All");

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchNotifications();
            const list: NotificationItem[] = data.notifications || data.data || [];
            setNotifications(list);
            const unread = list.filter((n) => !n.read).length;
            onUnreadCountChange?.(unread);
        } catch {
            // silent fail or fallback
        } finally {
            setLoading(false);
        }
    }, [onUnreadCountChange]);

    useEffect(() => {
        if (open) {
            loadNotifications();
        }
    }, [open, loadNotifications]);

    // Initial load for unread badge count
    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await markNotificationRead(id);
            setNotifications((old) => {
                const updated = old.map((n) => (n._id === id ? { ...n, read: true } : n));
                onUnreadCountChange?.(updated.filter((n) => !n.read).length);
                return updated;
            });
        } catch {
            /* ignore */
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((old) => old.map((n) => ({ ...n, read: true })));
            onUnreadCountChange?.(0);
        } catch {
            /* ignore */
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await deleteNotification(id);
            setNotifications((old) => {
                const updated = old.filter((n) => n._id !== id);
                onUnreadCountChange?.(updated.filter((n) => !n.read).length);
                return updated;
            });
        } catch {
            /* ignore */
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await deleteAllNotifications();
            setNotifications([]);
            onUnreadCountChange?.(0);
        } catch {
            /* ignore */
        }
    };

    const handleNotificationClick = async (notif: NotificationItem) => {
        // Automatically mark as read if unread
        if (!notif.read) {
            try {
                await markNotificationRead(notif._id);
                setNotifications((old) => {
                    const updated = old.map((n) => (n._id === notif._id ? { ...n, read: true } : n));
                    onUnreadCountChange?.(updated.filter((n) => !n.read).length);
                    return updated;
                });
            } catch {
                /* ignore */
            }
        }

        onClose();

        // Direct to the right page
        const t = (notif.type || "").toLowerCase();
        const msg = (notif.message || "").toLowerCase();
        const title = (notif.title || "").toLowerCase();

        if (t.includes("lost") || msg.includes("lost item") || title.includes("lost")) {
            navigate("/admin/lost-items");
        } else if (t.includes("found") || msg.includes("found item") || title.includes("found")) {
            navigate("/admin/found-items");
        } else if (t.includes("claim") || msg.includes("claim") || title.includes("claim")) {
            navigate("/admin/claims");
        } else if (t.includes("user") || msg.includes("user") || title.includes("user")) {
            navigate("/admin/users");
        } else {
            navigate("/admin");
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = notifications.filter((n) => (filter === "Unread" ? !n.read : true));

    const getIcon = (type?: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes("user")) return <UserPlus size={18} />;
        if (t.includes("lost")) return <Search size={18} />;
        if (t.includes("found")) return <Package size={18} />;
        if (t.includes("claim")) return <ClipboardList size={18} />;
        if (t.includes("verification")) return <MessageSquare size={18} />;
        return <Bell size={18} />;
    };

    const getIconBg = (type?: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes("user")) return "bg-blue-100 text-blue-600";
        if (t.includes("lost")) return "bg-rose-100 text-rose-600";
        if (t.includes("found")) return "bg-emerald-100 text-emerald-600";
        if (t.includes("claim")) return "bg-purple-100 text-purple-600";
        return "bg-slate-100 text-slate-600";
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Slide-over Drawer */}
            <aside className="relative z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                            <p className="text-xs text-slate-500">
                                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={loadNotifications}
                            title="Refresh notifications"
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter and Global Action Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5 bg-slate-50/80">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setFilter("All")}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                filter === "All"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter("Unread")}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                filter === "Unread"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                <CheckCheck size={14} />
                                Mark read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={13} />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {loading && notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">Loading notifications...</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="rounded-full bg-slate-100 p-4 text-slate-400 mb-3">
                                <Bell size={28} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-700">No notifications</h3>
                            <p className="mt-1 text-xs text-slate-400 max-w-[200px]">
                                {filter === "Unread"
                                    ? "You have marked all notifications as read."
                                    : "No recent notifications received."}
                            </p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                                className={`group relative flex cursor-pointer items-start gap-3.5 p-4 transition-colors hover:bg-slate-50 ${
                                    !item.read ? "bg-emerald-50/40" : ""
                                }`}
                            >
                                <div
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getIconBg(
                                        item.type
                                    )}`}
                                >
                                    {getIcon(item.type)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-slate-900 leading-tight">
                                            {item.title}
                                        </p>
                                        {!item.read && (
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {item.message}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>•</span>
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-0.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-[11px] font-medium">
                                            Open <ExternalLink size={11} />
                                        </span>
                                    </div>
                                </div>

                                {/* Row Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0 self-center">
                                    {!item.read && (
                                        <button
                                            onClick={(e) => handleMarkAsRead(e, item._id)}
                                            title="Mark as read"
                                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                        >
                                            <CheckCheck size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        title="Delete notification"
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-center text-[11px] text-slate-400">
                    Click any notification to navigate directly to its related report or claim
                </div>
            </aside>
        </div>
    );
}

