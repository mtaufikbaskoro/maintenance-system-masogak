"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PlanStatus, Prisma } from "@/app/generated/prisma/client";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function dateOnly(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!value || Number.isNaN(date.getTime())) throw new Error("Tanggal tidak valid.");
  return date;
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
