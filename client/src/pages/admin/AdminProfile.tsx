import { useState, useEffect, useRef } from "react";
import {
    Camera,
    Shield,
    ShieldCheck,
    Mail,
    Phone,
    Building2,
    Lock,
    Save,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    LogOut,
    IdCard,
    User as UserIcon,
    Calendar,
    KeyRound,
    Sparkles,
    Check,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    fetchAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
} from "../../services/adminService";
import {
    getCurrentUser,
    getUserProfileImage,
    setUserProfileImage,
    logoutUser,
} from "../../services/authService";

interface ProfileData {
    fullName: string;
    email: string;
    studentId: string;
    phone: string;
    department: string;
    role: string;
    profileImage?: string;
    createdAt?: string;
}

export default function AdminProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<ProfileData>({
        fullName: "",
        email: "",
        studentId: "",
        phone: "",
        department: "",
        role: "admin",
        profileImage: "",
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "security" | "permissions">("general");

    // Success / Error feedback banner
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Password change fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const showMsg = (type: "success" | "error", message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4500);
    };

    const loadProfileData = async () => {
        setLoading(true);
        try {
            // First read cached user for immediate rendering
            const cached = getCurrentUser();
            if (cached) {
                setProfile((prev) => ({
                    ...prev,
                    fullName: cached.fullName || "",
                    email: cached.email || "",
                    studentId: cached.studentId || "",
                    phone: cached.phone || "",
                    department: cached.department || "",
                    role: cached.role || "admin",
                    profileImage: cached.profileImage || "",
                }));
            }

            const localImg = getUserProfileImage(cached);
            if (localImg) {
                setAvatarPreview(localImg);
            }

            // Fetch latest live profile from backend
            const res = await fetchAdminProfile();
            if (res?.user) {
                setProfile({
                    fullName: res.user.fullName || "",
                    email: res.user.email || "",
                    studentId: res.user.studentId || "",
                    phone: res.user.phone || "",
                    department: res.user.department || "",
                    role: res.user.role || "admin",
                    profileImage: res.user.profileImage || "",
                    createdAt: res.user.createdAt,
                });
                if (res.user.profileImage) {
                    setAvatarPreview(res.user.profileImage);
                }
            }
        } catch {
            // Fallback gracefully to cached profile data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    // Handle profile avatar selection with instant MongoDB database sync
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showMsg("error", "Image file size must be less than 3MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            setAvatarPreview(dataUrl);

            try {
                // Instantly sync avatar to backend MongoDB database
                const res = await updateAdminProfile({ profileImage: dataUrl });
                const updatedImage = res?.user?.profileImage || dataUrl;

                setProfile((prev) => ({ ...prev, profileImage: updatedImage }));
                setUserProfileImage(updatedImage);

                window.dispatchEvent(new Event("profile_image_updated"));
                showMsg("success", "Profile image successfully updated and saved to database.");
            } catch (err: unknown) {
                showMsg(
                    "error",
                    err instanceof Error ? err.message : "Failed to save profile picture."
                );
            }
        };
        reader.readAsDataURL(file);
    };

    // Save personal information
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateAdminProfile({
                fullName: profile.fullName,
                phone: profile.phone,
                department: profile.department,
            });

            if (res?.user) {
                setProfile((prev) => ({
                    ...prev,
                    fullName: res.user.fullName || prev.fullName,
                    phone: res.user.phone || prev.phone,
                    department: res.user.department || prev.department,
                }));
            }

            // Sync updated info into local storage
            const current = getCurrentUser();
            if (current) {
                const updatedUser = {
                    ...current,
                    fullName: profile.fullName,
                    phone: profile.phone,
                    department: profile.department,
                };
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                localStorage.setItem("user", JSON.stringify(updatedUser));
                sessionStorage.setItem("findback_user", JSON.stringify(updatedUser));
                localStorage.setItem("findback_user", JSON.stringify(updatedUser));
            }

            window.dispatchEvent(new Event("profile_image_updated"));
            showMsg("success", "Administrative profile details saved successfully.");
        } catch (err: unknown) {
            showMsg(
                "error",
                err instanceof Error ? err.message : "Failed to update profile information."
            );
        } finally {
            setSaving(false);
        }
    };

    // Password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showMsg("error", "Please provide current, new, and confirmation passwords.");
            return;
        }

        if (newPassword.length < 8) {
            showMsg("error", "New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showMsg("error", "New password and confirmation password do not match.");
            return;
        }

        setPasswordLoading(true);
        try {
            await changeAdminPassword({ currentPassword, newPassword });
            showMsg("success", "Password updated successfully! Your account credentials are secured.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            showMsg(
                "error",
                err instanceof Error ? err.message : "Failed to update password. Check your current password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to sign out of the FindBack Admin Command Center?")) {
            logoutUser();
            navigate("/login");
        }
    };

    const initials = (profile.fullName || "Admin")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const formattedDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "Active Session";

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Feedback Notification Toast */}
                {feedback && (
                    <div
                        className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold shadow-lg backdrop-blur-[14px] animate-in fade-in zoom-in-95 duration-200 ${
                            feedback.type === "success"
                                ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/10"
                                : "bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-300 shadow-rose-500/10"
                        }`}
                    >
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={19} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle size={19} className="text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span className="flex-1">{feedback.message}</span>
                    </div>
                )}

                {/* Hero Profile Glass Card */}
                <div className="glass-panel overflow-hidden rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-white/40 dark:border-[#2A2D35]/80">
                    {/* Header Decorative Banner */}
                    <div className="relative h-40 sm:h-48 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/15">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Admin Console Active
                        </div>
                    </div>

                    {/* Profile Summary & Avatar Bar */}
                    <div className="relative px-6 pb-6 pt-0 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-20 sm:-mt-16">
                            {/* Avatar with Camera Overlay */}
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-[#181A20] bg-slate-100 dark:bg-[#0D0E12] shadow-xl overflow-hidden flex items-center justify-center ring-4 ring-emerald-500/20">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={profile.fullName}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-emerald-700 flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Upload new profile photo"
                                    aria-label="Upload profile picture"
                                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-white dark:ring-[#181A20]"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Admin Name & Role Details */}
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                    <h1 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-[#F3F4F6] tracking-tight">
                                        {profile.fullName || "Administrator"}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                                        <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                        System Administrator
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                                    <span className="flex items-center gap-1.5">
                                        <Mail size={14} className="text-emerald-600 dark:text-emerald-400" />
                                        {profile.email || "admin@astu.edu.et"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
                                        Member since {formattedDate}
                                    </span>
                                </div>
                            </div>

                            {/* Header Action Buttons */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={loadProfileData}
                                    title="Reload profile information"
                                    className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 bg-white/60 dark:bg-[#181A20]/60 px-3.5 py-2.5 text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#2A2D35] transition-all cursor-pointer"
                                >
                                    <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
                                    Sync
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/80 dark:bg-rose-950/40 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-xs cursor-pointer"
                                >
                                    <LogOut size={14} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tab Pills */}
                    <div className="flex border-t border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 px-6 sm:px-8 bg-white/40 dark:bg-[#181A20]/40 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "general"
                                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                                    : "border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6]"
                            }`}
                        >
                            <UserIcon size={16} />
                            Personal &amp; Contact Info
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "security"
                                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                                    : "border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6]"
                            }`}
                        >
                            <Lock size={16} />
                            Security &amp; Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("permissions")}
                            className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "permissions"
                                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                                    : "border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6]"
                            }`}
                        >
                            <Shield size={16} />
                            Administrative Privileges
                        </button>
                    </div>
                </div>

                {/* Status Badges / Overview Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="glass-card rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-[#2A2D35]/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                                Role Level
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                                <ShieldCheck size={18} />
                            </div>
                        </div>
                        <h2 className="mt-3 text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">
                            System Administrator
                        </h2>
                        <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            Full institutional read &amp; write governance
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-[#2A2D35]/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                                Authentication
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <KeyRound size={18} />
                            </div>
                        </div>
                        <h2 className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            Verified &amp; Protected
                        </h2>
                        <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            Session token validated against MongoDB
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-[#2A2D35]/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                                Institution
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <Building2 size={18} />
                            </div>
                        </div>
                        <h2 className="mt-3 text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">
                            ASTU Campus
                        </h2>
                        <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            {profile.department || "Administration Office"}
                        </p>
                    </div>
                </div>

                {/* TAB 1: General Profile Information */}
                {activeTab === "general" && (
                    <form
                        onSubmit={handleSaveProfile}
                        className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/10 dark:shadow-black/40 space-y-6 border border-white/40 dark:border-[#2A2D35]/80"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                                <UserIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
                                Personal &amp; Contact Information
                            </h2>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                                Update your administrative identity, campus office department, and telephone contact.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <UserIcon size={16} className="absolute left-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        required
                                        placeholder="Administrator Name"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 pl-10 pr-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Email Address (Institutional SSO)
                                </label>
                                <div className="relative flex items-center">
                                    <Mail size={16} className="absolute left-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full rounded-xl border border-[#E2E8F0]/70 dark:border-[#2A2D35]/70 bg-slate-100/60 dark:bg-[#0D0E12]/50 pl-10 pr-20 py-2.5 text-sm text-[#6B7280] dark:text-[#9CA3AF] outline-none cursor-not-allowed"
                                    />
                                    <span className="absolute right-3 rounded-md bg-slate-200/80 dark:bg-[#2A2D35] px-2 py-0.5 text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF]">
                                        Locked
                                    </span>
                                </div>
                            </div>

                            {/* Administrator / Student ID (Read-only) */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Administrator / University ID
                                </label>
                                <div className="relative flex items-center">
                                    <IdCard size={16} className="absolute left-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={profile.studentId}
                                        disabled
                                        className="w-full rounded-xl border border-[#E2E8F0]/70 dark:border-[#2A2D35]/70 bg-slate-100/60 dark:bg-[#0D0E12]/50 pl-10 pr-20 py-2.5 text-sm font-mono text-[#6B7280] dark:text-[#9CA3AF] outline-none cursor-not-allowed"
                                    />
                                    <span className="absolute right-3 rounded-md bg-slate-200/80 dark:bg-[#2A2D35] px-2 py-0.5 text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF]">
                                        Read-only
                                    </span>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Phone Number
                                </label>
                                <div className="relative flex items-center">
                                    <Phone size={16} className="absolute left-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+251 91 234 5678"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 pl-10 pr-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Department / Office */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Campus Office / Department
                                </label>
                                <div className="relative flex items-center">
                                    <Building2 size={16} className="absolute left-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={profile.department}
                                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                        placeholder="e.g. Student Affairs Directorate / Lost & Found Center"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 pl-10 pr-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || loading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save size={16} />
                                {saving ? "Saving Changes..." : "Save Profile Details"}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 2: Security & Password */}
                {activeTab === "security" && (
                    <form
                        onSubmit={handleChangePassword}
                        className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/10 dark:shadow-black/40 space-y-6 border border-white/40 dark:border-[#2A2D35]/80"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                                <Lock size={20} className="text-emerald-600 dark:text-emerald-400" />
                                Change Administrative Password
                            </h2>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                                Keep your administrative command center account secure by using a strong, unique password.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-lg">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Current Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 px-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        aria-label={showCurrent ? "Hide password" : "Show password"}
                                        className="absolute right-3 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6] cursor-pointer"
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    New Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="At least 8 characters"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 px-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        aria-label={showNew ? "Hide password" : "Show password"}
                                        className="absolute right-3 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6] cursor-pointer"
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-[#F3F4F6] mb-1.5">
                                    Confirm New Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Repeat new password"
                                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white/70 dark:bg-[#0D0E12]/70 px-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        aria-label={showConfirm ? "Hide password" : "Show password"}
                                        className="absolute right-3 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F3F4F6] cursor-pointer"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Checklist indicator */}
                            <div className="rounded-2xl bg-slate-50 dark:bg-[#0D0E12]/50 p-4 border border-[#E2E8F0]/70 dark:border-[#2A2D35]/70 text-xs space-y-1.5">
                                <p className="font-bold text-[#111827] dark:text-[#F3F4F6]">Security Requirements:</p>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                                            newPassword.length >= 8
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                                        }`}
                                    >
                                        <Check size={10} />
                                    </span>
                                    <span className={newPassword.length >= 8 ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-[#6B7280] dark:text-[#9CA3AF]"}>
                                        Minimum 8 characters length
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                                            newPassword && newPassword === confirmPassword
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                                        }`}
                                    >
                                        <Check size={10} />
                                    </span>
                                    <span
                                        className={
                                            newPassword && newPassword === confirmPassword
                                                ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                                : "text-[#6B7280] dark:text-[#9CA3AF]"
                                        }
                                    >
                                        Confirmation password matches
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-[#E2E8F0]/80 dark:border-[#2A2D35]/80 flex justify-end">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Lock size={16} />
                                {passwordLoading ? "Updating Credentials..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 3: Permissions & System Privileges */}
                {activeTab === "permissions" && (
                    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/10 dark:shadow-black/40 space-y-6 border border-white/40 dark:border-[#2A2D35]/80">
                        <div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                                <Sparkles size={20} className="text-emerald-600 dark:text-emerald-400" />
                                Granted Administrative Capabilities
                            </h2>
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                                Your account is granted full administrator rights across all modules within the FindBack platform.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                {
                                    title: "User Governance & Role Promotion",
                                    desc: "Promote students to administrators, manage credentials, and remove accounts.",
                                    status: "Active",
                                },
                                {
                                    title: "Lost Item Verification",
                                    desc: "Moderate, verify, approve, or reject lost item reports campus-wide.",
                                    status: "Active",
                                },
                                {
                                    title: "Found Inventory Custody",
                                    desc: "Manage turned-in belongings, assign drop-off zones, confirm returns.",
                                    status: "Active",
                                },
                                {
                                    title: "Claim Dispute Resolution",
                                    desc: "Review proof of ownership, request evidence, and complete handovers.",
                                    status: "Active",
                                },
                                {
                                    title: "Abuse & Policy Moderation",
                                    desc: "Investigate spam, fraudulent claims, and block abusive accounts.",
                                    status: "Active",
                                },
                                {
                                    title: "Audit Logging & Telemetry",
                                    desc: "Full visibility into admin audit trails, event timestamps, and trends.",
                                    status: "Active",
                                },
                            ].map((perm) => (
                                <div
                                    key={perm.title}
                                    className="glass-card rounded-2xl p-4.5 border border-white/50 dark:border-[#2A2D35]/80 transition hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-[#111827] dark:text-[#F3F4F6]">
                                            {perm.title}
                                        </h3>
                                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                                            {perm.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                                        {perm.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
