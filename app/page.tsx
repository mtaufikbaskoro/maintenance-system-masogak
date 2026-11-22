import { MaintenanceDashboard } from "@/components/maintenance/dashboard";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { connection } from "next/server";

export default function Home() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f7f8fa] p-10 text-sm text-slate-500">Memuat data maintenance…</main>}><DashboardData /></Suspense>;
}

async function DashboardData() {
  await connection();
  const [plans, people] = await Promise.all([
    prisma.maintenancePlan.findMany({
      orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
      include: { _count: { select: { assignments: true, groups: true } } },
    }),
    prisma.person.findMany({ orderBy: [{ active: "desc" }, { displayName: "asc" }] }),
  ]);

  return (
    <MaintenanceDashboard
      plans={plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        weekNumber: plan.weekNumber,
        year: plan.year,
        periodStart: plan.periodStart.toISOString().slice(0, 10),
        periodEnd: plan.periodEnd.toISOString().slice(0, 10),
        site: plan.site ?? "",
        status: plan.status,
        assignmentCount: plan._count.assignments,
        groupCount: plan._count.groups,
      }))}
      people={people.map((person) => ({
        id: person.id,
        displayName: person.displayName,
        employeeCode: person.employeeCode ?? "",
        active: person.active,
      }))}
    />
  );
}
