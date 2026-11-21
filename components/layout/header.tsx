"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Activity,
  AlertTriangle,
  Menu,
  X,
  LogIn,
  Layers,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/status-pill";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                MASOGAK
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded">
                  CMMS
                </span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                Maintenance System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="#monitoring"
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              Monitoring
            </Link>
            <Link
              href="#fitur"
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              Modul Aset
            </Link>
            <Link
              href="#alur-kerja"
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              Work Order
            </Link>
            <Link
              href="#bantuan"
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              Helpdesk
            </Link>
          </nav>

          {/* Right Action Buttons & Live Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <StatusPill status="operational" label="Sistem Online" size="sm" />
            <a href="#laporan-cepat">
              <Button variant="outline" size="sm" className="gap-1.5 border-zinc-300 dark:border-zinc-700">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>Lapor Gangguan</span>
              </Button>
            </a>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
              <LogIn className="h-3.5 w-3.5" />
              <span>Portal Masuk</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <StatusPill status="operational" label="Online" size="sm" className="text-[10px]" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            <Link
              href="#monitoring"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Activity className="h-4 w-4 text-blue-500" />
              Monitoring Aset
            </Link>
            <Link
              href="#fitur"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Layers className="h-4 w-4 text-indigo-500" />
              Modul Sistem & Fitur
            </Link>
            <Link
              href="#alur-kerja"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <CalendarCheck className="h-4 w-4 text-emerald-500" />
              Alur Work Order
            </Link>
            <Link
              href="#bantuan"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              Pusat Bantuan & SOP
            </Link>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <a href="#laporan-cepat" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Laporkan Gangguan Mesin</span>
              </Button>
            </a>
            <Button className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700">
              <LogIn className="h-4 w-4" />
              <span>Masuk Portal Teknisi</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
