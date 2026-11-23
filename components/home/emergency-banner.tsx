"use client";

import * as React from "react";
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Send,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EmergencyBanner() {
  const [assetId, setAssetId] = React.useState("MSG-CMP-01");
  const [reporterName, setReporterName] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedTicket, setSubmittedTicket] = React.useState<{
    ticketNumber: string;
    createdAt: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) {
      alert("Mohon lengkapi nama pelapor dan deskripsi gangguan.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket({
        ticketNumber: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }, 800);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setDescription("");
    setReporterName("");
  };

  return (
    <section id="laporan-cepat" className="py-16 lg:py-24 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div id="bantuan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning" className="text-xs uppercase tracking-wider font-bold">
                    Helpdesk Tiket Kerusakan
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Ajukan Laporan Gangguan / Work Order
                </CardTitle>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Kirimkan detail kendala mesin ke tim maintenance. Tiket prioritas darurat akan langsung diteruskan ke tim siaga lapangan.
                </p>
              </CardHeader>

              <CardContent>
                {submittedTicket ? (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-6 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      Laporan Berhasil Diajukan!
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                      Nomor Tiket Work Order Anda adalah{" "}
                      <span className="font-mono font-bold text-emerald-950 dark:text-emerald-50 underline">
                        {submittedTicket.ticketNumber}
                      </span>{" "}
                      diterbitkan pada pukul {submittedTicket.createdAt}. Petugas teknisi piket telah menerima notifikasi dispatch.
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="border-emerald-300 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                      >
                        Ajukan Laporan Lain
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Machine Select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Unit Mesin / Aset
                        </label>
                        <select
                          value={assetId}
                          onChange={(e) => setAssetId(e.target.value)}
                          className="w-full h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="MSG-CMP-01">MSG-CMP-01 • Kompresor Screw High-Pressure</option>
                          <option value="MSG-BLR-02">MSG-BLR-02 • Boiler Uap Pembangkit Line A</option>
                          <option value="MSG-CHL-03">MSG-CHL-03 • Pompa Sirkulasi Chiller Sentral</option>
                          <option value="MSG-GEN-01">MSG-GEN-01 • Genset Darurat 750kVA</option>
                          <option value="MSG-CNC-05">MSG-CNC-05 • Mesin CNC Milling 5-Axis</option>
                          <option value="MSG-CNV-04">MSG-CNV-04 • Conveyor Belt Distribusi</option>
                          <option value="OTHER">Lainnya / Unit Belum Terdaftar</option>
                        </select>
                      </div>

                      {/* Reporter Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Nama Pelapor / Departemen
                        </label>
                        <Input
                          placeholder="Cth: Joko (Produksi Line 2)"
                          value={reporterName}
                          onChange={(e) => setReporterName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Priority Radio Buttons */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Tingkat Prioritas Kerusakan
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <label
                          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            priority === "low"
                              ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 text-zinc-900 dark:text-zinc-100"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value="low"
                            className="sr-only"
                            checked={priority === "low"}
                            onChange={() => setPriority("low")}
                          />
                          <span>Rutin / Ringan</span>
                        </label>

                        <label
                          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            priority === "medium"
                              ? "bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value="medium"
                            className="sr-only"
                            checked={priority === "medium"}
                            onChange={() => setPriority("medium")}
                          />
                          <span>Sedang</span>
                        </label>

                        <label
                          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            priority === "high"
                              ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-700 dark:text-rose-300"
                              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value="high"
                            className="sr-only"
                            checked={priority === "high"}
                            onChange={() => setPriority("high")}
                          />
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-rose-600" />
                            Kritis / Mesin Mati
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Deskripsi Masalah / Indikasi Bunyi / Suhu
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan secara spesifik: apakah ada bunyi getaran asing, kebocoran oli/angin, bau terbakar, atau panel trip..."
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
                    >
                      <Send className="h-4 w-4" />
                      <span>Terbitkan Tiket Work Order</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Emergency & Support Info Side */}
          <div className="lg:col-span-5 space-y-6">
            {/* Urgent Dispatch Hotline */}
            <div className="rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white p-6 shadow-lg shadow-rose-600/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  RESPON CEPAT
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold">Hotline Darurat Kerusakan</h4>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                  Jika terjadi insiden fatal, kebocoran bahan kimia, percikan api listrik, atau mesin utama pabrik mati mendadak, segera hubungi via radio atau telepon interkom.
                </p>
              </div>
              <div className="pt-2 border-t border-rose-500/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs text-rose-100 flex items-center gap-1.5">
                    <PhoneCall className="h-4 w-4" />
                    Telepon Intercom:
                  </span>
                  <span className="font-mono font-bold text-base">Ext. 401 / 402</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs text-rose-100 flex items-center gap-1.5">
                    <Radio className="h-4 w-4" />
                    Saluran Handy Talkie (HT):
                  </span>
                  <span className="font-mono font-bold text-base">Channel 4 (Maintenance)</span>
                </div>
              </div>
            </div>

            {/* Quick Guidelines Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Target SLA Respon Teknisi
                </h4>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                  <span className="font-medium text-rose-600 dark:text-rose-400">
                    Prioritas Kritis (Breakdown)
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    Maks. 15 Menit
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    Prioritas Sedang (Degradasi)
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    Maks. 2 Jam
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">
                    Prioritas Rutin (PM / Inspeksi)
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    Sesuai Jadwal
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
