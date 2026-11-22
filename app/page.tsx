import { MaintenanceDashboard } from "@/components/maintenance/dashboard";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { connection } from "next/server";

export default function Home() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f7f8fa] p-10 text-sm text-slate-500">Memuat data maintenance…</main>}><DashboardData /></Suspense>;
}

async function DashboardData() {
  await connection();
  const [plans, people, batches, orders, groups, assignments, areaMappings] = await Promise.all([
    prisma.maintenancePlan.findMany({
      orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
      include: { _count: { select: { assignments: true, groups: true } } },
    }),
    prisma.person.findMany({ orderBy: [{ active: "desc" }, { displayName: "asc" }] }),
    prisma.sapImportBatch.findMany({ orderBy: { importedAt: "desc" }, take: 10 }),
    prisma.sapWorkOrder.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { sourceBatch: { select: { sourceFileName: true } } } }),
    prisma.maintenanceGroup.findMany({ orderBy: [{ planId: "asc" }, { sortOrder: "asc" }, { name: "asc" }], include: { teamLeader: { select: { displayName: true } } } }),
    prisma.workAssignment.findMany({
      orderBy: [{ planId: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        plan: { select: { name: true, status: true } },
        group: { select: { name: true } },
        pic: { select: { displayName: true } },
        sapWorkOrder: { select: { id: true, sapOrderNumber: true, description: true, functionalLocation: true } },
      },
    }),
    prisma.areaLineMapping.findMany({ orderBy: [{ areaName: "asc" }, { functionalLocation: "asc" }] }),
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
      sapBatches={batches.map(batch => ({ ...batch, importedAt: batch.importedAt.toISOString() }))}
      sapOrders={orders}
      areaMappings={areaMappings}
      groups={groups.map((group) => ({ id: group.id, planId: group.planId, name: group.name, teamLeaderId: group.teamLeaderId ?? "", teamLeaderName: group.teamLeader?.displayName ?? "" }))}
      assignments={assignments.map((assignment) => ({
        id: assignment.id,
        planId: assignment.planId,
        planName: assignment.plan.name,
        planStatus: assignment.plan.status,
        sapWorkOrderId: assignment.sapWorkOrderId ?? "",
        orderNumber: assignment.sapWorkOrder?.sapOrderNumber ?? assignment.manualOrderNumber ?? "Non-SAP",
        description: assignment.descriptionOverride ?? assignment.sapWorkOrder?.description ?? assignment.manualDescription ?? "",
        functionalLocation: assignment.functionalLocationOverride ?? assignment.sapWorkOrder?.functionalLocation ?? "",
        groupId: assignment.groupId ?? "",
        groupName: assignment.group?.name ?? "Belum ada area",
        picId: assignment.picId ?? "",
        picName: assignment.pic?.displayName ?? "Belum ditentukan",
        picRole: assignment.picRole ?? "",
        plannedDurationMinutes: assignment.plannedDurationMinutes,
        plannedDate: assignment.plannedDate?.toISOString().slice(0, 10) ?? "",
        workOrderTypeCode: assignment.workOrderTypeCode ?? "",
        notes: assignment.notes ?? "",
        status: assignment.status,
      }))}
    />
  );
}
