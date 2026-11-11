
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    Shield,
    Bell,
    Activity,
    Camera,
    Pencil,
    Save,
    X,
    LogOut,
    Trash2,
    Lock,
    Mail,
    Phone,
    GraduationCap,
    IdCard,
    FileText,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    ChevronRight,
    Settings,
    ImagePlus,
} from "lucide-react";
import {
    getUserProfileImage,
    setUserProfileImage,
    getToken,
    type AuthUser,
} from "../../services/authService";

type Student = {
    id?: string;
    fullName?: string;
    studentId?: string;
    email?: string;
    phone?: string;
    department?: string;
    yearOfStudy?: string;
    role?: string;
    profileImage?: string;
};

type Tab =
    | "overview"
    | "personal"
    | "security"
    | "notifications"
    | "activity";

type Preferences = Record<string, boolean>;

const defaultPreferences: Preferences = {
    claimUpdates: true,
    reportUpdates: true,
    itemMatches: true,
    announcements: true,
};

const tabs: {
    id: Tab;
    label: string;
    icon: typeof User;
}[] = [
        { id: "overview", label: "Overview", icon: User },
        { id: "personal", label: "Personal Information", icon: IdCard },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "activity", label: "My Activity", icon: Activity },
    ];

const notificationOptions = [
    {
        id: "claimUpdates",
        title: "Claim Updates",
        description: "Receive updates when your claim status changes.",
    },
    {
        id: "reportUpdates",
        title: "Report Updates",
        description: "Receive updates about your lost and found reports.",
    },
    {
        id: "itemMatches",
        title: "Possible Item Matches",
        description: "Get notified when an item may match your lost item.",
    },
    {
        id: "announcements",
        title: "System Announcements",
        description: "Receive important announcements from FindBack.",
    },
];

function getSavedUser(): Student {
    try {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : {};
    } catch {
        return {};
    }
}

function getSavedPreferences(): Preferences {
    try {
        const saved = localStorage.getItem("findback-notification-preferences");
        return saved
            ? { ...defaultPreferences, ...JSON.parse(saved) }
            : defaultPreferences;
    } catch {
        return defaultPreferences;
    }
}

