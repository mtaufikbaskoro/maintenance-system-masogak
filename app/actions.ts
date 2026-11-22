"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, PicRole, PlanStatus, Prisma } from "@/app/generated/prisma/client";
import ExcelJS from "exceljs";

function currentWeekPeriod(now = new Date()) {
  const local = new Date(now);
  local.setHours(0, 0, 0, 0);
  const day = local.getDay();
  const monday = new Date(local);
  monday.setDate(local.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  const year = thursday.getFullYear();
  const firstThursday = new Date(year, 0, 4);
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);
  const weekNumber = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));

  return { year, weekNumber, monday, sunday };
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function dateOnly(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!value || Number.isNaN(date.getTime())) throw new Error("Tanggal tidak valid.");
  return date;
}

export async function importSapFile(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("Pilih file Excel SAP terlebih dahulu.");
  if (!/\.xlsx?$/i.test(file.name)) throw new Error("Format file harus .xlsx atau .xls.");
  if (file.size > 15 * 1024 * 1024) throw new Error("Ukuran file maksimal 15 MB.");

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error("File Excel tidak dapat dibaca. Pastikan file tidak rusak.");
  }
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("File tidak memiliki worksheet.");

  let headerRow = 0;
  let indexes: Record<string, number> = {};
  for (let rowNo = 1; rowNo <= Math.min(sheet.rowCount, 30); rowNo++) {
    const row = sheet.getRow(rowNo);
    const found: Record<string, number> = {};
    row.eachCell((cell, col) => {
      const value = String(cell.value ?? "").trim().toLowerCase();
      if (["order", "description", "functional location"].includes(value)) found[value] = col;
    });
    if (found.order && found.description && found["functional location"]) {
      headerRow = rowNo;
      indexes = found;
      break;
    }
  }
  if (!headerRow) throw new Error("Kolom wajib Order, Description, dan Functional Location tidak ditemukan.");

  const valid: { sapOrderNumber: string; description: string; functionalLocation: string; sourceRowNumber: number }[] = [];
  const seen = new Set<string>();
  let errorCount = 0;
  for (let rowNo = headerRow + 1; rowNo <= sheet.rowCount; rowNo++) {
    const row = sheet.getRow(rowNo);
    const valueAt = (col: number) => String(row.getCell(col).text ?? row.getCell(col).value ?? "").trim();
    const order = valueAt(indexes.order);
    const description = valueAt(indexes.description);
    const functionalLocation = valueAt(indexes["functional location"]);
    if (!order && !description && !functionalLocation) continue;
    if (!order || !description || !functionalLocation || seen.has(order)) {
      errorCount++;
      continue;
    }
    seen.add(order);
    valid.push({ sapOrderNumber: order, description, functionalLocation, sourceRowNumber: rowNo });
  }

  const batch = await prisma.$transaction(async (tx) => {
    const { year, weekNumber, monday, sunday } = currentWeekPeriod();
    let plan = await tx.maintenancePlan.findFirst({
      where: { year, weekNumber, status: { in: [PlanStatus.DRAFT, PlanStatus.PUBLISHED, PlanStatus.IN_PROGRESS] } },
      orderBy: { createdAt: "asc" },
    });
    if (!plan) {
      plan = await tx.maintenancePlan.create({
        data: {
          name: `Rencana Maintenance Minggu ${weekNumber} - ${year}`,
          weekNumber,
          year,
          periodStart: monday,
          periodEnd: sunday,
          status: PlanStatus.DRAFT,
        },
      });
    }

    const created = await tx.sapImportBatch.create({
      data: { sourceFileName: file.name, rowCount: valid.length, errorCount,
        status: valid.length ? (errorCount ? "IMPORTED" : "VALIDATED") : "FAILED" },
    });
    if (valid.length) await tx.sapWorkOrder.createMany({ data: valid.map((entry) => ({ ...entry, sourceBatchId: created.id })) });
    const areaMappings = await tx.areaLineMapping.findMany({ where: { active: true } });
    const mappingByFunLoc = new Map(areaMappings.map((mapping) => [normalizeFunLoc(mapping.functionalLocation), mapping]));
    const importedOrders = valid.length ? await tx.sapWorkOrder.findMany({
      where: { sourceBatchId: created.id }, select: { id: true, functionalLocation: true }, orderBy: { sourceRowNumber: "asc" },
    }) : [];
    const areaIds = new Map<string, string>();
    let mappedCount = 0;
    let unmatchedCount = 0;
    for (const order of importedOrders) {
      const mapping = mappingByFunLoc.get(normalizeFunLoc(order.functionalLocation));
      let groupId: string | null = null;
      if (mapping) {
        groupId = areaIds.get(mapping.areaName) ?? null;
        if (!groupId) {
          const group = await tx.maintenanceGroup.upsert({
            where: { planId_name: { planId: plan.id, name: mapping.areaName } },
            create: { planId: plan.id, name: mapping.areaName },
            update: {},
            select: { id: true },
          });
          groupId = group.id;
          areaIds.set(mapping.areaName, groupId);
        }
        mappedCount++;
      } else {
        unmatchedCount++;
      }
      await tx.workAssignment.create({ data: { planId: plan.id, sapWorkOrderId: order.id, groupId, sortOrder: importedOrders.indexOf(order), status: AssignmentStatus.PLANNED } });
    }
    return { ...created, planId: plan.id, planName: plan.name, mapped: mappedCount, unmatched: unmatchedCount };
  });
  revalidatePath("/");
  return { batchId: batch.id, planId: batch.planId, planName: batch.planName, imported: valid.length, errors: errorCount, mapped: batch.mapped, unmatched: batch.unmatched };
}

