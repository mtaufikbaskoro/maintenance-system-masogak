import * as React from "react";
import {
  CalendarCheck,
  ClipboardList,
  Cpu,
  Package,
  AlertOctagon,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: CalendarCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    border: "border-blue-100 dark:border-blue-900/40",
    title: "Preventive Maintenance Terjadwal",
    description:
      "Atur jadwal perawatan berkala otomatis berdasarkan jam operasi mesin (run-hours) atau periode kalender untuk mencegah kerusakan mendadak.",
    highlights: ["Otomatisasi jadwal PM", "Notifikasi pengingat teknisi", "Checklist standar operasional"],
  },
  {
    icon: ClipboardList,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
    border: "border-indigo-100 dark:border-indigo-900/40",
    title: "Manajemen Work Order Digital",
    description:
      "Alur penerbitan tiket kerja dari laporan kerusakan hingga verifikasi mandor. Dokumentasi foto sebelum dan sesudah perbaikan.",
    highlights: ["Alur penugasan terstruktur", "Checklist digital mobile", "Tanda tangan verifikasi"],
  },
  {
    icon: Cpu,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/60",
    border: "border-cyan-100 dark:border-cyan-900/40",
    title: "Database Aset & Tagging Mesin",
    description:
      "Inventarisasi lengkap seluruh mesin industri, penomoran seri, manual buku pabrikan, skema kabel, dan buku riwayat perbaikan.",
    highlights: ["QR Code / Barcode Scanner", "Buku riwayat pemeliharaan", "Spesifikasi vendor terpusat"],
  },
  {
    icon: Package,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    border: "border-emerald-100 dark:border-emerald-900/40",
    title: "Kontrol Suku Cadang & Spareparts",
    description:
      "Pantau ketersediaan komponen suku cadang kritis di gudang bengkel, tentukan batas minimum buffer stock, dan log pemakaian per unit.",
    highlights: ["Peringatan stok kritis", "Pencatatan nomor seri part", "Kalkulasi biaya komponen"],
  },
  {
    icon: AlertOctagon,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/60",
    border: "border-rose-100 dark:border-rose-900/40",
    title: "Respon Cepat Breakdown Darurat",
    description:
      "Kanal pelaporan darurat untuk operator lapangan saat mesin berhenti. Dispatch tim tanggap darurat dengan target penanganan secepatnya.",
    highlights: ["Eskalasi prioritas tinggi", "Notifikasi gangguan", "Pelacakan downtime mesin"],
  },
  {
    icon: BarChart3,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    border: "border-amber-100 dark:border-amber-900/40",
    title: "Analitik Keandalan & Efisiensi",
    description:
      "Laporan statistik komprehensif metrik keandalan industri seperti MTBF (Mean Time Between Failures), MTTR, dan biaya perawatan total.",
    highlights: ["Perhitungan MTTR & MTBF", "Grafik downtime mingguan", "Ekspor laporan audit K3"],
  },
];

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-16 lg:py-24 bg-zinc-50/70 dark:bg-zinc-900/30 border-y border-zinc-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="KAPABILITAS SISTEM"
          badgeVariant="default"
          title="Modul Lengkap Pemeliharaan"
          description="Dirancang khusus untuk mendukung operasional fasilitas dan mesin industri dengan standar keandalan tinggi dan efisiensi terukur."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} border ${feature.border}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-600">
                      0{idx + 1}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
                    {feature.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
