export type NotificationType = "Claim" | "Report" | "Item" | "System";

export interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    date: string;
    time: string;
    isRead: boolean;
    link: string;
}

const defaultStudentNotifications: AppNotification[] = [
    {
        id: 1,
        title: "Claim Approved",
        message: "Your claim for the lost laptop has been approved. You can now check the claim details.",
        type: "Claim",
        date: "Nov 04, 2026",
        time: "09:30 AM",
        isRead: false,
        link: "/student/my-claims",
    },
    {
        id: 2,
        title: "Report Reviewed",
        message: "Your lost phone report has been reviewed by the administrator.",
        type: "Report",
        date: "Nov 03, 2026",
        time: "02:15 PM",
        isRead: false,
        link: "/student/my-reports",
    },
    {
        id: 3,
        title: "New Found Item",
        message: "A new found item has been reported. Check whether it belongs to you.",
        type: "Item",
        date: "Nov 02, 2026",
        time: "11:20 AM",
        isRead: true,
        link: "/found-items",
    },
    {
        id: 4,
        title: "Claim Rejected",
        message: "Your claim for the student ID card was rejected. Check your claim for more information.",
        type: "Claim",
        date: "Nov 01, 2026",
        time: "10:45 AM",
        isRead: true,
        link: "/student/my-claims",
    },
    {
        id: 5,
        title: "Welcome to FindBack",
        message: "Welcome to FindBack! You can now report lost items and help others find their belongings.",
        type: "System",
        date: "Oct 30, 2026",
        time: "08:00 AM",
        isRead: true,
        link: "/",
    },
];

const defaultAdminNotifications: AppNotification[] = [
    {
        id: 101,
        title: "New Ownership Claim",
        message: "A student submitted a new claim for 'HP Pavilion Laptop'. Requires administrator review.",
        type: "Claim",
        date: "Nov 11, 2026",
        time: "10:15 AM",
        isRead: false,
        link: "/admin/claims",
    },
    {
        id: 102,
        title: "Lost Item Report Submitted",
        message: "New lost report 'TI-84 Plus Calculator' submitted and is pending verification.",
        type: "Report",
        date: "Nov 11, 2026",
        time: "08:45 AM",
        isRead: false,
        link: "/admin/lost-items",
    },
    {
        id: 103,
        title: "Found Belonging Turned In",
        message: "A found item 'Brown Leather Wallet' turned in at Science Building Central Office.",
        type: "Item",
        date: "Nov 10, 2026",
        time: "03:30 PM",
        isRead: false,
        link: "/admin/found-items",
    },
    {
        id: 104,
        title: "Abuse Investigation Required",
        message: "A false claim was flagged on 'AirPods Pro 2nd Gen'. Immediate moderation requested.",
        type: "System",
        date: "Nov 09, 2026",
        time: "01:20 PM",
        isRead: true,
        link: "/admin/abuse-reports",
    },
    {
        id: 105,
        title: "User Role Assignment",
        message: "User account 'Daniel Bekele' was promoted to Administrator privilege level.",
        type: "System",
        date: "Nov 08, 2026",
        time: "11:00 AM",
        isRead: true,
        link: "/admin/users",
    },
];

const getStorageKey = (role: "student" | "admin" = "student"): string => {
    return role === "admin" ? "findback_admin_notifications" : "findback_notifications";
};

const getDefaultList = (role: "student" | "admin" = "student"): AppNotification[] => {
    return role === "admin" ? defaultAdminNotifications : defaultStudentNotifications;
};

export const getNotifications = (role: "student" | "admin" = "student"): AppNotification[] => {
    const key = getStorageKey(role);
    const defaults = getDefaultList(role);
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch {
        // Fallback on storage errors
    }
    try {
        localStorage.setItem(key, JSON.stringify(defaults));
    } catch {}
    return defaults;
};

export const getUnreadNotificationsCount = (role: "student" | "admin" = "student"): number => {
    const list = getNotifications(role);
    return list.filter((n) => !n.isRead).length;
};

export const markNotificationAsRead = (
    id: number,
    role: "student" | "admin" = "student"
): AppNotification[] => {
    const key = getStorageKey(role);
    const list = getNotifications(role).map((n) =>
        n.id === id ? { ...n, isRead: true } : n
    );
    try {
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { role } }));
    } catch {}
    return list;
};

export const markAllNotificationsAsRead = (
    role: "student" | "admin" = "student"
): AppNotification[] => {
    const key = getStorageKey(role);
    const list = getNotifications(role).map((n) => ({ ...n, isRead: true }));
    try {
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { role } }));
    } catch {}
    return list;
};

export const deleteNotification = (
    id: number,
    role: "student" | "admin" = "student"
): AppNotification[] => {
    const key = getStorageKey(role);
    const list = getNotifications(role).filter((n) => n.id !== id);
    try {
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { role } }));
    } catch {}
    return list;
};

export const clearAllNotifications = (
    role: "student" | "admin" = "student"
): AppNotification[] => {
    const key = getStorageKey(role);
    const list: AppNotification[] = [];
    try {
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { role } }));
    } catch {}
    return list;
};