function normalizeFunLoc(value: string) { return value.trim().toUpperCase().replace(/\s+/g, ""); }

export async function importAreaMappings(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("Pilih file Excel area/line terlebih dahulu.");
  if (!/\.xlsx?$/i.test(file.name)) throw new Error("Format file harus .xlsx atau .xls.");
  if (file.size > 15 * 1024 * 1024) throw new Error("Ukuran file maksimal 15 MB.");
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(await file.arrayBuffer()); } catch { throw new Error("File Excel tidak dapat dibaca."); }
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("File tidak memiliki worksheet.");
  let headerRow = 0;
  let areaCol = 0;
  let funLocCol = 0;
  let descriptionCol = 0;
  for (let rowNo = 1; rowNo <= Math.min(sheet.rowCount, 30); rowNo++) {
    const cols: Record<string, number> = {};
    sheet.getRow(rowNo).eachCell((cell, col) => { cols[String(cell.text || cell.value || "").trim().toLowerCase()] = col; });
    const area = Object.keys(cols).find(key => key === "area" || key === "area/line" || key === "area / line");
    const funloc = Object.keys(cols).find(key => key === "funloc" || key === "functional location");
    const desc = Object.keys(cols).find(key => key === "mc desc" || key === "machine description");
    if (area && funloc) { headerRow = rowNo; areaCol = cols[area]; funLocCol = cols[funloc]; descriptionCol = desc ? cols[desc] : 0; break; }
  }
  if (!headerRow) throw new Error("Kolom Area dan FunLoc tidak ditemukan.");
    const entries = new Map<string, { functionalLocation: string; areaName: string; machineDescription: string | null }>();
  let errors = 0;
  for (let rowNo = headerRow + 1; rowNo <= sheet.rowCount; rowNo++) {
    const row = sheet.getRow(rowNo);
    const functionalLocation = String(row.getCell(funLocCol).text || row.getCell(funLocCol).value || "").trim();
    let areaName = String(row.getCell(areaCol).text || row.getCell(areaCol).value || "").trim();
    const machineDescription = descriptionCol ? String(row.getCell(descriptionCol).text || row.getCell(descriptionCol).value || "").trim() || null : null;
    if (!functionalLocation && !areaName) continue;
    if (!functionalLocation || !areaName) { errors++; continue; }
    // Keep all water-treatment equipment in its own area, not under its parent production line.
    if (/water\s*treatment/i.test(machineDescription ?? "") || /\bWRTM\b|\bWWTP\b/i.test(functionalLocation)) {
      areaName = "Water Treatment";
    }
    const key = normalizeFunLoc(functionalLocation);
    const existing = entries.get(key);
    if (existing && existing.areaName.toLowerCase() !== areaName.toLowerCase()) { errors++; continue; }
    entries.set(key, { functionalLocation, areaName, machineDescription });
  }
  const result = await prisma.$transaction(async tx => {
    let created = 0;
    let updated = 0;
    for (const entry of entries.values()) {
      const current = await tx.areaLineMapping.findUnique({ where: { functionalLocation: entry.functionalLocation } });
      if (current) { await tx.areaLineMapping.update({ where: { id: current.id }, data: { areaName: entry.areaName, machineDescription: entry.machineDescription, active: true } }); updated++; }
      else { await tx.areaLineMapping.create({ data: entry }); created++; }
    }
    return { created, updated };
  });
  revalidatePath("/");
  return { ...result, errors };
}

