
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Search,
    Clock3,
    Package,
    FileText,
    ShieldCheck,
    AlertCircle,
    X,
    Inbox,
    ArrowRight,
} from "lucide-react";

type NotificationType = "Claim" | "Report" | "Item" | "System";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    date: string;
    time: string;
    isRead: boolean;
    link: string;
}

const sampleNotifications: Notification[] = [
    {
        id: 1,
        title: "Claim Approved",
        message:
            "Your claim for the lost laptop has been approved. You can now check the claim details.",
        type: "Claim",
        date: "Nov 04, 2026",
        time: "09:30 AM",
        isRead: false,
        link: "/student/my-claims",
    },
    {
        id: 2,
        title: "Report Reviewed",
        message:
            "Your lost phone report has been reviewed by the administrator.",
        type: "Report",
        date: "Nov 03, 2026",
        time: "02:15 PM",
        isRead: false,
        link: "/student/my-reports",
    },
    {
        id: 3,
        title: "New Found Item",
        message:
            "A new found item has been reported. Check whether it belongs to you.",
        type: "Item",
        date: "Nov 02, 2026",
        time: "11:20 AM",
        isRead: true,
        link: "/found-items",
    },
    {
        id: 4,
        title: "Claim Rejected",
        message:
            "Your claim for the student ID card was rejected. Check your claim for more information.",
        type: "Claim",
        date: "Nov 01, 2026",
        time: "10:45 AM",
        isRead: true,
        link: "/student/my-claims",
    },
    {
        id: 5,
        title: "Welcome to FindBack",
        message:
            "Welcome to FindBack! You can now report lost items and help others find their belongings.",
        type: "System",
        date: "Oct 30, 2026",
        time: "08:00 AM",
        isRead: true,
        link: "/",
    },
];

type FilterType = "All" | "Unread" | "Read";

