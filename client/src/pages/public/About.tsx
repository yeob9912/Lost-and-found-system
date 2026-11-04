import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

import React from "react";
import { Link } from "react-router-dom";
import {
    PackageSearch,
    Search,
    ClipboardList,
    MessageCircle,
    Handshake,
    Target,
    Eye,
    ShieldCheck,
    Users,
    ArrowRight,
    HeartHandshake,
    CheckCircle2,
} from "lucide-react";

const About = () => {
    const steps = [
        {
            number: "01",
            icon: ClipboardList,
            title: "Report an Item",
            description:
                "Submit a report when you lose or find an item. Include its name, category, description, location, date, and image.",
        },
        {
            number: "02",
            icon: Search,
            title: "Search Items",
            description:
                "Browse lost and found reports. Use search and category filters to identify items that match your belongings.",
        },
        {
            number: "03",
            icon: MessageCircle,
            title: "Connect",
            description:
                "Contact the relevant person through the available communication options to discuss a possible item match.",
        },
        {
            number: "04",
            icon: Handshake,
            title: "Recover Your Item",
            description:
                "Verify ownership and arrange a safe handover to return the item to its rightful owner.",
        },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: "Trust and Privacy",
            description:
                "Encouraging responsible communication and protecting users' personal information.",
        },
        {
            icon: Users,
            title: "Community Cooperation",
            description:
                "Helping ASTU students and university members support one another.",
        },
        {
            icon: HeartHandshake,
            title: "Responsibility",
            description:
                "Promoting honesty, accurate reporting, and responsible item recovery.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5faf7] text-gray-800 flex flex-col justify-between">
            <div>
                <Navbar />
                <main>

                    {/* HERO SECTION */}
                    <section className="relative overflow-hidden bg-emerald-800">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 lg:px-8">

                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-700 px-4 py-2 text-xs font-semibold text-emerald-100">
                                    <HeartHandshake size={15} />
                                    ABOUT FINDBACK
                                </span>

                                <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                                    Helping the ASTU Community
                                    <span className="block text-emerald-300">
                                        Find What Matters.
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-100">
                                    FindBack is a university-focused lost and found platform
                                    designed to help ASTU students and authorized university
                                    members report missing belongings, discover recovered
                                    items, and connect with their rightful owners.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <Link
                                        to="/lost-items"
                                        className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
                                    >
                                        Explore Lost Items
                                        <ArrowRight size={17} />
                                    </Link>

                                    <Link
                                        to="/report-item"
                                        className="rounded-lg border border-emerald-300/50 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                                    >
                                        Report an Item
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000"
                                    alt="University students working together"
                                    className="h-64 w-full rounded-2xl object-cover shadow-xl sm:h-80"
                                />

                                <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            Community First
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Supporting responsible item recovery
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ABOUT FINDBACK */}
                    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
                        <div className="grid items-center gap-10 md:grid-cols-2">

                            <div>
                                <span className="text-xs font-bold tracking-wider text-emerald-700">
                                    WHY FINDBACK EXISTS
                                </span>

                                <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                                    Making Lost and Found Easier
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    Losing personal belongings on a university campus can be
                                    frustrating. Finding them becomes even more difficult
                                    when information about lost and recovered items is
                                    scattered across different places and people.
                                </p>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    FindBack provides a centralized platform where users
                                    can report lost belongings, publish information about
                                    found items, and search existing reports without
                                    depending only on informal communication.
                                </p>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    Our goal is to make the recovery process more organized,
                                    accessible, and convenient for the ASTU community.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <PackageSearch size={25} />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    One Platform, Two Purposes
                                </h3>

                                <div className="mt-6 space-y-6">

                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                            <Search size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">
                                                Lost Items
                                            </h4>
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                Help users publish and search for belongings they
                                                have lost.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">
                                                Found Items
                                            </h4>
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                Help people report recovered belongings so their
                                                rightful owners can identify them.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>

                    {/* MISSION AND VISION */}
                    <section className="border-y border-emerald-100 bg-white">
                        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-2 lg:px-8">

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-7">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                    <Target size={22} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-gray-900">
                                    Our Mission
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-600">
                                    To provide an accessible and organized platform that
                                    connects people who have lost belongings with those who
                                    have found them, making item recovery easier within the
                                    ASTU community.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-7">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                    <Eye size={22} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-gray-900">
                                    Our Vision
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-600">
                                    To build a connected university community where lost
                                    belongings can be easily reported, identified, and
                                    returned to their rightful owners through responsible
                                    cooperation.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* HOW IT WORKS */}
                    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <span className="text-xs font-bold tracking-wider text-emerald-700">
                                SIMPLE AND ORGANIZED
                            </span>

                            <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                                How FindBack Works
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Four simple steps to help lost belongings find their way
                                back to their owners.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step) => {
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.number}
                                        className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                <Icon size={23} />
                                            </div>

                                            <span className="text-sm font-extrabold text-emerald-200">
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 text-base font-bold text-gray-900">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-gray-500">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CORE VALUES */}
                    <section className="border-y border-emerald-100 bg-white">
                        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                            <div className="mb-9 text-center">
                                <span className="text-xs font-bold tracking-wider text-emerald-700">
                                    WHAT MATTERS TO US
                                </span>

                                <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                                    Our Core Values
                                </h2>

                                <p className="mt-3 text-sm text-gray-500">
                                    The principles that guide the FindBack platform.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                {values.map((value) => {
                                    const Icon = value.icon;

                                    return (
                                        <div
                                            key={value.title}
                                            className="rounded-xl border border-gray-100 bg-[#f8fcf9] p-6 text-center"
                                        >
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                                <Icon size={23} />
                                            </div>

                                            <h3 className="mt-4 font-bold text-gray-900">
                                                {value.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                                {value.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* WHO CAN USE FINDBACK */}
                    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                        <div className="grid items-center gap-8 md:grid-cols-2">

                            <div>
                                <span className="text-xs font-bold tracking-wider text-emerald-700">
                                    OUR COMMUNITY
                                </span>

                                <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                                    Designed for the ASTU Community
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    FindBack is intended for ASTU students and authorized
                                    university community members who need a convenient way
                                    to report, search for, or recover belongings.
                                </p>

                                <div className="mt-5 space-y-3">
                                    {[
                                        "ASTU Students",

                                        "Administrative Staff",

                                    ].map((member) => (
                                        <div key={member} className="flex items-center gap-3">
                                            <CheckCircle2
                                                size={18}
                                                className="shrink-0 text-emerald-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {member}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                    <ShieldCheck size={25} />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-gray-900">
                                    Your Information Matters
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-600">
                                    FindBack encourages responsible use of personal
                                    information. Users should provide accurate item details
                                    and verify ownership before handing over belongings.
                                    Sensitive information should not be published in public
                                    item descriptions.
                                </p>
                            </div>

                        </div>
                    </section>

                </main>
            </div>
            <Footer />
        </div>
    );
};

export default About;