export async function upsertAreaMapping(formData: FormData) {
  const id = text(formData, "id");
  const functionalLocation = text(formData, "functionalLocation");
  const areaName = text(formData, "areaName");
  const machineDescription = text(formData, "machineDescription") || null;
  if (!functionalLocation || !areaName) throw new Error("FunLoc dan area/line wajib diisi.");
  if (id) await prisma.areaLineMapping.update({ where: { id }, data: { functionalLocation, areaName, machineDescription, active: text(formData, "active") !== "false" } });
  else await prisma.areaLineMapping.upsert({ where: { functionalLocation }, create: { functionalLocation, areaName, machineDescription }, update: { areaName, machineDescription, active: true } });
  revalidatePath("/");
}

export async function updateAreaMapping(formData: FormData) { return upsertAreaMapping(formData); }

export async function deleteAreaMapping(formData: FormData) {
  const id = text(formData, "id");
  await prisma.areaLineMapping.delete({ where: { id } });
  revalidatePath("/");
}

export async function createPlan(formData: FormData) {
  const name = text(formData, "name");
  const weekNumber = Number(text(formData, "weekNumber"));
  const year = Number(text(formData, "year"));
  const periodStart = dateOnly(text(formData, "periodStart"));
  const periodEnd = dateOnly(text(formData, "periodEnd"));
  const site = text(formData, "site") || null;

  if (!name) throw new Error("Nama rencana wajib diisi.");
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 53) throw new Error("Minggu harus antara 1 dan 53.");
  if (!Number.isInteger(year) || year < 2000 || year > 2200) throw new Error("Tahun tidak valid.");
  if (periodEnd < periodStart) throw new Error("Tanggal akhir tidak boleh sebelum tanggal mulai.");

  await prisma.maintenancePlan.create({
    data: { name, weekNumber, year, periodStart, periodEnd, site, status: PlanStatus.DRAFT },
  });
  revalidatePath("/");
}

export async function updatePlan(formData: FormData) {
  const id = text(formData, "id");
  const current = await prisma.maintenancePlan.findUnique({ where: { id } });
  if (!current) throw new Error("Rencana tidak ditemukan.");
  if (current.status !== PlanStatus.DRAFT) throw new Error("Hanya rencana Draft yang dapat diedit dari alur ini.");

  const periodStart = dateOnly(text(formData, "periodStart"));
  const periodEnd = dateOnly(text(formData, "periodEnd"));
  if (periodEnd < periodStart) throw new Error("Tanggal akhir tidak boleh sebelum tanggal mulai.");
  const weekNumber = Number(text(formData, "weekNumber"));
  const year = Number(text(formData, "year"));
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 53 || !Number.isInteger(year)) {
    throw new Error("Minggu atau tahun tidak valid.");
  }

  await prisma.maintenancePlan.update({
    where: { id },
    data: {
      name: text(formData, "name"), weekNumber, year, periodStart, periodEnd,
      site: text(formData, "site") || null,
    },
  });
  revalidatePath("/");
}

