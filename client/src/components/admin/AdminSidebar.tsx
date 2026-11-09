import { NavLink, useNavigate } from "react-router-dom";
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
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Clean White Off-canvas Navigation Drawer */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col bg-white text-slate-800 border-r border-slate-200/90 shadow-2xl transition-transform duration-250 ease-out ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header: Close button only (Clean matching design) */}
                <div className="flex h-14 items-center justify-between px-5 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Admin Menu
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Vertical Navigation Items Stack (No ugly scrollbar, perfectly fitted) */}
                <nav
                    className="flex-1 overflow-y-auto no-scrollbar py-3 px-3 space-y-1"
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
                                            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={`rounded-lg p-1 transition-colors ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-emerald-600"
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
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut size={17} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
