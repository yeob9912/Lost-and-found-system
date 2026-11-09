import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, getToken } from "../../services/authService";

interface AdminGuardProps {
    children: React.ReactNode;
}

const API_BASE = "http://localhost:5000/api";

export default function AdminGuard({ children }: AdminGuardProps) {
    const location = useLocation();
    const [checked, setChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const verifyAdminStatus = async () => {
            const token = getToken();
            const localUser = getCurrentUser();

            // Unauthenticated visitor -> immediately reject
            if (!token) {
                if (isMounted) {
                    setAuthorized(false);
                    setChecked(true);
                }
                return;
            }

            try {
                // Verify with backend against live database record
                const res = await fetch(`${API_BASE}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    const liveUser = data.user;

                    if (liveUser && liveUser.role === "admin") {
                        // Persist verified admin role to session and local storage
                        sessionStorage.setItem("findback_user", JSON.stringify(liveUser));
                        sessionStorage.setItem("user", JSON.stringify(liveUser));
                        localStorage.setItem("findback_user", JSON.stringify(liveUser));
                        localStorage.setItem("user", JSON.stringify(liveUser));

                        if (isMounted) {
                            setAuthorized(true);
                            setChecked(true);
                        }
                        return;
                    }
                }
            } catch {
                // If network/server check is unreachable, fallback to local cached role
                if (localUser && localUser.role === "admin") {
                    if (isMounted) {
                        setAuthorized(true);
                        setChecked(true);
                    }
                    return;
                }
            }

            // User is either not authenticated or not an admin
            if (isMounted) {
                setAuthorized(false);
                setChecked(true);
            }
        };

        verifyAdminStatus();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (!checked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0D0E12] text-[#6B7280] dark:text-[#9CA3AF]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                    <p className="text-sm font-medium">Verifying administrator authorization...</p>
                </div>
            </div>
        );
    }

    if (!authorized) {
        // Strict RBAC: Non-admin users and unauthenticated visitors cannot access admin pages
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname, unauthorized: true, message: "Administrator privileges required to access this area." }}
            />
        );
    }

    return <>{children}</>;
}