export async function deletePlan(formData: FormData) {
  const id = text(formData, "id");
  const plan = await prisma.maintenancePlan.findUnique({
    where: { id }, include: { _count: { select: { assignments: true } } },
  });
  if (!plan) throw new Error("Rencana tidak ditemukan.");
  if (plan.status !== PlanStatus.DRAFT || plan._count.assignments > 0) {
    await prisma.maintenancePlan.update({ where: { id }, data: { status: PlanStatus.CANCELLED } });
  } else {
    await prisma.maintenancePlan.delete({ where: { id } });
  }
  revalidatePath("/");
}

export async function saveAssignment(formData: FormData) {
  const id = text(formData, "id");
  const planId = text(formData, "planId");
  const sapWorkOrderId = text(formData, "sapWorkOrderId") || null;
  const picId = text(formData, "picId") || null;
  const picRoleValue = text(formData, "picRole");
  const groupId = text(formData, "groupId") || null;
  const durationValue = text(formData, "plannedDurationMinutes");
  const duration = durationValue ? Number(durationValue) : null;
  const plannedDateValue = text(formData, "plannedDate");
  const status = text(formData, "status") as AssignmentStatus;
  const allowedStatuses = Object.values(AssignmentStatus);

  if (!planId) throw new Error("Plan wajib dipilih.");
  if (picId && !Object.values(PicRole).includes(picRoleValue as PicRole)) throw new Error("Role PIC wajib dipilih.");
  if (!picId && picRoleValue) throw new Error("Pilih PIC sebelum menentukan role.");
  if (duration !== null && (!Number.isInteger(duration) || duration < 0)) throw new Error("Durasi harus berupa angka menit yang tidak negatif.");
  if (!allowedStatuses.includes(status)) throw new Error("Status assignment tidak valid.");

  const plan = await prisma.maintenancePlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plan tidak ditemukan.");
  if (plan.status !== PlanStatus.DRAFT) throw new Error("Assignment hanya dapat diubah pada plan Draft.");
  if (plannedDateValue) {
    const plannedDate = dateOnly(plannedDateValue);
    if (plannedDate < plan.periodStart || plannedDate > plan.periodEnd) throw new Error("Tanggal pekerjaan harus berada dalam periode plan.");
  }
  if (picId) {
    const person = await prisma.person.findUnique({ where: { id: picId } });
    if (!person?.active) throw new Error("PIC tidak ditemukan atau sudah nonaktif.");
  }
  if (groupId) {
    const group = await prisma.maintenanceGroup.findFirst({ where: { id: groupId, planId } });
    if (!group) throw new Error("Area/line tidak sesuai dengan plan.");
  }
  if (sapWorkOrderId) {
    const order = await prisma.sapWorkOrder.findUnique({ where: { id: sapWorkOrderId }, include: { assignments: true } });
    if (!order) throw new Error("Work order SAP tidak ditemukan.");
    if (order.assignments.some((assignment) => assignment.id !== id)) throw new Error("Work order SAP sudah masuk ke assignment lain.");
  }

  const data = {
    planId, sapWorkOrderId, picId,
    picRole: picId ? (picRoleValue as PicRole) : null,
    plannedDurationMinutes: duration,
    plannedDate: plannedDateValue ? dateOnly(plannedDateValue) : null,
    groupId,
    workOrderTypeCode: text(formData, "workOrderTypeCode") || null,
    descriptionOverride: text(formData, "descriptionOverride") || null,
    functionalLocationOverride: text(formData, "functionalLocationOverride") || null,
    notes: text(formData, "notes") || null,
    status,
  };
  if (id) {
    await prisma.workAssignment.update({ where: { id }, data });
  } else {
    if (!sapWorkOrderId && !text(formData, "manualDescription")) throw new Error("Pilih work order SAP atau isi deskripsi pekerjaan manual.");
    await prisma.workAssignment.create({
      data: {
        ...data,
        manualOrderNumber: text(formData, "manualOrderNumber") || null,
        manualDescription: text(formData, "manualDescription") || null,
      },
    });
  }
  revalidatePath("/");
}

