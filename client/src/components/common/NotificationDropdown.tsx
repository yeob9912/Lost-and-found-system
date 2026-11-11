import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    AppNotification,
} from "../../services/notificationService";

interface NotificationDropdownProps {
    role?: "student" | "admin";
    align?: "right" | "left";
    buttonClassName?: string;
    iconSize?: number;
}

export default function NotificationDropdown({
    role = "student",
    align = "right",
    buttonClassName,
    iconSize = 20,
}: NotificationDropdownProps) {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = () => {
        const list = getNotifications(role);
        setNotifications(list);
        setUnreadCount(getUnreadNotificationsCount(role));
    };

    useEffect(() => {
        loadNotifications();

        const handleUpdate = () => {
            loadNotifications();
        };

        window.addEventListener("notifications_updated", handleUpdate);
        window.addEventListener("storage", handleUpdate);

        return () => {
            window.removeEventListener("notifications_updated", handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, [role]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleMarkAsRead = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const updated = markNotificationAsRead(id, role);
        setNotifications(updated);
        setUnreadCount(updated.filter((n) => !n.isRead).length);
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = markAllNotificationsAsRead(role);
        setNotifications(updated);
        setUnreadCount(0);
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const updated = deleteNotification(id, role);
        setNotifications(updated);
        setUnreadCount(updated.filter((n) => !n.isRead).length);
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = clearAllNotifications(role);
        setNotifications(updated);
        setUnreadCount(0);
    };

    const handleItemClick = (notif: AppNotification) => {
        if (!notif.isRead) {
            markNotificationAsRead(notif.id, role);
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const alignmentClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Open notifications"
                aria-expanded={isOpen}
                className={
                    buttonClassName ||
                    "relative flex h-9 w-9 items-center justify-center rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#2A2D35] active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none"
                }
            >
                <Bell size={iconSize} className="transition-transform hover:scale-110 duration-200" />
                {unreadCount > 0 && (
                    <span
                        style={{ minWidth: "16px", height: "16px" }}
                        className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white shadow-xs ring-2 ring-white dark:ring-[#181A20] animate-pulse"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu Container */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Notifications Dropdown"
                    className={`absolute ${alignmentClass} mt-2.5 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200/80 dark:border-[#2A2D35]/80 bg-white/95 dark:bg-[#181A20]/95 backdrop-blur-[14px] shadow-2xl shadow-black/25 dark:shadow-black/50 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col`}
                    style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-gray-100 dark:border-[#2A2D35] px-5 py-4 bg-white/50 dark:bg-[#181A20]/50 rounded-t-2xl">
                        <div className="flex items-center gap-2.5">
                            <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-base font-bold text-gray-900 dark:text-[#F3F4F6] tracking-tight">
                                Notifications
                            </span>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition hover:underline cursor-pointer"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Scrollable Items List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#2A2D35] min-h-0">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-sm text-gray-400 dark:text-[#6B7280]">
                                <Bell className="mx-auto h-8 w-8 text-gray-300 dark:text-[#3B3E48] mb-2 stroke-[1.5]" />
                                <p className="font-medium text-gray-600 dark:text-[#9CA3AF]">No notifications</p>
                                <p className="text-xs text-gray-400 dark:text-[#6B7280] mt-0.5">
                                    You're all caught up!
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleItemClick(notif)}
                                    className={`group relative flex items-start justify-between gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                                        !notif.isRead
                                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40"
                                            : "hover:bg-gray-50/80 dark:hover:bg-[#20232B]/80"
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            {!notif.isRead && (
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                                            )}
                                            <p
                                                className={`text-sm font-bold ${
                                                    !notif.isRead
                                                        ? "text-gray-900 dark:text-[#F3F4F6]"
                                                        : "text-gray-700 dark:text-[#9CA3AF]"
                                                }`}
                                            >
                                                {notif.title}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600 dark:text-[#9CA3AF] leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <p className="mt-1.5 text-[11px] text-gray-400 dark:text-[#6B7280] font-medium">
                                            {notif.date} · {notif.time}
                                        </p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                        {!notif.isRead && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleMarkAsRead(e, notif.id)}
                                                title="Mark as read"
                                                className="rounded-lg p-1 text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, notif.id)}
                                            title="Delete notification"
                                            className="rounded-lg p-1 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer: Clear All */}
                    <div className="shrink-0 border-t border-gray-100 dark:border-[#2A2D35] px-4 py-3 bg-white/50 dark:bg-[#181A20]/50 text-center rounded-b-2xl">
                        <button
                            type="button"
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline cursor-pointer"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

