import * as React from "react";
import {
  Wrench,
  Activity,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-b from-blue-50/40 via-white to-zinc-50 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              SISTEM PEMELIHARAAN
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Ringkasan operasional
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
              Pantau kondisi aset dan tindak lanjut pemeliharaan dalam satu tempat.
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Total Aset & Mesin"
            value="432 Unit"
            subValue="12 Kategori"
            icon={<Wrench className="h-5 w-5" />}
            trend={{
              value: "98.4%",
              isPositive: true,
              label: "Kesiapan Operasional",
            }}
          />
          <MetricCard
            title="Work Order Aktif"
            value="16 Berjalan"
            subValue="4 Prioritas Tinggi"
            icon={<Clock className="h-5 w-5" />}
            trend={{
              value: "100%",
              isPositive: true,
              label: "Teknisi Ditugaskan",
            }}
          />
          <MetricCard
            title="Kepatuhan PM (Rutin)"
            value="99.2%"
            subValue="Target: 98%"
            icon={<CheckCircle2 className="h-5 w-5" />}
            trend={{
              value: "+1.8%",
              isPositive: true,
              label: "vs Bulan Lalu",
            }}
          />
          <MetricCard
            title="Rata-rata Respon (MTTR)"
            value="24 Menit"
            subValue="Target < 30m"
            icon={<Activity className="h-5 w-5" />}
            trend={{
              value: "-6 Menit",
              isPositive: true,
              label: "Lebih Cepat",
            }}
          />
        </div>
      </div>
    </section>
  );
}