export async function deleteAssignment(formData: FormData) {
  const id = text(formData, "id");
  const assignment = await prisma.workAssignment.findUnique({
    where: { id }, include: { plan: true, execution: true, _count: { select: { scheduleBlocks: true } } },
  });
  if (!assignment) throw new Error("Assignment tidak ditemukan.");
  if (assignment.plan.status === PlanStatus.DRAFT && !assignment.execution && !assignment._count.scheduleBlocks) {
    await prisma.workAssignment.delete({ where: { id } });
  } else {
    await prisma.workAssignment.update({ where: { id }, data: { status: AssignmentStatus.CANCELLED } });
  }
  revalidatePath("/");
}

export async function createPlanGroup(formData: FormData) {
  const planId = text(formData, "planId");
  const name = text(formData, "name");
  const teamLeaderId = text(formData, "teamLeaderId") || null;
  if (!name) throw new Error("Nama area/line wajib diisi.");
  const plan = await prisma.maintenancePlan.findUnique({ where: { id: planId } });
  if (!plan || plan.status !== PlanStatus.DRAFT) throw new Error("Area/line hanya dapat ditambahkan ke plan Draft.");
  try {
    await prisma.maintenanceGroup.create({ data: { planId, name, teamLeaderId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("Nama area/line sudah ada pada plan ini.");
    throw error;
  }
  revalidatePath("/");
}

export async function deletePlanGroup(formData: FormData) {
  const id = text(formData, "id");
  const group = await prisma.maintenanceGroup.findUnique({ where: { id }, include: { plan: true, _count: { select: { assignments: true } } } });
  if (!group) throw new Error("Area/line tidak ditemukan.");
  if (group.plan.status !== PlanStatus.DRAFT || group._count.assignments > 0) throw new Error("Area/line hanya dapat dihapus jika plan masih Draft dan belum memiliki assignment.");
  await prisma.maintenanceGroup.delete({ where: { id } });
  revalidatePath("/");
}

export async function createPerson(formData: FormData) {
  const displayName = text(formData, "displayName");
  const employeeCode = text(formData, "employeeCode") || null;
  if (!displayName) throw new Error("Nama personel wajib diisi.");
  try {
    await prisma.person.create({ data: { displayName, employeeCode, active: true } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Kode karyawan sudah digunakan.");
    }
    throw error;
  }
  revalidatePath("/");
}

export async function updatePerson(formData: FormData) {
  const id = text(formData, "id");
  const displayName = text(formData, "displayName");
  if (!displayName) throw new Error("Nama personel wajib diisi.");
  try {
    await prisma.person.update({
      where: { id },
      data: { displayName, employeeCode: text(formData, "employeeCode") || null, active: text(formData, "active") === "true" },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Kode karyawan sudah digunakan.");
    }
    throw error;
  }
  revalidatePath("/");
}

export async function deletePerson(formData: FormData) {
  const id = text(formData, "id");
  const person = await prisma.person.findUnique({
    where: { id }, include: { _count: { select: { assignments: true, leadingGroups: true } } },
  });
  if (!person) throw new Error("Personel tidak ditemukan.");
  if (person._count.assignments || person._count.leadingGroups) {
    await prisma.person.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.person.delete({ where: { id } });
  }
  revalidatePath("/");
}
