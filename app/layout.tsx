import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MASOGAK Maintenance System - Sistem Manajemen Pemeliharaan & Perawatan Terpadu",
  description:
    "Platform terpadu untuk monitoring keandalan aset mesin, penjadwalan preventive maintenance otomatis, pelacakan work order, dan respon darurat operasional MASOGAK.",
  keywords: [
    "MASOGAK",
    "Maintenance System",
    "CMMS",
    "Pemeliharaan Mesin",
    "Preventive Maintenance",
    "Work Order",
    "Manajemen Aset Pabrik",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
