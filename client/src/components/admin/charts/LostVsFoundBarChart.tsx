import React, { useState } from "react";
import { BarChart3, Info } from "lucide-react";

interface LostVsFoundBarChartProps {
    lost: number;
    found: number;
    loading?: boolean;
}

export default function LostVsFoundBarChart({ lost, found, loading }: LostVsFoundBarChartProps) {
    const [hoveredBar, setHoveredBar] = useState<"lost" | "found" | null>(null);

    const total = lost + found;
    const maxVal = Math.max(lost, found, 5); // Minimum scale of 5 for visually appealing baseline

    const lostPercent = total > 0 ? Math.round((lost / total) * 100) : 0;
    const foundPercent = total > 0 ? Math.round((found / total) * 100) : 0;

    const lostHeightPct = Math.round((lost / maxVal) * 100);
    const foundHeightPct = Math.round((found / maxVal) * 100);

    return (
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]/60 dark:border-[#2A2D35]/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
                        <BarChart3 size={19} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#111827] dark:text-[#F3F4F6] tracking-tight">
                            Lost vs. Found Items
                        </h3>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            Volume comparison across reported items
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1F222A] text-[#6B7280] dark:text-[#9CA3AF]">
                    <span className="font-bold text-[#111827] dark:text-[#F3F4F6]">{total}</span> Total
                </div>
            </div>

            {/* Chart Area */}
            <div className="py-6 flex-1 flex flex-col justify-end min-h-[220px]">
                {loading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="relative flex h-48 items-end justify-center gap-10 sm:gap-16 pt-8 pb-2 px-4">
                        {/* Background grid guide lines */}
                        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10">
                            <div className="border-b border-[#6B7280] border-dashed w-full" />
                            <div className="border-b border-[#6B7280] border-dashed w-full" />
                            <div className="border-b border-[#6B7280] border-dashed w-full" />
                        </div>

                        {/* Bar 1: Lost Items */}
                        <div
                            className="relative flex flex-col items-center group cursor-pointer z-10"
                            onMouseEnter={() => setHoveredBar("lost")}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {/* Hover Tooltip */}
                            {hoveredBar === "lost" && (
                                <div className="absolute -top-14 z-30 rounded-xl bg-[#0D0E12] text-white text-xs py-1.5 px-3 shadow-xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap">
                                    <div className="font-bold text-rose-400">Reported Lost</div>
                                    <div className="text-[11px] text-gray-300">
                                        {lost} items ({lostPercent}%)
                                    </div>
                                </div>
                            )}

                            {/* Bar Graphic */}
                            <div className="w-16 sm:w-20 rounded-t-2xl overflow-hidden bg-rose-500/15 flex items-end p-1 transition-all duration-300 group-hover:scale-[1.03]">
                                <div
                                    style={{ height: `${Math.max(lostHeightPct, 6)}%` }}
                                    className="w-full rounded-t-xl bg-gradient-to-t from-rose-600 to-rose-400 shadow-md shadow-rose-500/30 transition-all duration-700 ease-out flex items-start justify-center pt-2"
                                >
                                    <span className="text-xs font-black text-white drop-shadow-sm">
                                        {lost}
                                    </span>
                                </div>
                            </div>

                            <span className="mt-3 text-xs font-bold text-rose-600 dark:text-rose-400">
                                Lost Items
                            </span>
                            <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                                {lostPercent}%
                            </span>
                        </div>

                        {/* Bar 2: Found Items */}
                        <div
                            className="relative flex flex-col items-center group cursor-pointer z-10"
                            onMouseEnter={() => setHoveredBar("found")}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {/* Hover Tooltip */}
                            {hoveredBar === "found" && (
                                <div className="absolute -top-14 z-30 rounded-xl bg-[#0D0E12] text-white text-xs py-1.5 px-3 shadow-xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap">
                                    <div className="font-bold text-emerald-400">Found Belongings</div>
                                    <div className="text-[11px] text-gray-300">
                                        {found} items ({foundPercent}%)
                                    </div>
                                </div>
                            )}

                            {/* Bar Graphic */}
                            <div className="w-16 sm:w-20 rounded-t-2xl overflow-hidden bg-emerald-500/15 flex items-end p-1 transition-all duration-300 group-hover:scale-[1.03]">
                                <div
                                    style={{ height: `${Math.max(foundHeightPct, 6)}%` }}
                                    className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30 transition-all duration-700 ease-out flex items-start justify-center pt-2"
                                >
                                    <span className="text-xs font-black text-white drop-shadow-sm">
                                        {found}
                                    </span>
                                </div>
                            </div>

                            <span className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                Found Items
                            </span>
                            <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                                {foundPercent}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Insight */}
            <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-[#2A2D35]/60 flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                    <Info size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Live database reporting ratio</span>
                </div>
                <span className="font-bold text-[#111827] dark:text-[#F3F4F6]">
                    {found > 0 ? (lost / found).toFixed(1) : lost} : 1 ratio
                </span>
            </div>
        </div>
    );
}

