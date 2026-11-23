import * as React from "react";
import { cn } from "@/lib/utils";

export type SystemStatusType =
  | "operational"
  | "warning"
  | "critical"
  | "in-progress"
  | "scheduled"
  | "standby";

export interface StatusPillProps {
  status: SystemStatusType;
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  SystemStatusType,
  {
    defaultLabel: string;
    bgClass: string;
    textClass: string;
    dotClass: string;
    borderClass: string;
  }
> = {
  operational: {
    defaultLabel: "Normal / Operasional",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    textClass: "text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    borderClass: "border-emerald-200 dark:border-emerald-800/60",
  },
  warning: {
    defaultLabel: "Perlu Perhatian",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    textClass: "text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
    borderClass: "border-amber-200 dark:border-amber-800/60",
  },
  critical: {
    defaultLabel: "Kerusakan Kritis",
    bgClass: "bg-rose-50 dark:bg-rose-950/40",
    textClass: "text-rose-700 dark:text-rose-300",
    dotClass: "bg-rose-500",
    borderClass: "border-rose-200 dark:border-rose-800/60",
  },
  "in-progress": {
    defaultLabel: "Sedang Dikerjakan",
    bgClass: "bg-blue-50 dark:bg-blue-950/40",
    textClass: "text-blue-700 dark:text-blue-300",
    dotClass: "bg-blue-500",
    borderClass: "border-blue-200 dark:border-blue-800/60",
  },
  scheduled: {
    defaultLabel: "Terjadwal (PM)",
    bgClass: "bg-purple-50 dark:bg-purple-950/40",
    textClass: "text-purple-700 dark:text-purple-300",
    dotClass: "bg-purple-500",
    borderClass: "border-purple-200 dark:border-purple-800/60",
  },
  standby: {
    defaultLabel: "Siaga / Standby",
    bgClass: "bg-zinc-100 dark:bg-zinc-800/60",
    textClass: "text-zinc-700 dark:text-zinc-300",
    dotClass: "bg-zinc-400",
    borderClass: "border-zinc-200 dark:border-zinc-700",
  },
};

export function StatusPill({
  status,
  label,
  pulse = true,
  size = "md",
  className,
}: StatusPillProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-colors select-none",
        config.bgClass,
        config.textClass,
        config.borderClass,
        size === "sm" ? "px-2 py-0.5 text-xs gap-1.5" : "px-2.5 py-1 text-xs gap-2",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dotClass
            )}
          />
        )}
        <span
          className={cn("relative inline-flex h-2 w-2 rounded-full", config.dotClass)}
        />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
}
