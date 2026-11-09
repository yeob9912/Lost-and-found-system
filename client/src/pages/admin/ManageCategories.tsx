import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Tags, X, Check } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Category {
    id: number | string;
    name: string;
    description: string;
    count: number;
}

const DEFAULT_CATEGORIES: Category[] = [
    { id: 1, name: "Electronics", description: "Phones, laptops, chargers, flash drives, and calculators", count: 45 },
    { id: 2, name: "Documents", description: "Student IDs, passports, certificates, and notebooks", count: 32 },
    { id: 3, name: "Bags & Luggage", description: "Backpacks, handbags, wallets, and pouches", count: 28 },
    { id: 4, name: "Clothing & Shoes", description: "Jackets, sweaters, hats, sunglasses, and footwear", count: 19 },
    { id: 5, name: "Accessories", description: "Watches, jewelry, eyeglasses, keys, and water bottles", count: 15 },
    { id: 6, name: "Books & Stationery", description: "Textbooks, novels, binders, and calculators", count: 12 },
];

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem("findback_admin_categories");
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignore */ }
        }
        return DEFAULT_CATEGORIES;
    });

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        localStorage.setItem("findback_admin_categories", JSON.stringify(categories));
    }, [categories]);

    const notify = (msg: string) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        if (editingCategory) {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === editingCategory.id ? { ...c, name: name.trim(), description: description.trim() } : c
                )
            );
            notify(`Category "${name}" updated.`);
            setEditingCategory(null);
        } else {
            const newCat: Category = {
                id: Date.now(),
                name: name.trim(),
                description: description.trim(),
                count: 0,
            };
            setCategories((prev) => [newCat, ...prev]);
            notify(`Category "${name}" created.`);
        }

        setName("");
        setDescription("");
        setShowForm(false);
    };

    const startEdit = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setDescription(cat.description);
        setShowForm(true);
    };

    const handleDelete = (id: number | string, catName: string) => {
        if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;
        setCategories((prev) => prev.filter((c) => c.id !== id));
        notify(`Category "${catName}" deleted.`);
    };

    const filtered = categories.filter((c) =>
        `${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Organize item categories used for lost and found classification.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setName("");
                            setDescription("");
                            setShowForm(!showForm);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all"
                    >
                        <Plus size={18} /> {showForm ? "Cancel" : "Add Category"}
                    </button>
                </div>

                {actionMsg && (
                    <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                        ✓ {actionMsg}
                    </div>
                )}

                {showForm && (
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800">
                                {editingCategory ? "Edit Category" : "Create New Category"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                }}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Wallets & Cards"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Description
                                </label>
                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of items included"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!name.trim()}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <Check size={16} /> {editingCategory ? "Update Category" : "Save Category"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                }}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
                    <Search size={18} className="text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories by name or description..."
                        className="w-full py-2.5 text-sm outline-none"
                    />
                </div>

                {/* Category Grid */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                    <Tags size={22} />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        title="Edit category"
                                        onClick={() => startEdit(category)}
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        title="Delete category"
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h2 className="mt-4 text-base font-bold text-slate-800">{category.name}</h2>
                            <p className="mt-1 text-sm text-slate-500 min-h-[40px] leading-relaxed">
                                {category.description || "No description provided."}
                            </p>
                            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                                <span className="text-xs font-semibold text-emerald-600">
                                    {category.count} items tracked
                                </span>
                                <span className="text-[11px] text-slate-400">Active</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
                        <Tags size={36} className="mx-auto text-slate-300" />
                        <h3 className="mt-3 font-semibold text-slate-700">No categories found</h3>
                        <p className="mt-1 text-sm text-slate-400">Try modifying your search query.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
