"use client";

import * as React from "react";
import {
  Activity,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Flame,
  Gauge,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusPill, SystemStatusType } from "@/components/shared/status-pill";
import { Badge } from "@/components/ui/badge";

interface AssetData {
  id: string;
  name: string;
  category: string;
  location: string;
  status: SystemStatusType;
  healthScore: number;
  runtimeHours: number;
  lastService: string;
  nextService: string;
  pic: string;
  metrics: {
    temp?: string;
    pressure?: string;
    vibration?: string;
    power?: string;
  };
}

const mockAssets: AssetData[] = [
  {
    id: "MSG-CMP-01",
    name: "Kompresor Screw High-Pressure",
    category: "Pneumatik & Kompresor",
    location: "Ruang Kompresor Lantai 1",
    status: "operational",
    healthScore: 94,
    runtimeHours: 3420,
    lastService: "12 Nov 2026",
    nextService: "12 Des 2026",
    pic: "Budi Santoso",
    metrics: { temp: "72°C", pressure: "8.4 Bar", vibration: "Normal" },
  },
  {
    id: "MSG-BLR-02",
    name: "Boiler Uap Pembangkit Line A",
    category: "Pembangkit Uap & Thermal",
    location: "Ruang Utility Boiler",
    status: "warning",
    healthScore: 82,
    runtimeHours: 6180,
    lastService: "02 Nov 2026",
    nextService: "Besok, 09:00",
    pic: "Agus Setiawan",
    metrics: { temp: "168°C", pressure: "10.2 Bar", power: "32 kW" },
  },
  {
    id: "MSG-CHL-03",
    name: "Pompa Sirkulasi Chiller Sentral",
    category: "Sistem Pendingin HVAC",
    location: "Gedung Pendingin Barat",
    status: "in-progress",
    healthScore: 68,
    runtimeHours: 4890,
    lastService: "Hari ini (Ongoing)",
    nextService: "Sedang Dikerjakan",
    pic: "Hendra Wijaya",
    metrics: { temp: "42°C", vibration: "Perlu Kalibrasi", pressure: "4.1 Bar" },
  },
  {
    id: "MSG-GEN-01",
    name: "Genset Darurat Standby 750kVA",
    category: "Pembangkit Daya Cadangan",
    location: "Powerhouse Gardu Utama",
    status: "operational",
    healthScore: 99,
    runtimeHours: 412,
    lastService: "18 Nov 2026",
    nextService: "18 Des 2026",
    pic: "Bambang Tri",
    metrics: { power: "Siaga Otomatis", temp: "28°C" },
  },
  {
    id: "MSG-CNC-05",
    name: "Mesin CNC Milling 5-Axis Presisi",
    category: "Mesin Fabrikasi Produksi",
    location: "Lantai Workshop Presisi",
    status: "operational",
    healthScore: 96,
    runtimeHours: 1840,
    lastService: "05 Nov 2026",
    nextService: "05 Des 2026",
    pic: "Rian Pratama",
    metrics: { vibration: "Sangat Stabil", power: "18.5 kW" },
  },
  {
    id: "MSG-CNV-04",
    name: "Conveyor Belt Jalur Distribusi",
    category: "Material Handling & Konveyor",
    location: "Gudang Logistik Sektor B",
    status: "scheduled",
    healthScore: 78,
    runtimeHours: 5120,
    lastService: "25 Okt 2026",
    nextService: "23 Nov 2026",
    pic: "Tim Mekanik 2",
    metrics: { temp: "38°C", vibration: "Toleransi Normal" },
  },
];

export function LiveMonitoringPreview() {
  const [filter, setFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "warning"
        ? asset.status === "warning"
        : filter === "in-progress"
        ? asset.status === "in-progress"
        : filter === "operational"
        ? asset.status === "operational"
        : filter === "scheduled"
        ? asset.status === "scheduled"
        : true;

    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <section id="monitoring" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <SectionHeader
        badge="MONITORING REAL-TIME"
        badgeVariant="info"
        title="Pemantauan Langsung Unit Aset & Mesin"
        description="Pantau indikator performa vital mesin, skor kesehatan komponen, dan status operasional harian secara terpadu."
      />

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Semua Aset ({mockAssets.length})
          </button>
          <button
            onClick={() => setFilter("operational")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "operational"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Normal (3)
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "in-progress"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Sedang Diservis (1)
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "warning"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Perlu Perhatian (1)
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === "scheduled"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            PM Terjadwal (1)
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari ID aset, nama, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card
            key={asset.id}
            hoverEffect
            className="border-zinc-200 dark:border-zinc-800/90 flex flex-col justify-between"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/40">
                  {asset.id}
                </span>
                <StatusPill status={asset.status} size="sm" />
              </div>
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                {asset.name}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span>{asset.location}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Health Score & Runtime */}
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                    Health Score Mesin
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`text-xl font-black ${
                        asset.healthScore >= 90
                          ? "text-emerald-600 dark:text-emerald-400"
                          : asset.healthScore >= 75
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {asset.healthScore}%
                    </span>
                    <span className="text-[10px] text-zinc-400">/ 100%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                    Total Runtime
                  </span>
                  <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {asset.runtimeHours.toLocaleString()} Jam
                  </span>
                </div>
              </div>

              {/* Sensor Telemetry snapshot */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {asset.metrics.temp && (
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Flame className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="text-[11px]">Suhu:</span>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {asset.metrics.temp}
                    </span>
                  </div>
                )}
                {asset.metrics.pressure && (
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Gauge className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="text-[11px]">Tekanan:</span>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {asset.metrics.pressure}
                    </span>
                  </div>
                )}
                {asset.metrics.power && (
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="text-[11px]">Daya:</span>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {asset.metrics.power}
                    </span>
                  </div>
                )}
                {asset.metrics.vibration && (
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Activity className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="text-[11px]">Vibrasi:</span>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      {asset.metrics.vibration}
                    </span>
                  </div>
                )}
              </div>

              {/* Maintenance Schedule & PIC */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="truncate max-w-[120px]">{asset.pic}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {asset.nextService}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Work Order Activity Feed */}
      <div className="mt-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Log Aktivitas Work Order Terkini</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pembaruan penanganan teknisi langsung dari lantai operasional
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Auto-Sync: Tiap 30s
          </Badge>
        </div>

        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  WO-104: Inspeksi Kelistrikan Panel Distribusi 380V Selesai
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  PIC: Budi Santoso • Verifikasi isolasi kabel & beban fase seimbang
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">12 Menit Lalu</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                <Wrench className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  WO-105: Pergantian Seal Pompa Chiller MSG-CHL-03 Sedang Berlangsung
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  PIC: Hendra Wijaya • Pembongkaran housing pompa dan pembersihan impeller
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Aktif Sekarang
            </span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  WO-106: Kalibrasi Katup Pengaman Boiler MSG-BLR-02 Dijadwalkan
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  PIC: Agus Setiawan • Menunggu jendela waktu shutdown produksi
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">Besok, 09:00</span>
          </div>
        </div>
      </div>
    </section>
  );
}
