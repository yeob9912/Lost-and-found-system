import { useState, useEffect } from "react";
import { Menu, Bell, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNotificationOverlay from "./AdminNotificationOverlay";
import { getCurrentUser, getUserProfileImage } from "../../services/authService";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
    const [adminInitials, setAdminInitials] = useState("A");

    const refreshAvatar = () => {
        const user = getCurrentUser();
        const img = getUserProfileImage(user);
        setAvatarImage(img);

        const name = user?.fullName || "Admin";
        const inits = name
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        setAdminInitials(inits || "A");
    };

    useEffect(() => {
        refreshAvatar();

        window.addEventListener("profile_image_updated", refreshAvatar);
        window.addEventListener("storage", refreshAvatar);

        return () => {
            window.removeEventListener("profile_image_updated", refreshAvatar);
            window.removeEventListener("storage", refreshAvatar);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Sliding Drawer Menu (Off-canvas on all screen sizes) */}
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenNotifications={() => setNotificationOpen(true)}
            />

            {/* Notification Drawer Overlay */}
            <AdminNotificationOverlay
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onUnreadCountChange={setUnreadCount}
            />

            {/* Main Content Container */}
            <div className="flex flex-col min-h-screen">
                {/* Top Header Bar (Main Nav) */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-8 shadow-xs">
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Menu Icon Toggle: ONLY the icon, NO rectangle background, NO "menu" text */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open navigation menu"
                            className="flex items-center justify-center p-1.5 text-slate-700 hover:text-emerald-600 active:scale-90 transition-transform duration-200 cursor-pointer focus:outline-none"
                        >
                            <Menu size={26} className="transition-transform hover:scale-110 duration-200" />
                        </button>

                        {/* ASTU Admin Logo & Title on Main Nav Only */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                                    ASTU <span className="text-emerald-600">Admin</span>
                                </h1>
                                <p className="text-[11px] font-medium text-slate-400">
                                    {title || "FindBack System"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Notification Bell Icon: ONLY the icon, NO rectangle background */}
                        <button
                            onClick={() => setNotificationOpen(true)}
                            aria-label="Open Notifications"
                            className="relative flex items-center justify-center p-2 text-slate-600 hover:text-emerald-600 active:scale-90 transition-transform duration-200 cursor-pointer focus:outline-none"
                        >
                            <Bell size={22} className="transition-transform hover:scale-110 duration-200" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs animate-pulse">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Admin Avatar: Clickable to /admin/profile, NO rectangle background, NO text */}
                        <Link
                            to="/admin/profile"
                            title="Admin Profile"
                            className="group relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden shadow-xs ring-2 ring-transparent hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                            {avatarImage ? (
                                <img
                                    src={avatarImage}
                                    alt="Admin Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-emerald-600 font-bold text-xs text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                                    {adminInitials}
                                </div>
                            )}
                        </Link>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
