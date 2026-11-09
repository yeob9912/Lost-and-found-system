import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StatisticsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    color?: "blue" | "green" | "orange" | "purple" | "red";
}

const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
};

export default function StatisticsCard({
    title,
    value,
    description,
    icon: Icon,
    color = "blue",
}: StatisticsCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-800">{value}</h2>
                </div>

                <div className={`rounded-xl p-3 ${colors[color]}`}>
                    <Icon size={25} />
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp size={14} className="text-emerald-500" />
                {description}
            </div>
        </div>
    );
}