export default function Profile() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [student, setStudent] = useState<Student>(getSavedUser);
    const [editing, setEditing] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");

    // Profile image linked uniquely to this authenticated user account
    const [profileImage, setProfileImage] = useState<string | null>(() => {
        return getUserProfileImage(getSavedUser() as AuthUser);
    });

    const profileImageInput = useRef<HTMLInputElement>(null);

    // Sync profile and unique profile picture from server
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        fetch("http://localhost:5000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data?.user) {
                    setStudent((prev) => ({
                        ...prev,
                        ...data.user,
                    }));
                    if (data.user.profileImage) {
                        setProfileImage(data.user.profileImage);
                        setUserProfileImage(data.user.profileImage, data.user);
                    }
                }
            })
            .catch(() => {});
    }, []);

    // Notification preferences
    const [preferences, setPreferences] =
        useState<Preferences>(getSavedPreferences);

    // Password fields
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    // Delete account confirmation
    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    // Save notification preferences
    useEffect(() => {
        localStorage.setItem(
            "findback-notification-preferences",
            JSON.stringify(preferences)
        );
    }, [preferences]);

    // Student information
    const fullName = student.fullName?.trim() || "ASTU Student";

    const firstLetter = fullName.charAt(0).toUpperCase();

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    // Update student information
    const updateField = (field: keyof Student, value: string) => {
        setStudent((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    // Upload profile image
    const handleProfileImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            window.alert("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            window.alert("Image size must be less than 2MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const imageData = reader.result;

            if (typeof imageData !== "string") {
                window.alert("Unable to read this image.");
                return;
            }

            try {
                setUserProfileImage(imageData, student as AuthUser);
                setProfileImage(imageData);
                setSavedMessage("Profile picture updated successfully.");

                // Persist image to backend database specifically for this authenticated user account
                const token = getToken();
                if (token) {
                    fetch("http://localhost:5000/api/users/profile", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ profileImage: imageData }),
                    })
                        .then((res) => (res.ok ? res.json() : null))
                        .then((data) => {
                            if (data?.user?.profileImage) {
                                setUserProfileImage(data.user.profileImage, student as AuthUser);
                                setProfileImage(data.user.profileImage);
                            }
                        })
                        .catch((err) => console.error("Failed to sync profile picture to server:", err));
                }

                window.setTimeout(() => setSavedMessage(""), 3000);
            } catch {
                window.alert(
                    "Unable to save this image. Please choose a smaller image."
                );
            }
        };

        reader.onerror = () => {
            window.alert("There was a problem reading your image.");
        };

        reader.readAsDataURL(file);
    };

    // Remove profile image
    const handleRemoveProfileImage = () => {
        setUserProfileImage(null, student as AuthUser);
        setProfileImage(null);

        if (profileImageInput.current) {
            profileImageInput.current.value = "";
        }

        // Remove image from backend database specifically for this user
        const token = getToken();
        if (token) {
            fetch("http://localhost:5000/api/users/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profileImage: "" }),
            }).catch((err) => console.error("Failed to remove profile image from server:", err));
        }

        setSavedMessage("Profile picture removed successfully.");
        window.setTimeout(() => setSavedMessage(""), 3000);
    };

    // Save profile information
    const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            sessionStorage.setItem("user", JSON.stringify(student));
            sessionStorage.setItem("findback_user", JSON.stringify(student));
            localStorage.setItem("user", JSON.stringify(student));
            localStorage.setItem("findback_user", JSON.stringify(student));

            const token = getToken();
            if (token) {
                await fetch("http://localhost:5000/api/users/profile", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        fullName: student.fullName,
                        phone: student.phone,
                        department: student.department,
                        yearOfStudy: student.yearOfStudy,
                    }),
                });
            }

            setEditing(false);
            setSavedMessage("Your profile information has been saved.");
            window.setTimeout(() => setSavedMessage(""), 3000);
        } catch {
            setSavedMessage("Unable to save your profile information.");
        }
    };

    // Cancel profile editing
    const handleCancelEdit = () => {
        setStudent(getSavedUser());
        setEditing(false);
    };

    // Notification preferences
    const handlePreferenceChange = (id: string) => {
        setPreferences((previous) => ({
            ...previous,
            [id]: !previous[id],
        }));
    };

    // Change password validation
    const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPasswordError("");
        setPasswordMessage("");

        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
        ) {
            setPasswordError("Please fill in all password fields.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError(
                "Your new password must contain at least 8 characters."
            );
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("The new passwords do not match.");
            return;
        }

        setPasswordError(
            "Password changes are not connected to the backend yet."
        );
    };

    // Logout
    const handleLogout = () => {
        const confirmed = window.confirm(
            "Are you sure you want to log out?"
        );

        if (!confirmed) return;

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    // Delete account
    const handleDeleteAccount = () => {
        setShowDeleteConfirmation(false);

        window.alert(
            "Account deletion needs to be connected to a secure backend endpoint. Your account has not been deleted."
        );
    };

    // Reusable profile avatar
    const ProfileAvatar = ({
        size = "large",
    }: {
        size?: "large" | "small";
    }) => {
        const dimensions =
            size === "large" ? "h-24 w-24 text-3xl" : "h-11 w-11 text-lg";

        return (
            <div
                className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2D5A46] font-bold text-white ${dimensions}`}
            >
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={`${fullName} profile`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    firstLetter
                )}
            </div>
        );
    };

    // Overview section
    const renderOverview = () => (
        <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                    <div className="relative">
                        <ProfileAvatar />

                        <input
                            ref={profileImageInput}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleProfileImageChange}
                        />

                        <button
                            type="button"
                            onClick={() => profileImageInput.current?.click()}
                            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#2D5A46] text-white shadow-sm transition hover:bg-[#1A362B]"
                            aria-label="Upload profile picture"
                            title="Upload profile picture"
                        >
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-[#1A362B]">
                            {fullName}
                        </h2>

                        <p className="mt-1 text-sm text-[#718276]">
                            ASTU Student
                        </p>

                        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <span className="rounded-full bg-[#E9F0E6] px-3 py-1 text-xs font-medium text-[#2D5A46]">
                                {student.studentId || "Student ID not added"}
                            </span>

                            <span className="rounded-full bg-[#F1F3EF] px-3 py-1 text-xs font-medium text-[#718276]">
                                {student.role || "Student Account"}
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                            <button
                                type="button"
                                onClick={() => profileImageInput.current?.click()}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[#2D5A46] transition hover:text-[#1A362B]"
                            >
                                <ImagePlus size={15} />
                                Change Photo
                            </button>

                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveProfileImage}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700"
                                >
                                    <Trash2 size={14} />
                                    Remove Photo
                                </button>
                            )}
                        </div>

                        <p className="mt-2 text-xs text-[#849187]">
                            JPG, PNG or WebP. Maximum size: 2MB.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setActiveTab("personal")}
                        className="flex items-center gap-2 rounded-xl bg-[#2D5A46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A362B]"
                    >
                        <Pencil size={15} />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                    icon={<Mail size={18} />}
                    label="Email Address"
                    value={student.email || "Not provided"}
                />

                <InfoCard
                    icon={<Phone size={18} />}
                    label="Phone Number"
                    value={student.phone || "Not provided"}
                />

                <InfoCard
                    icon={<GraduationCap size={18} />}
                    label="Department"
                    value={student.department || "Not provided"}
                />

                <InfoCard
                    icon={<IdCard size={18} />}
                    label="Year of Study"
                    value={student.yearOfStudy || "Not provided"}
                />
            </div>

            <div className="rounded-2xl border border-[#E2E9DF] bg-white p-6">
                <h3 className="font-bold text-[#1A362B]">
                    Account Settings
                </h3>

                <p className="mt-1 text-sm text-[#849187]">
                    Manage your account and personal preferences.
                </p>

                <div className="mt-5 divide-y divide-[#EDF0EA]">
                    <SettingsLink
                        icon={<User size={18} />}
                        title="Personal Information"
                        description="Update your contact and student information."
                        onClick={() => setActiveTab("personal")}
                    />

                    <SettingsLink
                        icon={<Lock size={18} />}
                        title="Password & Security"
                        description="Manage your account password."
                        onClick={() => setActiveTab("security")}
                    />

                    <SettingsLink
                        icon={<Bell size={18} />}
                        title="Notification Preferences"
                        description="Choose which notifications you receive."
                        onClick={() => setActiveTab("notifications")}
                    />

                    <SettingsLink
                        icon={<Activity size={18} />}
                        title="My Activity"
                        description="View your reports and claims."
                        onClick={() => setActiveTab("activity")}
                    />
                </div>
            </div>
        </div>
    );

    // Personal information section
    const renderPersonalInformation = () => (
        <div className="rounded-2xl border border-[#E2E9DF] bg-white p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-[#1A362B]">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[#849187]">
                        Keep your student information up to date.
                    </p>
                </div>

                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 rounded-xl border border-[#DCE6D9] px-4 py-2 text-sm font-semibold text-[#2D5A46] transition hover:bg-[#F4F6F0]"
                    >
                        <Pencil size={15} />
                        Edit
                    </button>
                )}
            </div>

            <form onSubmit={handleSaveProfile}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField
                        label="Full Name"
                        value={student.fullName || ""}
                        disabled={!editing}
                        onChange={(value) => updateField("fullName", value)}
                        placeholder="Enter your full name"
                    />

                    <ProfileField
                        label="Student ID"
                        value={student.studentId || ""}
                        disabled
                        placeholder="Your ASTU student ID"
                    />

                    <ProfileField
                        label="Email Address"
                        value={student.email || ""}
                        disabled
                        placeholder="Your registered email"
                    />

                    <ProfileField
                        label="Phone Number"
                        value={student.phone || ""}
                        disabled={!editing}
                        onChange={(value) => updateField("phone", value)}
                        placeholder="Enter your phone number"
                    />

                    <ProfileField
                        label="Department"
                        value={student.department || ""}
                        disabled={!editing}
                        onChange={(value) => updateField("department", value)}
                        placeholder="Enter your department"
                    />

                    <ProfileField
                        label="Year of Study"
                        value={student.yearOfStudy || ""}
                        disabled={!editing}
                        onChange={(value) => updateField("yearOfStudy", value)}
                        placeholder="e.g. 4th Year"
                    />
                </div>

                <p className="mt-5 text-xs leading-5 text-[#849187]">
                    Your Student ID and registered email are protected account
                    information. Contact your system administrator if they need
                    to be corrected.
                </p>

                {editing && (
                    <div className="mt-7 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 rounded-xl border border-[#DCE6D9] px-5 py-2.5 text-sm font-semibold text-[#718276] transition hover:bg-[#F4F6F0]"
                        >
                            <X size={16} />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-[#2D5A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A362B]"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );

    // Security section
    const renderSecurity = () => (
        <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#1A362B]">
                        Change Password
                    </h2>

                    <p className="mt-1 text-sm text-[#849187]">
                        Use a strong password to keep your account secure.
                    </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <PasswordField
                        label="Current Password"
                        value={passwordForm.currentPassword}
                        visible={showCurrentPassword}
                        onToggle={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                        }
                        onChange={(value) =>
                            setPasswordForm((previous) => ({
                                ...previous,
                                currentPassword: value,
                            }))
                        }
                    />

                    <PasswordField
                        label="New Password"
                        value={passwordForm.newPassword}
                        visible={showNewPassword}
                        onToggle={() => setShowNewPassword(!showNewPassword)}
                        onChange={(value) =>
                            setPasswordForm((previous) => ({
                                ...previous,
                                newPassword: value,
                            }))
                        }
                    />

                    <PasswordField
                        label="Confirm New Password"
                        value={passwordForm.confirmPassword}
                        visible={showConfirmPassword}
                        onToggle={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        onChange={(value) =>
                            setPasswordForm((previous) => ({
                                ...previous,
                                confirmPassword: value,
                            }))
                        }
                    />

                    {passwordError && (
                        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle size={17} className="mt-0.5 shrink-0" />
                            {passwordError}
                        </div>
                    )}

                    {passwordMessage && (
                        <div className="rounded-xl bg-[#E9F0E6] p-3 text-sm text-[#2D5A46]">
                            {passwordMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-[#2D5A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A362B]"
                    >
                        <Lock size={16} />
                        Update Password
                    </button>
                </form>
            </div>

            <div className="rounded-2xl border border-[#E2E9DF] bg-white p-6">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#E9F0E6] p-3 text-[#2D5A46]">
                        <Shield size={20} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#1A362B]">
                            Account Security
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#849187]">
                            Never share your password with anyone. Always log out
                            when using a shared computer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Notifications section
    const renderNotifications = () => (
        <div className="rounded-2xl border border-[#E2E9DF] bg-white p-6 sm:p-8">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-[#1A362B]">
                    Notification Preferences
                </h2>

                <p className="mt-1 text-sm text-[#849187]">
                    Choose the updates you want to receive from FindBack.
                </p>
            </div>

            <div className="divide-y divide-[#EDF0EA]">
                {notificationOptions.map((option) => (
                    <div
                        key={option.id}
                        className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                    >
                        <div>
                            <h3 className="text-sm font-semibold text-[#1A362B]">
                                {option.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#849187]">
                                {option.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={!!preferences[option.id]}
                            onClick={() => handlePreferenceChange(option.id)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${preferences[option.id]
                                    ? "bg-[#2D5A46]"
                                    : "bg-[#D6DDD3]"
                                }`}
                        >
                            <span
                                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${preferences[option.id] ? "left-6" : "left-1"
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#F4F6F0] p-3 text-xs text-[#718276]">
                <CheckCircle2 size={16} className="shrink-0 text-[#2D5A46]" />
                Your preferences are saved automatically on this device.
            </div>
        </div>
    );

    // Activity section
    const renderActivity = () => (
        <div className="space-y-4">
            <ActivityLink
                icon={<FileText size={22} />}
                title="My Reports"
                description="View and manage the lost and found items you reported."
                onClick={() => navigate("/student/my-reports")}
            />

            <ActivityLink
                icon={<CheckCircle2 size={22} />}
                title="My Claims"
                description="Check the status of items you have claimed."
                onClick={() => navigate("/student/my-claims")}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F4F6F0]/85 dark:bg-[#0D0E12]/85 px-4 py-8 sm:px-6 lg:px-8 relative z-10 transition-colors">
            <div className="mx-auto max-w-6xl">
                {/* Page heading */}
                <div className="mb-7">
                    <div className="flex items-center gap-2 text-sm text-[#849187]">
                        <Settings size={16} />
                        <span>Account</span>
                        <ChevronRight size={14} />
                        <span className="font-medium text-[#2D5A46]">
                            Profile
                        </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold text-[#1A362B]">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-[#718276]">
                        Manage your personal information and account settings.
                    </p>
                </div>

                {/* Success message */}
                {savedMessage && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#D8E5D4] bg-[#E9F0E6] p-3 text-sm text-[#2D5A46]">
                        <CheckCircle2 size={17} />
                        {savedMessage}
                    </div>
                )}

                <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                    {/* Sidebar */}
                    <aside className="glass-card rounded-2xl p-3 shadow-lg">
                        <div className="mb-3 flex items-center gap-3 border-b border-[#EDF0EA] px-3 py-4">
                            <ProfileAvatar size="small" />

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-[#1A362B]">
                                    {fullName}
                                </p>

                                <p className="truncate text-xs text-[#849187]">
                                    {student.studentId || "ASTU Student"}
                                </p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${isActive
                                                ? "bg-[#E9F0E6] text-[#2D5A46]"
                                                : "text-[#718276] hover:bg-[#F4F6F0] hover:text-[#1A362B]"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-4 border-t border-[#EDF0EA] pt-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Log Out
                            </button>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="min-w-0">
                        {activeTab === "overview" && renderOverview()}
                        {activeTab === "personal" && renderPersonalInformation()}
                        {activeTab === "security" && renderSecurity()}
                        {activeTab === "notifications" && renderNotifications()}
                        {activeTab === "activity" && renderActivity()}

                        {/* Delete account */}
                        <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="font-bold text-[#1A362B]">
                                        Delete Account
                                    </h3>

                                    <p className="mt-1 text-sm text-[#849187]">
                                        Permanently remove your FindBack account.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirmation(true)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete account modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 size={22} />
                        </div>

                        <h2 className="text-xl font-bold text-[#1A362B]">
                            Delete your account?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#718276]">
                            Account deletion is permanent. Your reports and claims
                            may also need to be handled before your account can be
                            removed.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="rounded-xl border border-[#DCE6D9] px-4 py-2.5 text-sm font-semibold text-[#718276] hover:bg-[#F4F6F0]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Information card
function InfoCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[#E2E9DF] bg-white p-5">
            <div className="flex items-center gap-2 text-[#2D5A46]">
                {icon}
                <span className="text-sm font-medium text-[#718276]">
                    {label}
                </span>
            </div>

            <p className="mt-3 break-words font-semibold text-[#1A362B]">
                {value}
            </p>
        </div>
    );
}

// Settings link
function SettingsLink({
    icon,
    title,
    description,
    onClick,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-[#FAFBF8]"
        >
            <div className="rounded-xl bg-[#E9F0E6] p-2.5 text-[#2D5A46]">
                {icon}
            </div>

            <div className="flex-1">
                <p className="text-sm font-semibold text-[#1A362B]">
                    {title}
                </p>

                <p className="mt-1 text-xs text-[#849187]">
                    {description}
                </p>
            </div>

            <ChevronRight size={18} className="text-[#849187]" />
        </button>
    );
}

// Profile input field
function ProfileField({
    label,
    value,
    disabled,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    disabled: boolean;
    onChange?: (value: string) => void;
    placeholder: string;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#405548]">
                {label}
            </span>

            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange?.(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#DCE6D9] bg-[#FAFBF8] px-4 py-3 text-sm text-[#1A362B] outline-none transition placeholder:text-[#A0AAA0] focus:border-[#2D5A46] focus:ring-2 focus:ring-[#2D5A46]/10 disabled:cursor-not-allowed disabled:bg-[#F1F3EF] disabled:text-[#849187]"
            />
        </label>
    );
}

// Password input field
function PasswordField({
    label,
    value,
    visible,
    onToggle,
    onChange,
}: {
    label: string;
    value: string;
    visible: boolean;
    onToggle: () => void;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#405548]">
                {label}
            </span>

            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-[#DCE6D9] bg-[#FAFBF8] px-4 py-3 pr-12 text-sm text-[#1A362B] outline-none transition placeholder:text-[#A0AAA0] focus:border-[#2D5A46] focus:ring-2 focus:ring-[#2D5A46]/10"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#849187] hover:text-[#2D5A46]"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </label>
    );
}

// Activity link
function ActivityLink({
    icon,
    title,
    description,
    onClick,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <div className="rounded-2xl border border-[#E2E9DF] bg-white p-6">
            <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#E9F0E6] p-3 text-[#2D5A46]">
                    {icon}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-[#1A362B]">{title}</h3>

                    <p className="mt-1 text-sm text-[#849187]">
                        {description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClick}
                    className="flex items-center gap-1 text-sm font-semibold text-[#2D5A46] hover:text-[#1A362B]"
                >
                    View <ChevronRight size={17} />
                </button>
            </div>
        </div>
    );
}
