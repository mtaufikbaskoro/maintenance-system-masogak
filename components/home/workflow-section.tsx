import * as React from "react";
import {
  FileText,
  UserCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const steps = [
  {
    step: "01",
    icon: FileText,
    title: "Pelaporan Gangguan / Jadwal PM",
    description:
      "Operator mengajukan tiket kerusakan via portal atau sistem otomatis men-trigger Work Order berdasarkan jadwal pemeliharaan rutin.",
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Validasi & Penugasan Teknisi",
    description:
      "Supervisor maintenance mengevaluasi tingkat keparahan (severity), ketersediaan suku cadang, dan menugaskan teknisi ahli yang tepat.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Eksekusi Lapangan Sesuai SOP",
    description:
      "Teknisi melakukan isolasi mesin (LOTO), perbaikan fisik, penggantian komponen, dan mengisi checklist digital langkah demi langkah.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Testing, Approval & Penutupan",
    description:
      "Uji coba mesin running tanpa beban, verifikasi hasil oleh supervisor, tanda tangan digital, serta pembaruan otomatis buku riwayat servis.",
    color: "from-emerald-500 to-teal-600",
  },
];

export function WorkflowSection() {
  return (
    <section id="alur-kerja" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <SectionHeader
        badge="ALUR PROSES STANDAR"
        badgeVariant="secondary"
        title="Alur Kerja Siklus Pemeliharaan"
        description="SOP transparan dan terstandarisasi untuk memastikan setiap pengerjaan pemeliharaan mesin selesai tepat waktu dengan dokumentasi lengkap."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 flex flex-col justify-between shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-blue-500/30 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
