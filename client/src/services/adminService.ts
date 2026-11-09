const BASE = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || "http://localhost:5000/api";

function getToken(): string {
    return (
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("findback_token") ||
        ""
    );
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    };
}

async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { ...authHeaders(), ...(options?.headers || {}) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

// ─── Admin Stats ─────────────────────────────────────────────────────────────
export const fetchAdminStats = () => apiFetch("/admin/stats");

// ─── Users ───────────────────────────────────────────────────────────────────
export const fetchUsers = (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/admin/users${qs}`);
};
export const updateUserRole = (id: string, role: string) =>
    apiFetch(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
export const deleteUser = (id: string) =>
    apiFetch(`/admin/users/${id}`, { method: "DELETE" });

// ─── Lost Items ───────────────────────────────────────────────────────────────
export const fetchAdminLostItems = (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/lost-items/admin/reports${qs}`);
};
export const approveLostItem = (id: string) =>
    apiFetch(`/lost-items/admin/${id}/approve`, { method: "PATCH" });
export const rejectLostItem = (id: string, reason: string) =>
    apiFetch(`/lost-items/admin/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
    });
export const confirmLostReturn = (id: string) =>
    apiFetch(`/lost-items/admin/${id}/confirm-return`, { method: "PATCH" });

// ─── Found Items ──────────────────────────────────────────────────────────────
export const fetchAdminFoundItems = (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/found-items/admin/reports${qs}`);
};
export const approveFoundItem = (id: string) =>
    apiFetch(`/found-items/admin/${id}/approve`, { method: "PATCH" });
export const rejectFoundItem = (id: string, reason: string) =>
    apiFetch(`/found-items/admin/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
    });
export const confirmFoundReturn = (id: string) =>
    apiFetch(`/found-items/admin/${id}/confirm-return`, { method: "PATCH" });

// ─── Claims ───────────────────────────────────────────────────────────────────
export const fetchAdminClaims = (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/claims/admin/all${qs}`);
};
export const approveClaim = (id: string) =>
    apiFetch(`/claims/admin/${id}/approve`, { method: "PATCH" });
export const rejectClaim = (id: string) =>
    apiFetch(`/claims/admin/${id}/reject`, { method: "PATCH" });
export const requestVerification = (id: string) =>
    apiFetch(`/claims/admin/${id}/request-verification`, { method: "PATCH" });
export const completeClaim = (id: string) =>
    apiFetch(`/claims/admin/${id}/complete`, { method: "PATCH" });

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = () => apiFetch("/notifications");
export const markNotificationRead = (id: string) =>
    apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = () =>
    apiFetch("/notifications/read-all", { method: "PATCH" });
export const deleteNotification = (id: string) =>
    apiFetch(`/notifications/${id}`, { method: "DELETE" });
export const deleteAllNotifications = () =>
    apiFetch("/notifications", { method: "DELETE" });

// ─── Admin Profile & Security ───────────────────────────────────────────────
export const fetchAdminProfile = () => apiFetch("/users/profile");
export const updateAdminProfile = (data: Record<string, unknown>) =>
    apiFetch("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
export const changeAdminPassword = (data: Record<string, string>) =>
    apiFetch("/users/change-password", {
        method: "PATCH",
        body: JSON.stringify(data),
    });


