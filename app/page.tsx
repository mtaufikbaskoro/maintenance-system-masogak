import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/home/hero-section";
import { LiveMonitoringPreview } from "@/components/home/live-monitoring-preview";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Sticky Top Header Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Compact overview and key maintenance metrics */}
        <HeroSection />

        {/* Asset status and maintenance activity */}
        <LiveMonitoringPreview />
      </main>
    </div>
  );
}
