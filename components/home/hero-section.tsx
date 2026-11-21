import * as React from "react";
import {
  Wrench,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-b from-blue-50/40 via-white to-zinc-50 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Platform Keandalan Fasilitas & Pemeliharaan Terpadu</span>
            <span className="text-zinc-400 dark:text-zinc-500">•</span>
            <span className="text-blue-800 dark:text-blue-200 font-bold">MASOGAK v1.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
            Sistem Pemeliharaan &{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Perawatan Aset Mesin
            </span>{" "}
            MASOGAK
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            Optimalkan keandalan seluruh fasilitas produksi, otomatisasi jadwal preventive maintenance, kelola tiket kerusakan darurat, dan tekan waktu downtime mesin hingga batas minimum.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <a href="#monitoring" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">
                <Activity className="h-4 w-4" />
                <span>Buka Konsol Monitoring</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#laporan-cepat" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Ajukan Tiket Perbaikan</span>
              </Button>
            </a>
          </div>

          {/* Highlight Points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Standar K3 & ISO Operasional</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span>Log Riwayat Servis Digital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardHat className="h-4 w-4 text-indigo-500" />
              <span>Tim Teknisi Siaga 24/7</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
