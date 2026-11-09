import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StatisticsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    color?: "blue" | "green" | "orange" | "purple" | "red";
}

const colorMap = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    red: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

export default function StatisticsCard({
    title,
    value,
    description,
    icon: Icon,
    color = "blue",
}: StatisticsCardProps) {
    return (
        <div className="group rounded-2xl border border-[#E2E8F0] dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">{title}</p>
                    <h2 className="mt-2 text-3xl font-extrabold text-[#111827] dark:text-[#F3F4F6] tracking-tight">{value}</h2>
                </div>

                <div className={`rounded-xl p-3 transition-transform duration-200 group-hover:scale-110 ${colorMap[color]}`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{description}</span>
            </div>
        </div>
    );
}
