import { useState, useEffect } from "react";
import { Menu, ShieldCheck, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import NotificationDropdown from "../common/NotificationDropdown";
import { getCurrentUser, getUserProfileImage } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { toggleTheme, isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="min-h-screen bg-[#F8FAFC]/85 dark:bg-[#0D0E12]/85 text-[#111827] dark:text-[#F3F4F6] transition-colors duration-200 relative z-10">
            {/* Sliding Drawer Menu (Off-canvas on all screen sizes) */}
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Container */}
            <div className={`flex flex-col min-h-screen transition-[overflow] duration-200 ${sidebarOpen ? 'overflow-hidden' : ''}`}>
                {/* Top Header Bar (Main Nav with Glassmorphism) */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 bg-white/75 dark:bg-[#181A20]/75 backdrop-blur-[14px] px-4 sm:px-6 md:px-8 shadow-xs transition-colors duration-200">
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Menu Icon Toggle */}
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                            className="flex items-center justify-center p-1.5 text-[#111827] dark:text-[#F3F4F6] hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-90 transition-transform duration-200 cursor-pointer focus:outline-none"
                        >
                            <Menu size={24} className="transition-transform hover:scale-110 duration-200" />
                        </button>

                        {/* FindBack System Logo & Clean Branding (Only "FindBack System", no subtitles/labels) */}
                        <Link to="/admin" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold text-[#111827] dark:text-[#F3F4F6] leading-tight">
                                    FindBack <span className="text-emerald-600 dark:text-emerald-400">System</span>
                                </h1>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle (Light / Dark Mode) */}
                        <button
                            onClick={toggleTheme}
                            aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#2A2D35] active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none"
                        >
                            {isDark ? (
                                <Sun size={19} className="text-amber-400 animate-in spin-in-90 duration-300" />
                            ) : (
                                <Moon size={19} className="text-slate-600 animate-in spin-in-90 duration-300" />
                            )}
                        </button>

                        {/* Notification Bell Dropdown (identical UI and behavior as Student) */}
                        <NotificationDropdown
                            role="admin"
                            iconSize={20}
                        />

                        {/* Admin Avatar Link */}
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

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
