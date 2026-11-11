import { useState, useEffect } from "react";
import { MapPin, Plus, Search, Pencil, Trash2, X, Check } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

interface LocationItem {
    id: number | string;
    name: string;
    description: string;
    reports: number;
}

const DEFAULT_LOCATIONS: LocationItem[] = [
    { id: 1, name: "Main Library", description: "ASTU Main Library building (all floors)", reports: 28 },
    { id: 2, name: "Student Cafeteria", description: "Main student cafeteria and dining halls", reports: 24 },
    { id: 3, name: "Student Dormitory Block A & B", description: "Student residential and hostel zones", reports: 35 },
    { id: 4, name: "Academic Building Blocks (B500)", description: "Lecture halls, classrooms and labs", reports: 42 },
    { id: 5, name: "Sports Complex & Stadium", description: "Football field, basketball court, and gym", reports: 12 },
    { id: 6, name: "Administration Building", description: "Registrar, ICT center, and dean offices", reports: 9 },
];

export default function ManageLocations() {
    const [locations, setLocations] = useState<LocationItem[]>(() => {
        const saved = localStorage.getItem("findback_admin_locations");
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignore */ }
        }
        return DEFAULT_LOCATIONS;
    });

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingLoc, setEditingLoc] = useState<LocationItem | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        localStorage.setItem("findback_admin_locations", JSON.stringify(locations));
    }, [locations]);

    const notify = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        if (editingLoc) {
            setLocations((prev) =>
                prev.map((loc) =>
                    loc.id === editingLoc.id
                        ? { ...loc, name: name.trim(), description: description.trim() }
                        : loc
                )
            );
            notify(`Location "${name}" updated.`);
            setEditingLoc(null);
        } else {
            const newLoc: LocationItem = {
                id: Date.now(),
                name: name.trim(),
                description: description.trim(),
                reports: 0,
            };
            setLocations((prev) => [newLoc, ...prev]);
            notify(`Location "${name}" added.`);
        }

        setName("");
        setDescription("");
        setShowForm(false);
    };

    const startEdit = (loc: LocationItem) => {
        setEditingLoc(loc);
        setName(loc.name);
        setDescription(loc.description);
        setShowForm(true);
    };

    const handleDelete = (id: number | string, locName: string) => {
        if (!confirm(`Are you sure you want to delete "${locName}"?`)) return;
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
        notify(`Location "${locName}" deleted.`);
    };

    const filtered = locations.filter((loc) =>
        `${loc.name} ${loc.description}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Locations" subtitle="Campus Drop-off & Lost Zones">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F3F4F6]">Manage Locations</h1>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            Manage designated ASTU campus spots where items are frequently lost or found.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingLoc(null);
                            setName("");
                            setDescription("");
                            setShowForm(!showForm);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                        <Plus size={18} /> {showForm ? "Cancel" : "Add Location"}
                    </button>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        ✓ {actionMsg}
                    </div>
                )}

                {showForm && (
                    <div className="glass-panel mb-6 rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-black/30 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-[#111827] dark:text-[#F3F4F6]">
                                {editingLoc ? "Edit Location" : "Add New Location"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingLoc(null);
                                }}
                                className="rounded-lg p-1 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#2A2D35] cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-[#111827] dark:text-[#F3F4F6] mb-1">
                                    Location Name *
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Block 508 2nd Floor"
                                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#0D0E12] px-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#111827] dark:text-[#F3F4F6] mb-1">
                                    Description / Details
                                </label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Near ICT Lab 3 and restrooms"
                                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#0D0E12] px-4 py-2.5 text-sm text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!name.trim()}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                            >
                                <Check size={16} /> {editingLoc ? "Update Location" : "Save Location"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingLoc(null);
                                }}
                                className="rounded-xl border border-[#E2E8F0] dark:border-[#2A2D35] px-5 py-2.5 text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#2A2D35] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="glass-card mb-6 flex items-center gap-2 rounded-xl px-4 py-1">
                    <Search size={18} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search locations by name or description..."
                        className="w-full py-2.5 text-sm bg-transparent text-[#111827] dark:text-[#F3F4F6] outline-none placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF]"
                    />
                </div>

                {/* Location Grid */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((location) => (
                        <div
                            key={location.id}
                            className="glass-card rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 text-amber-600 dark:text-amber-400">
                                    <MapPin size={22} />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        title="Edit location"
                                        onClick={() => startEdit(location)}
                                        className="rounded-lg p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        title="Delete location"
                                        onClick={() => handleDelete(location.id, location.name)}
                                        className="rounded-lg p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h2 className="mt-4 text-base font-bold text-[#111827] dark:text-[#F3F4F6]">{location.name}</h2>
                            <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF] min-h-[40px] leading-relaxed">
                                {location.description || "No specific details provided."}
                            </p>
                            <div className="mt-4 border-t border-[#E2E8F0] dark:border-[#2A2D35] pt-3 flex items-center justify-between">
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    {location.reports} incidents reported
                                </span>
                                <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Campus Zone</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                        <MapPin size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <h3 className="mt-3 font-semibold text-[#111827] dark:text-[#F3F4F6]">No locations found</h3>
                        <p className="mt-1 text-sm text-[#6B7280] dark:text-[#9CA3AF]">Try modifying your search query.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
