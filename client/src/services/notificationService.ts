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

const defaultNotifications: AppNotification[] = [
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

const NOTIFICATIONS_STORAGE_KEY = "findback_notifications";

export const getNotifications = (): AppNotification[] => {
    try {
        const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch {
        // Fallback on storage errors
    }
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultNotifications));
    } catch {}
    return defaultNotifications;
};

export const getUnreadNotificationsCount = (): number => {
    const list = getNotifications();
    return list.filter((n) => !n.isRead).length;
};

export const markNotificationAsRead = (id: number): AppNotification[] => {
    const list = getNotifications().map((n) =>
        n.id === id ? { ...n, isRead: true } : n
    );
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
    return list;
};

export const markAllNotificationsAsRead = (): AppNotification[] => {
    const list = getNotifications().map((n) => ({ ...n, isRead: true }));
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
    return list;
};

export const deleteNotification = (id: number): AppNotification[] => {
    const list = getNotifications().filter((n) => n.id !== id);
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
    return list;
};

export const clearAllNotifications = (): AppNotification[] => {
    const list: AppNotification[] = [];
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("notifications_updated"));
    } catch {}
    return list;
};

