import * as React from "react";
import Link from "next/link";
import { Wrench, PhoneCall, Mail, MapPin, Database, ShieldAlert, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50">
                  Maintenance System
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  Maintenance System & CMMS
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-sm">
              Sistem manajemen pemeliharaan, perawatan fasilitas, dan monitoring keandalan aset mesin secara terpusat. Mengoptimalkan performa operasional serta meminimalkan downtime tak terduga.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                <Database className="h-3.5 w-3.5 text-blue-500" />
                DB: MariaDB / MySQL
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                Next.js 16 • Turbopack
              </span>
            </div>
          </div>

          {/* Column 1: Modul */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Modul CMMS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#monitoring" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Inventarisasi Mesin
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Preventive Maintenance
                </Link>
              </li>
              <li>
                <Link href="#alur-kerja" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Work Order (WO)
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Katalog Suku Cadang
                </Link>
              </li>
              <li>
                <Link href="#monitoring" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Analisis MTTR & MTBF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Alur Pemeliharaan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Operasional & K3
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#alur-kerja" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  SOP Perbaikan Mesin
                </Link>
              </li>
              <li>
              </li>
              <li>
                <Link href="#monitoring" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Checklist Inspeksi Harian
                </Link>
              </li>
              <li>
                <Link href="#monitoring" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Prosedur Tanggap Darurat
                </Link>
              </li>
              <li>
                <Link href="#alur-kerja" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Verifikasi & Kalibrasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Maintenance Operations Center */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Pusat Kendali MOC
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-xs">
                  Maintenance Operations Center, Gedung Rekayasa & Workshop
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-mono">Hotline: Ext. 401 / 402</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-mono">maintenance@internal</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Emergency Dispatch: 24/7 Siaga
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-500 dark:text-zinc-400">
            &copy; 2026 Maintenance System. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            <span>Versi Sistem 1.0.0-PROD</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Semua Modul Aktif
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
