import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Search,
    PackageCheck,
    ClipboardList,
    Tags,
    MapPin,
    Flag,
    Activity,
    LogOut,
    X,
} from "lucide-react";

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
    onOpenNotifications?: () => void;
}

const navigation = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Lost Items", path: "/admin/lost-items", icon: Search },
    { name: "Found Items", path: "/admin/found-items", icon: PackageCheck },
    { name: "Claims", path: "/admin/claims", icon: ClipboardList },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Locations", path: "/admin/locations", icon: MapPin },
    { name: "Abuse Reports", path: "/admin/abuse-reports", icon: Flag },
    { name: "Activity Logs", path: "/admin/activity-logs", icon: Activity },
];

export default function AdminSidebar({
    open,
    onClose,
}: AdminSidebarProps) {
    const navigate = useNavigate();

    // Lock body scroll when menu is active
    useEffect(() => {
        if (open) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
        return () => document.body.classList.remove("sidebar-open");
    }, [open]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("findback_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("findback_user");
        localStorage.removeItem("token");
        localStorage.removeItem("findback_token");
        localStorage.removeItem("user");
        localStorage.removeItem("findback_user");
        navigate("/login");
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/40 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300 ease-out ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/*
              Menu Container:
              Does NOT slide in from the side (no translate-x).
              Instead, smoothly fades in from top to bottom with clean vertical alignment.
              Completely removes the scrollbar track section shown in the screenshot.
            */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Admin Navigation Menu"
                className={`fixed left-4 sm:left-6 top-18 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white/85 dark:bg-[#181A20]/85 backdrop-blur-[14px] text-[#111827] dark:text-[#F3F4F6] border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 shadow-2xl shadow-black/40 transition-all duration-250 ease-out overflow-hidden ${
                    open
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
                {/* Header with Title & Close button */}
                <div className="flex h-12 items-center justify-between px-4 border-b border-[#E2E8F0] dark:border-[#2A2D35] bg-slate-50/70 dark:bg-[#181A20]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                        Navigation Menu
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-200/60 dark:hover:bg-[#2A2D35] hover:text-[#111827] dark:hover:text-[#F3F4F6] transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/*
                  Vertical Navigation Stack:
                  Items appear vertically from top to bottom one after another,
                  with a smooth staggered sequential animation.
                */}
                <nav className="p-2 space-y-1">
                    {navigation.map(({ name, path, icon: Icon }, index) => {
                        // Sequential top-to-bottom staggered animation delay
                        const delayMs = open ? index * 35 : 0;

                        return (
                            <div
                                key={path}
                                style={{
                                    transitionDelay: `${delayMs}ms`,
                                    transform: open ? "translateY(0)" : "translateY(-10px)",
                                    opacity: open ? 1 : 0,
                                }}
                                className="transition-all duration-250 ease-out"
                            >
                                <NavLink
                                    to={path}
                                    end={path === "/admin"}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                            isActive
                                                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                                                : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div
                                                className={`rounded-lg p-0.5 transition-colors ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-[#6B7280] dark:text-[#9CA3AF] group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                                }`}
                                            >
                                                <Icon size={17} />
                                            </div>
                                            <span>{name}</span>
                                        </>
                                    )}
                                </NavLink>
                            </div>
                        );
                    })}
                </nav>

                {/* Sign Out Option at Bottom with sequential delay */}
                <div
                    style={{
                        transitionDelay: open ? `${navigation.length * 35}ms` : "0ms",
                        transform: open ? "translateY(0)" : "translateY(-10px)",
                        opacity: open ? 1 : 0,
                    }}
                    className="p-2 border-t border-[#E2E8F0] dark:border-[#2A2D35] bg-slate-50/50 dark:bg-[#181A20]/60 transition-all duration-250 ease-out"
                >
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
