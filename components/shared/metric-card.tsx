import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  subValue,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card
      hoverEffect
      className={cn(
        "p-6 flex flex-col justify-between border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {value}
            </span>
            {subValue && (
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {subValue}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "font-semibold inline-flex items-center gap-0.5 rounded px-1.5 py-0.5",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
            )}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-zinc-500 dark:text-zinc-400">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
