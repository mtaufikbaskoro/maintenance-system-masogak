import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info";
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  badge,
  badgeVariant = "default",
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-3 mb-10 md:mb-14",
        align === "center" ? "items-center text-center max-w-2xl mx-auto" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <Badge variant={badgeVariant} className="px-3 py-1 font-semibold tracking-wide uppercase text-[11px]">
          {badge}
        </Badge>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
