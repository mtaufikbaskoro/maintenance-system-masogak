import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/home/hero-section";
import { LiveMonitoringPreview } from "@/components/home/live-monitoring-preview";
import { FeaturesSection } from "@/components/home/features-section";
import { WorkflowSection } from "@/components/home/workflow-section";
import { EmergencyBanner } from "@/components/home/emergency-banner";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Sticky Top Header Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Overview & Metrics */}
        <HeroSection />

        {/* Live Asset Telemetry & Work Order Feed */}
        <LiveMonitoringPreview />

        {/* Core CMMS Modules & Capabilities */}
        <FeaturesSection />

        {/* Standard Maintenance Lifecycle Workflow */}
        <WorkflowSection />

        {/* Emergency Ticket Submission & Support Dispatch */}
        <EmergencyBanner />
      </main>

      {/* Enterprise System Footer */}
      <Footer />
    </div>
  );
}
