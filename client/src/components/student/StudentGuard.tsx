import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, getToken } from "../../services/authService";

interface StudentGuardProps {
    children: React.ReactNode;
}

const API_BASE = "http://localhost:5000/api";

/**
 * Strict Role-Based Access Control Guard for Student routes.
 *
 * Rules:
 * - Unauthenticated users are redirected to /login with return state.
 * - Authenticated users with role 'admin' are NOT allowed to access student areas;
 *   they are redirected to /admin.
 * - Authenticated users with role 'student' are granted access.
 * - Live user status is verified with the backend to ensure immediate revocation
 *   if an account is modified or promoted to admin.
 */
export default function StudentGuard({ children }: StudentGuardProps) {
    const location = useLocation();
    const localUser = getCurrentUser();
    const isInitiallyStudent = localUser?.role
        ? String(localUser.role).trim().toLowerCase() === "student"
        : false;

    const [checked, setChecked] = useState(false);
    const [status, setStatus] = useState<"authorized" | "redirect_login" | "redirect_admin">(
        isInitiallyStudent ? "authorized" : "redirect_login"
    );

    useEffect(() => {
        let isMounted = true;

        const verifyStudentStatus = async () => {
            const token = getToken();
            const currentLocalUser = getCurrentUser();

            // Unauthenticated visitor -> redirect to login
            if (!token && !currentLocalUser) {
                if (isMounted) {
                    setStatus("redirect_login");
                    setChecked(true);
                }
                return;
            }

            try {
                // Verify with backend against live database record
                if (token) {
                    const res = await fetch(`${API_BASE}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const liveUser = data.user;

                        if (liveUser) {
                            const liveRole = String(liveUser.role || "").trim().toLowerCase();

                            // Sync latest verified user data to storage
                            sessionStorage.setItem("findback_user", JSON.stringify(liveUser));
                            sessionStorage.setItem("user", JSON.stringify(liveUser));
                            localStorage.setItem("findback_user", JSON.stringify(liveUser));
                            localStorage.setItem("user", JSON.stringify(liveUser));

                            if (isMounted) {
                                if (liveRole === "admin") {
                                    setStatus("redirect_admin");
                                } else if (liveRole === "student") {
                                    setStatus("authorized");
                                } else {
                                    setStatus("redirect_login");
                                }
                                setChecked(true);
                            }
                            return;
                        }
                    }
                }
            } catch {
                // Network error fallback to cached local role
                if (currentLocalUser) {
                    const cachedRole = String(currentLocalUser.role || "").trim().toLowerCase();
                    if (isMounted) {
                        if (cachedRole === "admin") {
                            setStatus("redirect_admin");
                        } else if (cachedRole === "student") {
                            setStatus("authorized");
                        } else {
                            setStatus("redirect_login");
                        }
                        setChecked(true);
                    }
                    return;
                }
            }

            // Fallback from local storage if network request returned non-200
            if (currentLocalUser) {
                const cachedRole = String(currentLocalUser.role || "").trim().toLowerCase();
                if (isMounted) {
                    if (cachedRole === "admin") {
                        setStatus("redirect_admin");
                    } else if (cachedRole === "student") {
                        setStatus("authorized");
                    } else {
                        setStatus("redirect_login");
                    }
                    setChecked(true);
                }
                return;
            }

            if (isMounted) {
                setStatus("redirect_login");
                setChecked(true);
            }
        };

        verifyStudentStatus();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (!checked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0D0E12] text-[#6B7280] dark:text-[#9CA3AF]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                    <p className="text-sm font-medium">Verifying student account authorization...</p>
                </div>
            </div>
        );
    }

    if (status === "redirect_admin") {
        // Admins cannot access student pages; redirect to admin dashboard
        return <Navigate to="/admin" replace />;
    }

    if (status === "redirect_login") {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                    unauthorized: true,
                    message: "Student account required to access this area.",
                }}
            />
        );
    }

    return <>{children}</>;
}

