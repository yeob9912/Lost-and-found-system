import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, ImagePlus, X, Send
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function ReportItem() {
    const [form, setForm] = useState({
        type: 'Lost',
        name: '',
        category: '',
        brand: '',
        color: '',
        description: '',
        location: '',
        date: '',
        privateDetails: '',
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5 MB.');
            return;
        }

        setError('');
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        setPreview('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            setError('Please upload an image of the item.');
            return;
        }

        alert('Your report form is ready. Backend API integration is still required.');
    };

    return (
        <main className="min-h-screen bg-[#f7faf7] dark:bg-[#0D0E12] flex flex-col justify-between transition-colors">
            <div>
                <Navbar />

                <section className="mx-auto max-w-3xl px-5 py-10">
                    <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <ArrowLeft size={17} /> Back to Home
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-emerald-950">
                            Report an Item
                        </h1>
                        <p className="mt-3 leading-relaxed text-gray-600">
                            Help the ASTU community recover lost belongings or return
                            items you have found. Please provide accurate information.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}
                        className="space-y-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">

                        {/* Report Type */}
                        <div>
                            <label className="mb-3 block text-sm font-bold text-gray-800">
                                What would you like to report? *
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                {['Lost', 'Found'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setForm({ ...form, type })}
                                        className={`rounded-xl border-2 px-4 py-4 font-bold transition ${form.type === type
                                                ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                                                : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                                            }`}
                                    >
                                        {type === 'Lost' ? 'I Lost an Item' : 'I Found an Item'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="mb-3 block text-sm font-bold text-gray-800">
                                Item Image <span className="text-red-600">*</span>
                            </label>

                            <p className="mb-3 text-xs text-gray-500">
                                Upload a clear photo of the lost or found item.
                                JPG, PNG or WEBP. Maximum 5 MB.
                            </p>

                            {preview ? (
                                <div className="relative overflow-hidden rounded-xl border">
                                    <img src={preview} alt="Selected item"
                                        className="h-64 w-full object-contain bg-gray-50" />
                                    <button type="button" onClick={removeImage}
                                        className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                                        aria-label="Remove image">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-5 py-12 text-center transition hover:border-emerald-700 hover:bg-emerald-50">
                                    <ImagePlus className="mb-3 h-10 w-10 text-emerald-800" />
                                    <span className="font-bold text-emerald-950">
                                        Click to upload an image
                                    </span>
                                    <span className="mt-2 text-xs text-gray-500">
                                        Your image is required
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Item Name *</label>
                                <input name="name" required value={form.name}
                                    onChange={handleChange} placeholder="e.g. Wireless headphones"
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Category *</label>
                                <select name="category" required value={form.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-emerald-800">
                                    <option value="">Select category</option>
                                    <option>Electronics</option>
                                    <option>Bags</option>
                                    <option>Books and Stationery</option>
                                    <option>Personal Belongings</option>
                                    <option>Clothing</option>
                                    <option>Accessories</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Brand / Manufacturer</label>
                                <input name="brand" value={form.brand}
                                    onChange={handleChange} placeholder="e.g. Samsung"
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Color *</label>
                                <input name="color" required value={form.color}
                                    onChange={handleChange} placeholder="e.g. Black"
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Description *</label>
                            <textarea name="description" required rows="4"
                                value={form.description} onChange={handleChange}
                                placeholder="Describe the item, including its visible features..."
                                className="w-full resize-y rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                        </div>

                        {/* Location and Date */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    {form.type} Location *
                                </label>
                                <input name="location" required value={form.location}
                                    onChange={handleChange} placeholder="e.g. ASTU Central Library"
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    {form.type} Date *
                                </label>
                                <input type="date" name="date" required value={form.date}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            </div>
                        </div>

                        {/* Private identifying information */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Additional Identifying Information
                            </label>
                            <textarea name="privateDetails" rows="3"
                                value={form.privateDetails} onChange={handleChange}
                                placeholder="Provide details that can help verify ownership. These details will remain private."
                                className="w-full resize-y rounded-lg border px-4 py-3 outline-none focus:border-emerald-800" />
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                Do not include sensitive ownership clues in the public description.
                                This information should only be available to authorized administrators.
                            </p>
                        </div>

                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-6 py-4 font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl">
                            <Send size={18} />
                            Submit {form.type} Report
                        </button>
                    </form>
                </section>
            </div>

            <Footer />
        </main>
    );
}
