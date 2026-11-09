import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Trash2, UserCheck, Shield, Filter, RefreshCw, Users } from "lucide-react";
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
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
        }`}>
            {role === "admin" && <Shield size={10} />}
            {role === "admin" ? "Admin" : "Student"}
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
            if (!msg.toLowerCase().includes("access denied") && !msg.toLowerCase().includes("administrator")) {
                setError(msg || "Failed to load users");
            }
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => { load(); }, [load]);

    const handleRoleToggle = async (user: User) => {
        const newRole = user.role === "admin" ? "student" : "admin";
        try {
            await updateUserRole(user._id, newRole);
            setActionMsg(`${user.fullName} is now a ${newRole}.`);
            load();
        } catch (err: unknown) {
            setActionMsg(err instanceof Error ? err.message : "Failed to update role");
        }
        setTimeout(() => setActionMsg(""), 3000);
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
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                        <p className="mt-1 text-sm text-slate-500">View and manage ASTU system accounts.</p>
                    </div>
                    <button onClick={load} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Action Feedback */}
                {actionMsg && (
                    <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                        ✓ {actionMsg}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Total Users", value: total, color: "text-blue-600" },
                        { label: "Students", value: studentCount, color: "text-emerald-600" },
                        { label: "Administrators", value: adminCount, color: "text-purple-600" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">{label}</p>
                            <h2 className={`mt-2 text-2xl font-bold ${color}`}>{loading ? "—" : value}</h2>
                        </div>
                    ))}
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Users size={18} className="text-slate-500" />
                            All Users
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Search size={16} className="text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email or ID..."
                                    className="w-full bg-transparent py-2 text-sm outline-none sm:w-56"
                                />
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border px-3 bg-slate-50">
                                <Filter size={15} className="text-slate-400" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="bg-transparent py-2 text-sm outline-none"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="student">Students</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-10 text-center text-sm text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="p-10 text-center text-sm text-slate-400">Loading users…</div>
                        ) : (
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                                    <tr>
                                        <th className="px-5 py-4">User</th>
                                        <th className="px-5 py-4">Student ID</th>
                                        <th className="px-5 py-4">Department</th>
                                        <th className="px-5 py-4">Role</th>
                                        <th className="px-5 py-4">Joined</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{user.fullName}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 font-mono text-xs">{user.studentId}</td>
                                            <td className="px-5 py-4 text-slate-600">{user.department || "—"}</td>
                                            <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                                            <td className="px-5 py-4 text-slate-500 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        title="View details"
                                                        onClick={() => setSelectedUser(user)}
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        title={user.role === "admin" ? "Demote to student" : "Promote to admin"}
                                                        onClick={() => handleRoleToggle(user)}
                                                        className="rounded-lg p-2 text-purple-600 hover:bg-purple-50 transition-colors"
                                                    >
                                                        {user.role === "admin" ? <UserCheck size={16} /> : <Shield size={16} />}
                                                    </button>
                                                    <button
                                                        title="Delete user"
                                                        onClick={() => setConfirmDelete(user)}
                                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-10 text-center text-slate-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View User Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                                    {selectedUser.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{selectedUser.fullName}</h2>
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
                                    <div key={k} className="flex justify-between border-b pb-2 last:border-0">
                                        <span className="text-slate-500">{k}</span>
                                        <span className="font-medium text-slate-800">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirm Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <Trash2 size={22} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Delete User?</h2>
                            <p className="mt-2 text-sm text-slate-500">
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
                                    className="flex-1 rounded-xl border py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
