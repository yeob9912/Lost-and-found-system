import { useState, useEffect, useRef } from "react";
import {
    Camera,
    Shield,
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
    const [activeTab, setActiveTab] = useState<"general" | "security">("general");

    // Success / Error messages
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // First read local user
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

                // Fetch live profile from backend
                const res = await fetchAdminProfile();
                if (res.user) {
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
                // Keep local cached data if backend request fails
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const showMsg = (type: "success" | "error", message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    };

    // Handle avatar photo selection
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showMsg("error", "Image size must be less than 3MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setAvatarPreview(dataUrl);
            setUserProfileImage(dataUrl);
            showMsg("success", "Profile picture updated successfully.");
        };
        reader.readAsDataURL(file);
    };

    // Save general profile info
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAdminProfile({
                fullName: profile.fullName,
                phone: profile.phone,
                department: profile.department,
            });

            // Update session storage
            const current = getCurrentUser();
            if (current) {
                const updated = {
                    ...current,
                    fullName: profile.fullName,
                    phone: profile.phone,
                    department: profile.department,
                };
                sessionStorage.setItem("findback_user", JSON.stringify(updated));
                sessionStorage.setItem("user", JSON.stringify(updated));
                window.dispatchEvent(new Event("profile_image_updated"));
            }

            showMsg("success", "Profile updated successfully.");
        } catch (err: unknown) {
            showMsg("error", err instanceof Error ? err.message : "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            showMsg("error", "Please enter your current password.");
            return;
        }

        if (newPassword.length < 8) {
            showMsg("error", "New password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showMsg("error", "New passwords do not match.");
            return;
        }

        setPasswordLoading(true);
        try {
            await changeAdminPassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            showMsg("success", "Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            showMsg("error", err instanceof Error ? err.message : "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    const initials = (profile.fullName || "Admin")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <AdminLayout title="Admin Profile" subtitle="Account Settings">
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Feedback Toast */}
                {feedback && (
                    <div
                        className={`mb-6 flex items-center gap-2.5 rounded-2xl p-4 text-sm font-medium shadow-sm animate-in fade-in ${
                            feedback.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                    >
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-red-600 shrink-0" />
                        )}
                        <span>{feedback.message}</span>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-6">
                    <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-800" />
                    <div className="relative px-6 pb-6 pt-0 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-14">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="h-28 w-28 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={profile.fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Change profile picture"
                                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Camera size={15} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* User details */}
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        {profile.fullName || "Administrator"}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                                        <Shield size={12} />
                                        System Administrator
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail size={14} className="text-slate-400" />
                                    {profile.email}
                                </p>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors shadow-2xs"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-t border-slate-100 px-6 sm:px-8">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-sm font-bold transition-colors ${
                                activeTab === "general"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            General Information
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-sm font-bold transition-colors ${
                                activeTab === "security"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <Lock size={15} />
                            Security & Password
                        </button>
                    </div>
                </div>

                {/* Tab 1: General Info */}
                {activeTab === "general" && (
                    <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Details</h2>
                        <p className="text-xs text-slate-500 mb-6">
                            Update your administrative contact and identification information.
                        </p>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Email Address (Read-only)
                                </label>
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                                    <Mail size={16} className="text-slate-400 shrink-0" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full bg-transparent outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Student / Admin ID
                                </label>
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                                    <IdCard size={16} className="text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={profile.studentId}
                                        disabled
                                        className="w-full bg-transparent outline-none cursor-not-allowed font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Phone Number
                                </label>
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                                    <Phone size={16} className="text-slate-400 shrink-0" />
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+251 91 234 5678"
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Department / Office
                                </label>
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                                    <Building2 size={16} className="text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={profile.department}
                                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                        placeholder="e.g. Student Services / ICT Center"
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || loading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Tab 2: Security & Password */}
                {activeTab === "security" && (
                    <form onSubmit={handleChangePassword} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Change Password</h2>
                        <p className="text-xs text-slate-500 mb-6">
                            Ensure your administrator account uses a strong, unique password.
                        </p>

                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Current Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Minimum 8 characters with letters, numbers, and symbols.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Lock size={15} />
                                {passwordLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}