const Notifications = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] =
        useState<Notification[]>(sampleNotifications);

    const [activeFilter, setActiveFilter] =
        useState<FilterType>("All");

    const [searchTerm, setSearchTerm] = useState("");
    const [showClearConfirmation, setShowClearConfirmation] =
        useState(false);

    // Calculate notification statistics
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const readCount = notifications.length - unreadCount;

    // Filter and search notifications
    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Unread" && !notification.isRead) ||
                (activeFilter === "Read" && notification.isRead);

            const matchesSearch =
                notification.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                notification.message
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [notifications, activeFilter, searchTerm]);

    // Mark one notification as read
    const markAsRead = (id: number) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                isRead: true,
            }))
        );
    };

    // Delete one notification
    const deleteNotification = (id: number) => {
        setNotifications((previous) =>
            previous.filter((notification) => notification.id !== id)
        );
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setShowClearConfirmation(false);
    };

    // Open the related page and mark notification as read
    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        navigate(notification.link);
    };

    // Notification icons
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "Claim":
                return <ShieldCheck size={21} />;

            case "Report":
                return <FileText size={21} />;

            case "Item":
                return <Package size={21} />;

            case "System":
                return <Bell size={21} />;

            default:
                return <AlertCircle size={21} />;
        }
    };

    // Notification icon background colors
    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case "Claim":
                return "bg-[#E2EBDF] text-[#2D5A46]";

            case "Report":
                return "bg-[#E8EDE6] text-[#526F59]";

            case "Item":
                return "bg-[#F0EDE2] text-[#8A7545]";

            case "System":
                return "bg-[#E8EAE5] text-[#657568]";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F0] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D5A46] text-white">
                                <Bell size={22} />
                            </div>

                            <h1 className="text-2xl font-bold text-[#1A362B] sm:text-3xl">
                                Notifications
                            </h1>
                        </div>

                        <p className="text-sm text-[#718276]">
                            Stay updated on your reports, claims, and found items.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex items-center justify-center gap-2 rounded-lg border border-[#C9D7C9] bg-white px-4 py-2.5 text-sm font-semibold text-[#2D5A46] transition hover:bg-[#E9F0E6] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CheckCheck size={17} />
                            Mark All as Read
                        </button>

                        <button
                            onClick={() => setShowClearConfirmation(true)}
                            disabled={notifications.length === 0}
                            className="flex items-center justify-center gap-2 rounded-lg bg-[#2D5A46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A362B] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Trash2 size={17} />
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E2E9DE] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#718276]">
                                    Total Notifications
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#1A362B]">
                                    {notifications.length}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-[#E9F0E6] p-3 text-[#2D5A46]">
                                <Bell size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E2E9DE] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#718276]">
                                    Unread Notifications
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#2D5A46]">
                                    {unreadCount}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-[#E2EBDF] p-3 text-[#2D5A46]">
                                <AlertCircle size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E2E9DE] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#718276]">
                                    Read Notifications
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#1A362B]">
                                    {readCount}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-[#E8EDE6] p-3 text-[#526F59]">
                                <CheckCheck size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-5 flex flex-col justify-between gap-4 rounded-xl border border-[#E2E9DE] bg-white p-4 shadow-sm md:flex-row md:items-center">
                    <div className="relative w-full md:max-w-sm">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849187]"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border border-[#DCE5D9] bg-[#F9FAF7] py-2.5 pl-10 pr-4 text-sm text-[#1A362B] outline-none transition focus:border-[#2D5A46] focus:ring-2 focus:ring-[#2D5A46]/10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(["All", "Unread", "Read"] as FilterType[]).map(
                            (filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === filter
                                            ? "bg-[#2D5A46] text-white shadow-sm"
                                            : "bg-[#F0F3ED] text-[#718276] hover:bg-[#E2EBDF] hover:text-[#2D5A46]"
                                        }`}
                                >
                                    {filter}

                                    {filter === "Unread" && (
                                        <span className="ml-2">
                                            ({unreadCount})
                                        </span>
                                    )}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Notification List */}
                <div className="overflow-hidden rounded-xl border border-[#E2E9DE] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#E8EDE6] px-5 py-4">
                        <h2 className="font-bold text-[#1A362B]">
                            Recent Notifications
                        </h2>

                        <span className="text-xs text-[#849187]">
                            {filteredNotifications.length} notification(s)
                        </span>
                    </div>

                    {filteredNotifications.length > 0 ? (
                        <div>
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    role="link"
                                    tabIndex={0}
                                    aria-label={`Open ${notification.title}`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleNotificationClick(notification);
                                        }
                                    }}
                                    className={`group relative flex cursor-pointer flex-col gap-4 border-b border-[#EDF0EA] p-5 transition-all duration-200 last:border-b-0 hover:bg-[#F4F7F1] sm:flex-row sm:items-center ${!notification.isRead
                                            ? "bg-[#F8FAF6]"
                                            : "bg-white"
                                        }`}
                                >
                                    {/* Unread Indicator */}
                                    {!notification.isRead && (
                                        <span className="absolute left-0 top-0 h-full w-1 bg-[#2D5A46]" />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getNotificationColor(
                                            notification.type
                                        )}`}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Notification Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h3
                                                className={`text-sm ${notification.isRead
                                                        ? "font-semibold text-[#405348]"
                                                        : "font-bold text-[#1A362B]"
                                                    }`}
                                            >
                                                {notification.title}
                                            </h3>

                                            {!notification.isRead && (
                                                <span className="rounded-full bg-[#E2EBDF] px-2 py-0.5 text-[10px] font-bold text-[#2D5A46]">
                                                    NEW
                                                </span>
                                            )}

                                            <span className="rounded-full bg-[#F0F3ED] px-2.5 py-0.5 text-[10px] font-semibold text-[#718276]">
                                                {notification.type}
                                            </span>
                                        </div>

                                        <p className="max-w-3xl text-sm leading-6 text-[#718276]">
                                            {notification.message}
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 text-xs text-[#849187]">
                                            <Clock3 size={13} />
                                            <span>{notification.date}</span>
                                            <span>•</span>
                                            <span>{notification.time}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-2 sm:ml-3">
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                title="Mark as read"
                                                className="flex items-center gap-1.5 rounded-lg border border-[#C9D7C9] bg-white px-3 py-2 text-xs font-semibold text-[#2D5A46] transition hover:bg-[#E2EBDF]"
                                            >
                                                <Check size={15} />
                                                <span>Mark Read</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            title="Delete notification"
                                            aria-label="Delete notification"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9A756D] transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={17} />
                                        </button>

                                        <ArrowRight
                                            size={17}
                                            className="hidden text-[#849187] transition-transform group-hover:translate-x-1 group-hover:text-[#2D5A46] sm:block"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F0E6] text-[#2D5A46]">
                                <Inbox size={30} />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-[#1A362B]">
                                {notifications.length === 0
                                    ? "No Notifications"
                                    : "No Matching Notifications"}
                            </h3>

                            <p className="max-w-sm text-sm leading-6 text-[#849187]">
                                {notifications.length === 0
                                    ? "You are all caught up. New notifications will appear here."
                                    : "We couldn't find any notifications matching your search or selected filter."}
                            </p>

                            {notifications.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveFilter("All");
                                    }}
                                    className="mt-4 rounded-lg bg-[#2D5A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A362B]"
                                >
                                    Show All Notifications
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Clear All Confirmation Modal */}
            {showClearConfirmation && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A362B]/50 px-4 backdrop-blur-sm"
                    onClick={() => setShowClearConfirmation(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md animate-[modalIn_0.2s_ease-out] rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                <Trash2 size={23} />
                            </div>

                            <button
                                onClick={() => setShowClearConfirmation(false)}
                                className="rounded-lg p-2 text-[#849187] transition hover:bg-[#F0F3ED] hover:text-[#1A362B]"
                                aria-label="Close confirmation"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-[#1A362B]">
                            Clear All Notifications?
                        </h3>

                        <p className="mb-6 text-sm leading-6 text-[#718276]">
                            Are you sure you want to delete all your notifications?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowClearConfirmation(false)}
                                className="rounded-lg border border-[#DCE5D9] px-5 py-2.5 text-sm font-semibold text-[#526F59] transition hover:bg-[#F0F3ED]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={clearAllNotifications}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Yes, Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Notifications;
