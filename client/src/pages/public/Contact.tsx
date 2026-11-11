import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    PackageSearch,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    ChevronDown,
    PlusCircle,
    HelpCircle,
    ShieldCheck,
    Menu,
    X,
    AlertCircle,
} from "lucide-react";

const Contact = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });

    const [formStatus, setFormStatus] = useState("");

    const faqs = [
        {
            question: "How can I report a lost item?",
            answer:
                "Visit the Report Item page, select the Lost Item option, and provide the required information, including the item description, category, location, date, and image.",
        },
        {
            question: "How can I report an item I found?",
            answer:
                "Open the Report Item page and select the Found Item option. Provide accurate details about the item and where you found it.",
        },
        {
            question: "How do I find an item that belongs to me?",
            answer:
                "Visit the Lost Items and Found Items pages. Search using the item name, category, color, or location to identify possible matches.",
        },
        {
            question: "What should I do if someone claims my item?",
            answer:
                "Verify ownership by asking for specific details that are not publicly displayed in the item report. Arrange a safe handover after verification.",
        },
        {
            question: "What if I experience a technical problem?",
            answer:
                "Use the contact form to describe the problem. Include enough information to help the support team understand what happened.",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormStatus("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Backend integration is required to deliver messages.
        setFormStatus(
            "Your message form is ready. Connect it to your backend API to submit your message."
        );
    };

    return (
        <div className="min-h-screen bg-[#f5faf7]/85 dark:bg-[#0D0E12]/85 text-gray-800 dark:text-gray-100 flex flex-col justify-between relative z-10 transition-colors">
            <div>
                <Navbar />
                <main>

            {/* HERO */}
            <section className="relative overflow-hidden bg-emerald-800">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8">

                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-700 px-4 py-2 text-xs font-semibold text-emerald-100">
                            <MessageCircle size={15} />
                            WE ARE HERE TO HELP
                        </span>

                        <h1 className="mt-5 text-3xl font-extrabold text-white md:text-4xl">
                            Get in Touch
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-emerald-100 md:text-base">
                            Have a question about FindBack, need help with a lost
                            or found item, or experiencing a technical problem?
                            Send us a message and tell us how we can assist you.
                        </p>
                    </div>

                </div>
            </section>

            {/* CONTACT CONTENT */}
            <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                <div className="grid items-start gap-8 lg:grid-cols-3">

                    {/* CONTACT INFORMATION */}
                    <aside className="space-y-5 lg:col-span-1">

                        <div>
                            <span className="text-xs font-bold tracking-wider text-emerald-700">
                                CONTACT INFORMATION
                            </span>

                            <h2 className="mt-2 text-xl font-extrabold text-gray-900">
                                Let's Talk
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Find the information you need to connect with the
                                FindBack team.
                            </p>
                        </div>

                        <div className="glass-card flex gap-4 rounded-xl p-5 shadow-sm">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <MapPin size={21} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    University Location
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Adama Science and Technology University (ASTU)
                                    <br />
                                    Adama, Ethiopia.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card flex gap-4 rounded-xl p-5 shadow-sm">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <Mail size={21} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    Email Support
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Send your questions and inquiries using the
                                    contact form on this page.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card flex gap-4 rounded-xl p-5 shadow-sm">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <MessageCircle size={21} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    General Assistance
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Ask questions about reporting, searching, and
                                    recovering lost belongings.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={19} className="text-emerald-700" />
                                <h3 className="text-sm font-bold text-emerald-900">
                                    Need to Report an Item?
                                </h3>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Use the dedicated reporting page instead of the
                                contact form to report missing or recovered belongings.
                            </p>

                            <Link
                                to="/report-item"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
                            >
                                Go to Report Item
                                <Send size={15} />
                            </Link>
                        </div>

                    </aside>

                    {/* CONTACT FORM */}
                    <section className="glass-panel rounded-2xl p-6 shadow-xl sm:p-8 lg:col-span-2">

                        <div className="mb-7">
                            <span className="text-xs font-bold tracking-wider text-emerald-700">
                                SEND US A MESSAGE
                            </span>

                            <h2 className="mt-2 text-xl font-extrabold text-gray-900">
                                How Can We Help You?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Complete the form below with your inquiry. Provide
                                accurate information so we can understand your request.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* NAME AND EMAIL */}
                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        maxLength={100}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        required
                                        maxLength={254}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>

                            </div>

                            {/* SUBJECT */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Subject <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                                    >
                                        <option value="" disabled>
                                            Select the subject of your message
                                        </option>

                                        <option value="General Inquiry">
                                            General Inquiry
                                        </option>

                                        <option value="Lost Item Assistance">
                                            Lost Item Assistance
                                        </option>

                                        <option value="Found Item Assistance">
                                            Found Item Assistance
                                        </option>

                                        <option value="Technical Problem">
                                            Technical Problem
                                        </option>

                                        <option value="Account Problem">
                                            Account Problem
                                        </option>

                                        <option value="Feedback">
                                            Feedback and Suggestions
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Your Message <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Describe your question, concern, or feedback..."
                                    required
                                    minLength={10}
                                    maxLength={2000}
                                    rows={6}
                                    className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                                />

                                <p className="mt-2 text-right text-xs text-gray-400">
                                    {formData.message.length}/2000 characters
                                </p>
                            </div>

                            {/* FORM STATUS */}
                            {formStatus && (
                                <div
                                    role="status"
                                    className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                                >
                                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                    <p>{formStatus}</p>
                                </div>
                            )}

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
                            >
                                <Send size={17} />
                                Send Message
                            </button>

                            <p className="text-xs leading-5 text-gray-400">
                                Do not include passwords, private identification
                                numbers, or other sensitive information in your message.
                            </p>

                        </form>
                    </section>

                </div>

            </section>

            {/* FAQ SECTION */}
            <section className="border-t border-emerald-100 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                    <div className="mb-8 text-center">
                        <span className="text-xs font-bold tracking-wider text-emerald-700">
                            QUICK ANSWERS
                        </span>

                        <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                            Frequently Asked Questions
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            Find answers to common questions about using FindBack.
                        </p>
                    </div>

                    <div className="mx-auto max-w-3xl space-y-3">

                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group rounded-xl border border-emerald-100 bg-[#f8fcf9] p-5"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-gray-800">
                                    <span className="flex items-center gap-3">
                                        <HelpCircle
                                            size={18}
                                            className="shrink-0 text-emerald-600"
                                        />
                                        {faq.question}
                                    </span>

                                    <ChevronDown
                                        size={19}
                                        className="shrink-0 text-emerald-600 transition group-open:rotate-180"
                                    />
                                </summary>

                                <p className="mt-4 border-t border-gray-100 pt-4 pl-8 text-sm leading-7 text-gray-500">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}

                    </div>
                </div>
            </section>

                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
