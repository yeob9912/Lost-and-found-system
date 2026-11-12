import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../../services/authService";

interface GuestOnlyRouteProps {
    children: React.ReactNode;
    allowStudent?: boolean;
}

const API_BASE = "http://localhost:5000/api";

/**
 * Route guard for public/guest and student pages:
 * - If user is logged in as "admin" -> redirect directly to "/admin"
 * - If user is logged in as "student":
 *     - If allowStudent is true -> allow student to view page (e.g. Home, Lost/Found items, About, Contact)
 *     - If allowStudent is false -> redirect to "/" (for auth pages like /login, /signup)
 * - If user is NOT logged in -> display page
 */
export default function GuestOnlyRoute({ children, allowStudent = false }: GuestOnlyRouteProps) {
    const localUser = getCurrentUser();
    const token = getToken();

    const initialRole = localUser?.role ? String(localUser.role).trim().toLowerCase() : null;

    const [checked, setChecked] = useState(!token && !localUser);
    const [targetRedirect, setTargetRedirect] = useState<string | null>(() => {
        if (!token && !localUser) return null;
        if (initialRole === "admin") return "/admin";
        if (initialRole === "student") return allowStudent ? null : "/";
        return null;
    });

    useEffect(() => {
        let isMounted = true;

        const verifyUser = async () => {
            const currentToken = getToken();
            const currentLocalUser = getCurrentUser();

            // Completely unauthenticated -> allowed to see guest page
            if (!currentToken && !currentLocalUser) {
                if (isMounted) {
                    setTargetRedirect(null);
                    setChecked(true);
                }
                return;
            }

            try {
                if (currentToken) {
                    const res = await fetch(`${API_BASE}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${currentToken}`,
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const liveUser = data.user;
                        if (liveUser) {
                            const liveRole = String(liveUser.role || "").trim().toLowerCase();

                            // Sync fresh cache
                            sessionStorage.setItem("findback_user", JSON.stringify(liveUser));
                            sessionStorage.setItem("user", JSON.stringify(liveUser));
                            localStorage.setItem("findback_user", JSON.stringify(liveUser));
                            localStorage.setItem("user", JSON.stringify(liveUser));

                            if (isMounted) {
                                if (liveRole === "admin") {
                                    setTargetRedirect("/admin");
                                } else if (liveRole === "student") {
                                    setTargetRedirect(allowStudent ? null : "/");
                                } else {
                                    setTargetRedirect(null);
                                }
                                setChecked(true);
                            }
                            return;
                        }
                    }
                }
            } catch {
                // Fallback to cached role
                if (currentLocalUser) {
                    const cachedRole = String(currentLocalUser.role || "").trim().toLowerCase();
                    if (isMounted) {
                        if (cachedRole === "admin") {
                            setTargetRedirect("/admin");
                        } else if (cachedRole === "student") {
                            setTargetRedirect(allowStudent ? null : "/");
                        } else {
                            setTargetRedirect(null);
                        }
                        setChecked(true);
                    }
                    return;
                }
            }

            if (currentLocalUser) {
                const cachedRole = String(currentLocalUser.role || "").trim().toLowerCase();
                if (isMounted) {
                    if (cachedRole === "admin") {
                        setTargetRedirect("/admin");
                    } else if (cachedRole === "student") {
                        setTargetRedirect(allowStudent ? null : "/");
                    } else {
                        setTargetRedirect(null);
                    }
                    setChecked(true);
                }
                return;
            }

            if (isMounted) {
                setTargetRedirect(null);
                setChecked(true);
            }
        };

        verifyUser();

        return () => {
            isMounted = false;
        };
    }, [allowStudent]);

    if (!checked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0D0E12] text-[#6B7280] dark:text-[#9CA3AF]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                    <p className="text-sm font-medium">Loading FindBack...</p>
                </div>
            </div>
        );
    }

    if (targetRedirect) {
        return <Navigate to={targetRedirect} replace />;
    }

    return <>{children}</>;
}

