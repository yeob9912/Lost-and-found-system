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

    // Lock body scroll when sidebar is open to prevent page scrollbar peeking through
    useEffect(() => {
        if (open) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
        return () => document.body.classList.remove("sidebar-open");
    }, [open]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("findback_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("findback_user");
        navigate("/login");
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-200 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Clean Off-canvas Navigation Drawer with Light & Dark support */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col bg-white dark:bg-[#181A20] text-[#111827] dark:text-[#F3F4F6] border-r border-[#E2E8F0] dark:border-[#2A2D35] shadow-2xl transition-transform duration-250 ease-out overflow-hidden ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header: Close button only */}
                <div className="flex h-14 items-center justify-between px-5 border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                        Admin Menu
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2A2D35] hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Vertical Navigation Items Stack */}
                <nav
                    className="flex-1 py-3 px-3 space-y-1 overflow-y-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {navigation.map(({ name, path, icon: Icon }, index) => (
                        <div
                            key={path}
                            style={{
                                transitionDelay: open ? `${index * 30}ms` : "0ms",
                                transform: open ? "translateX(0)" : "translateX(-16px)",
                                opacity: open ? 1 : 0,
                            }}
                            className="transition-all duration-200 ease-out"
                        >
                            <NavLink
                                to={path}
                                end={path === "/admin"}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold"
                                            : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={`rounded-lg p-1 transition-colors ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <span>{name}</span>
                                    </>
                                )}
                            </NavLink>
                        </div>
                    ))}
                </nav>

                {/* Sign Out Option at Bottom */}
                <div className="p-3 border-t border-[#E2E8F0] dark:border-[#2A2D35] bg-slate-50/50 dark:bg-[#181A20]/50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                        <LogOut size={17} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
