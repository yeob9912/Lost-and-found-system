import React, { useState } from "react";
import { PieChart, PieChart as PieIcon } from "lucide-react";

export interface StatusSegment {
    status: "Lost" | "Found" | "Claimed" | "Returned";
    count: number;
    color: string;
}

interface ItemStatusPieChartProps {
    data: StatusSegment[];
    loading?: boolean;
}

const DEFAULT_SEGMENTS: StatusSegment[] = [
    { status: "Lost", count: 0, color: "#F43F5E" },      // Rose
    { status: "Found", count: 0, color: "#F59E0B" },     // Amber
    { status: "Claimed", count: 0, color: "#0EA5E9" },   // Sky
    { status: "Returned", count: 0, color: "#10B981" },  // Emerald
];

export default function ItemStatusPieChart({ data = DEFAULT_SEGMENTS, loading }: ItemStatusPieChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const total = data.reduce((acc, curr) => acc + curr.count, 0);

    // SVG Donut geometry
    const size = 200;
    const strokeWidth = 26;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = 0;

    return (
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]/60 dark:border-[#2A2D35]/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                        <PieIcon size={19} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#111827] dark:text-[#F3F4F6] tracking-tight">
                            Item Status Distribution
                        </h3>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            Current lifecycle distribution across all items
                        </p>
                    </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1F222A] text-[#6B7280] dark:text-[#9CA3AF]">
                    4 Categories
                </span>
            </div>

            {/* Chart Graphic Area */}
            <div className="py-6 flex-1 flex flex-col items-center justify-center min-h-[220px]">
                {loading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="relative flex items-center justify-center">
                        <svg width={size} height={size} className="transform -rotate-90">
                            {/* Empty background track */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="currentColor"
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                className="text-slate-100 dark:text-[#252830]"
                            />

                            {/* Render segments if total > 0 */}
                            {total > 0 &&
                                data.map((seg, idx) => {
                                    if (seg.count <= 0) return null;
                                    const fraction = seg.count / total;
                                    const strokeDasharray = `${fraction * circumference} ${circumference}`;
                                    const strokeDashoffset = -accumulatedAngle * circumference;
                                    accumulatedAngle += fraction;

                                    const isHovered = hoveredIdx === idx;

                                    return (
                                        <circle
                                            key={seg.status}
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            stroke={seg.color}
                                            strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            fill="transparent"
                                            className="transition-all duration-300 cursor-pointer"
                                            style={{
                                                filter: isHovered ? `drop-shadow(0 0 8px ${seg.color})` : "none",
                                            }}
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                        />
                                    );
                                })}
                        </svg>

                        {/* Center Donut Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {hoveredIdx !== null && data[hoveredIdx] ? (
                                <div className="text-center animate-in fade-in zoom-in-95 duration-150">
                                    <span
                                        className="text-xs font-bold uppercase tracking-wider block"
                                        style={{ color: data[hoveredIdx].color }}
                                    >
                                        {data[hoveredIdx].status}
                                    </span>
                                    <span className="text-2xl font-black text-[#111827] dark:text-[#F3F4F6]">
                                        {data[hoveredIdx].count}
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] block">
                                        {Math.round((data[hoveredIdx].count / (total || 1)) * 100)}%
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <span className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] block">
                                        Total Items
                                    </span>
                                    <span className="text-2xl font-black text-[#111827] dark:text-[#F3F4F6]">
                                        {total}
                                    </span>
                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                                        Live Status
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Legend */}
            <div className="pt-4 border-t border-[#E2E8F0]/60 dark:border-[#2A2D35]/60 grid grid-cols-2 gap-2 text-xs">
                {data.map((seg, idx) => {
                    const percent = total > 0 ? Math.round((seg.count / total) * 100) : 0;
                    const isHovered = hoveredIdx === idx;

                    return (
                        <div
                            key={seg.status}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors ${
                                isHovered
                                    ? "bg-slate-100/80 dark:bg-[#252830]/80 font-bold"
                                    : "hover:bg-slate-50 dark:hover:bg-[#1F222A]"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: seg.color }}
                                />
                                <span className="text-[#111827] dark:text-[#F3F4F6]">{seg.status}</span>
                            </div>
                            <span className="font-bold text-[#6B7280] dark:text-[#9CA3AF]">
                                {seg.count} <span className="text-[10px] font-normal">({percent}%)</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

