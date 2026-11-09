import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Trash2, UserCheck, Shield, Filter, RefreshCw, Users, ShieldAlert, AlertTriangle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchUsers, updateUserRole, deleteUser } from "../../services/adminService";

interface User {
    _id: string;
    fullName: string;
    email: string;
    studentId: string;
    role: "student" | "admin";
    createdAt: string;
    department?: string;
    phone?: string;
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            role === "admin"
                ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
        }`}>
            {role === "admin" && <Shield size={11} />}
            {role === "admin" ? "Administrator" : "Student"}
        </span>
    );
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMsg, setActionMsg] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

    // Confirmation dialog for Role Promotion / Demotion (Requirement 1)
    const [roleChangeTarget, setRoleChangeTarget] = useState<{
        user: User;
        newRole: "admin" | "student";
    } | null>(null);
    const [roleUpdating, setRoleUpdating] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (roleFilter !== "all") params.role = roleFilter;
            const data = await fetchUsers(params);
            setUsers(data.users || []);
            setTotal(data.total || 0);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "";
            setError(msg || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => { load(); }, [load]);

    // Triggers confirmation dialog (Does NOT apply immediately!)
    const initiateRoleChange = (user: User) => {
        const newRole = user.role === "admin" ? "student" : "admin";
        setRoleChangeTarget({ user, newRole });
    };

    // Applies role change only after explicit admin confirmation
    const confirmRoleChange = async () => {
        if (!roleChangeTarget) return;
        setRoleUpdating(true);
        try {
            await updateUserRole(roleChangeTarget.user._id, roleChangeTarget.newRole);
            const actionText = roleChangeTarget.newRole === "admin" ? "promoted to Administrator" : "changed to Student";
            setActionMsg(`Successfully ${actionText}: ${roleChangeTarget.user.fullName}`);
            setRoleChangeTarget(null);
            load();
        } catch (err: unknown) {
            setActionMsg(err instanceof Error ? err.message : "Failed to update role");
        } finally {
            setRoleUpdating(false);
            setTimeout(() => setActionMsg(""), 4000);
        }
    };

    const handleDelete = async (user: User) => {
        try {
            await deleteUser(user._id);
            setActionMsg(`${user.fullName} has been removed.`);
            setConfirmDelete(null);
            load();
        } catch (err: unknown) {
            setActionMsg(err instanceof Error ? err.message : "Failed to delete user");
        }
        setTimeout(() => setActionMsg(""), 3000);
    };

    const adminCount = users.filter((u) => u.role === "admin").length;
    const studentCount = users.filter((u) => u.role === "student").length;

    return (
        <AdminLayout title="Manage Users" subtitle="System Accounts">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Manage Users</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            View and manage ASTU registered accounts and administrative roles.
                        </p>
                    </div>
                    <button
                        onClick={load}
                        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-4 py-2.5 text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors shadow-xs"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Action Feedback */}
                {actionMsg && (
                    <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Total Users", value: total, color: "text-blue-600 dark:text-blue-400" },
                        { label: "Students", value: studentCount, color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Administrators", value: adminCount, color: "text-purple-600 dark:text-purple-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-colors">
                            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] shadow-xs transition-colors">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 border-b border-[#E2E8F0] dark:border-[#2A2D35] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6] flex items-center gap-2">
                            <Users size={18} className="text-emerald-600" />
                            Registered System Users
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email or ID..."
                                    className="w-full bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none sm:w-56 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-3 bg-slate-50 dark:bg-[#0D0E12]">
                                <Filter size={15} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none"
                                >
                                    <option value="all" className="dark:bg-[#181A20]">All Roles</option>
                                    <option value="student" className="dark:bg-[#181A20]">Students</option>
                                    <option value="admin" className="dark:bg-[#181A20]">Administrators</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">Loading users…</div>
                        ) : (
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50/70 dark:bg-[#0D0E12]/60 text-xs uppercase text-[#6B7280] dark:text-[#9CA3AF] border-b border-[#E2E8F0] dark:border-[#2A2D35]">
                                    <tr>
                                        <th className="px-5 py-4">User</th>
                                        <th className="px-5 py-4">Student ID</th>
                                        <th className="px-5 py-4">Department</th>
                                        <th className="px-5 py-4">Role</th>
                                        <th className="px-5 py-4">Joined</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2D35]">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50/60 dark:hover:bg-[#2A2D35]/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[#111827] dark:text-[#F3F4F6]">{user.fullName}</p>
                                                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] font-mono text-xs">{user.studentId}</td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF]">{user.department || "—"}</td>
                                            <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                                            <td className="px-5 py-4 text-[#6B7280] dark:text-[#9CA3AF] text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        title="View details"
                                                        onClick={() => setSelectedUser(user)}
                                                        className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        title={user.role === "admin" ? "Demote to student" : "Promote to admin"}
                                                        onClick={() => initiateRoleChange(user)}
                                                        className="rounded-lg p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                                                    >
                                                        {user.role === "admin" ? <UserCheck size={16} /> : <Shield size={16} />}
                                                    </button>
                                                    <button
                                                        title="Delete user"
                                                        onClick={() => setConfirmDelete(user)}
                                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-10 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ROLE PROMOTION / DEMOTION CONFIRMATION DIALOG (Requirement 1) */}
                {roleChangeTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4">
                        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-4 flex items-center gap-3.5">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                    roleChangeTarget.newRole === "admin"
                                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                                }`}>
                                    {roleChangeTarget.newRole === "admin" ? (
                                        <ShieldAlert size={26} />
                                    ) : (
                                        <AlertTriangle size={26} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">
                                        {roleChangeTarget.newRole === "admin"
                                            ? "Grant Administrator Privileges?"
                                            : "Revoke Administrator Privileges?"}
                                    </h2>
                                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                        User: {roleChangeTarget.user.fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-slate-50 dark:bg-[#0D0E12] p-4 text-xs leading-relaxed text-[#111827] dark:text-[#F3F4F6] space-y-2 mb-6">
                                {roleChangeTarget.newRole === "admin" ? (
                                    <>
                                        <p className="font-semibold text-purple-700 dark:text-purple-300">
                                            Important Warning:
                                        </p>
                                        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                                            Granting administrative privileges will give <strong>{roleChangeTarget.user.fullName}</strong> full access to manage lost and found reports, verify and resolve claims, manage registered users, and audit system activities.
                                        </p>
                                        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                                            Are you sure you want to promote this user to <strong>System Administrator</strong>?
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-amber-700 dark:text-amber-300">
                                            Role Demotion:
                                        </p>
                                        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                                            Revoking administrative privileges will remove <strong>{roleChangeTarget.user.fullName}</strong>'s access to the admin dashboard and all administrative tools.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={confirmRoleChange}
                                    disabled={roleUpdating}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-md active:scale-95 transition-all disabled:opacity-50 ${
                                        roleChangeTarget.newRole === "admin"
                                            ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                                            : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                                    }`}
                                >
                                    {roleUpdating ? "Updating..." : roleChangeTarget.newRole === "admin" ? "Confirm & Grant Admin" : "Confirm & Demote"}
                                </button>
                                <button
                                    onClick={() => setRoleChangeTarget(null)}
                                    disabled={roleUpdating}
                                    className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View User Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4">
                        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                                    {selectedUser.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">{selectedUser.fullName}</h2>
                                    <RoleBadge role={selectedUser.role} />
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                {[
                                    ["Email", selectedUser.email],
                                    ["Student ID", selectedUser.studentId],
                                    ["Department", selectedUser.department || "Not provided"],
                                    ["Phone", selectedUser.phone || "Not provided"],
                                    ["Joined", new Date(selectedUser.createdAt).toLocaleDateString()],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-[#E2E8F0] dark:border-[#2A2D35] pb-2 last:border-0">
                                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">{k}</span>
                                        <span className="font-medium text-[#111827] dark:text-[#F3F4F6]">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="mt-5 w-full rounded-xl bg-slate-100 dark:bg-[#2A2D35] py-2.5 text-sm font-semibold text-[#111827] dark:text-[#F3F4F6] hover:bg-slate-200 dark:hover:bg-[#2A2D35]/80 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirm Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4">
                        <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#181A20] border border-[#E2E8F0] dark:border-[#2A2D35] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                                <Trash2 size={22} />
                            </div>
                            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F3F4F6]">Delete User?</h2>
                            <p className="mt-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                                Are you sure you want to remove <strong>{confirmDelete.fullName}</strong>? This action cannot be undone.
                            </p>
                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => handleDelete(confirmDelete)}
                                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] py-2.5 text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
