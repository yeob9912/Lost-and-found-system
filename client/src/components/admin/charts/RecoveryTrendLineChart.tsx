import React, { useState } from "react";
import { TrendingUp, Award, Calendar } from "lucide-react";

export interface TrendPoint {
    period: string; // e.g. "Jun 2026", "Jul 2026", etc.
    recoveries: number;
}

interface RecoveryTrendLineChartProps {
    data: TrendPoint[];
    loading?: boolean;
}

export default function RecoveryTrendLineChart({ data = [], loading }: RecoveryTrendLineChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

    const totalRecoveries = data.reduce((sum, item) => sum + item.recoveries, 0);
    const maxVal = Math.max(...data.map((d) => d.recoveries), 5); // Minimum scale of 5 for visually clean SVG height

    // SVG coordinates computation
    const svgWidth = 500;
    const svgHeight = 180;
    const paddingX = 35;
    const paddingY = 25;

    const availableWidth = svgWidth - paddingX * 2;
    const availableHeight = svgHeight - paddingY * 2;

    const points = data.map((d, idx) => {
        const x = paddingX + (data.length > 1 ? (idx / (data.length - 1)) * availableWidth : availableWidth / 2);
        const y = paddingY + availableHeight - (d.recoveries / maxVal) * availableHeight;
        return { x, y, ...d };
    });

    // Generate smooth SVG bezier line curve
    const pathD = points.length === 0
        ? ""
        : points.reduce((acc, curr, idx, arr) => {
              if (idx === 0) return `M ${curr.x} ${curr.y}`;
              const prev = arr[idx - 1];
              const cpX1 = prev.x + (curr.x - prev.x) / 2;
              const cpY1 = prev.y;
              const cpX2 = prev.x + (curr.x - prev.x) / 2;
              const cpY2 = curr.y;
              return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
          }, "");

    // Area closed path for lush gradient fill
    const areaD = points.length === 0
        ? ""
        : `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

    return (
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]/60 dark:border-[#2A2D35]/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={19} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#111827] dark:text-[#F3F4F6] tracking-tight">
                            Item Recovery Trends
                        </h3>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                            Completed owner returns &amp; claim handoffs over time
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                        <Award size={13} />
                        <span className="font-bold">{totalRecoveries}</span> Recovered
                    </span>
                </div>
            </div>

            {/* Line Chart Area */}
            <div className="py-4 flex-1 flex flex-col justify-center min-h-[220px]">
                {loading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="relative w-full">
                        {/* Interactive floating tooltip */}
                        {hoveredPoint && (
                            <div className="absolute top-2 right-4 z-30 rounded-xl bg-[#0D0E12] text-white text-xs py-1.5 px-3 shadow-xl border border-white/10 animate-in fade-in duration-150">
                                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                                    <Calendar size={11} />
                                    {hoveredPoint.period}
                                </div>
                                <div className="font-bold text-emerald-400 text-sm">
                                    {hoveredPoint.recoveries} items returned
                                </div>
                            </div>
                        )}

                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-44 overflow-visible"
                        >
                            <defs>
                                <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Background Horizontal Benchmark Lines */}
                            <line
                                x1={paddingX}
                                y1={paddingY}
                                x2={svgWidth - paddingX}
                                y2={paddingY}
                                stroke="currentColor"
                                strokeDasharray="4 4"
                                className="text-slate-200 dark:text-[#2A2D35]"
                            />
                            <line
                                x1={paddingX}
                                y1={paddingY + availableHeight / 2}
                                x2={svgWidth - paddingX}
                                y2={paddingY + availableHeight / 2}
                                stroke="currentColor"
                                strokeDasharray="4 4"
                                className="text-slate-200 dark:text-[#2A2D35]"
                            />
                            <line
                                x1={paddingX}
                                y1={svgHeight - paddingY}
                                x2={svgWidth - paddingX}
                                y2={svgHeight - paddingY}
                                stroke="currentColor"
                                className="text-slate-300 dark:text-[#323642]"
                            />

                            {/* Gradient Area Fill */}
                            {areaD && (
                                <path
                                    d={areaD}
                                    fill="url(#recoveryGradient)"
                                    className="transition-all duration-700 ease-out"
                                />
                            )}

                            {/* Smooth Connecting Line */}
                            {pathD && (
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-sm transition-all duration-700 ease-out"
                                />
                            )}

                            {/* Interactive Coordinate Dots */}
                            {points.map((pt, idx) => {
                                const isHovered = hoveredPoint?.period === pt.period;
                                return (
                                    <g
                                        key={idx}
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredPoint(pt)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    >
                                        {/* Outer hover ring */}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? 9 : 6}
                                            fill="#10B981"
                                            fillOpacity={isHovered ? 0.3 : 0.15}
                                            className="transition-all duration-200"
                                        />
                                        {/* Solid center dot */}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? 5.5 : 4}
                                            fill="#10B981"
                                            stroke="#FFFFFF"
                                            strokeWidth="2"
                                            className="transition-all duration-200 shadow-sm"
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* X-axis Date/Month Labels */}
                        <div className="flex justify-between px-2 pt-2 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                            {data.map((d, i) => (
                                <span
                                    key={i}
                                    className={`transition-colors ${
                                        hoveredPoint?.period === d.period
                                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                            : ""
                                    }`}
                                >
                                    {d.period.split(" ")[0]}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Status */}
            <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-[#2A2D35]/60 flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <span>Aggregated over the last 6 months</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {totalRecoveries} verified recoveries
                </span>
            </div>
        </div>
    );
}

