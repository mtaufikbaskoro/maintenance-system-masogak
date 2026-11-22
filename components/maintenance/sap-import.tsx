"use client";

import * as React from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { importSapFile } from "@/app/actions";

type Batch = { id: string; sourceFileName: string; importedAt: string; status: string; rowCount: number; errorCount: number };
type Order = { id: string; sapOrderNumber: string; description: string; functionalLocation: string; sourceRowNumber: number | null; sourceBatch: { sourceFileName: string } };
type AreaMapping = { functionalLocation: string; areaName: string; active: boolean };

export function SapImport({ batches, orders, areaMappings }: { batches: Batch[]; orders: Order[]; areaMappings: AreaMapping[] }) {
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const mappingByFunLoc = new Map(areaMappings.filter(mapping => mapping.active).map(mapping => [normalizeFunLoc(mapping.functionalLocation), mapping.areaName]));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    try {
      const result = await importSapFile(new FormData(event.currentTarget));
      setMessage(`Impor selesai: ${result.imported} work order masuk ke ${result.planName}; ${result.mapped} otomatis dipetakan ke area, ${result.unmatched} FunLoc belum dipetakan, ${result.errors} baris tidak valid.`);
      event.currentTarget.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Impor gagal. Periksa file lalu coba kembali.");
    } finally { setBusy(false); }
  }

  return <div className="space-y-6">
    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
         <div className="flex items-start gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><FileSpreadsheet size={20}/></span><div><h2 className="text-sm font-bold">Impor work order SAP</h2><p className="mt-1 text-xs leading-5 text-slate-500">Unggah Excel .xlsx berisi kolom Order, Description, dan Functional Location. FunLoc dicocokkan dengan master area/line untuk pengelompokan otomatis.</p></div></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-blue-400 hover:bg-blue-50/40"><Upload size={20} className="mb-2 text-slate-500"/><span className="text-xs font-semibold text-slate-700">Pilih file Excel SAP</span><span className="mt-1 text-[10px] text-slate-400">Maksimal 15 MB · hanya data tiga kolom yang disimpan</span><input required name="file" type="file" accept=".xlsx,.xls" className="sr-only" onChange={e => { const f=e.target.files?.[0]; if(f) setMessage(`File dipilih: ${f.name}`); }}/></label>
          {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{message}</p>}{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <button disabled={busy} className="h-10 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "Memproses file…" : "Impor data"}</button>
        </form>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="text-sm font-bold">Riwayat impor</h2><p className="mt-1 text-[11px] text-slate-400">Batch impor dan hasil validasinya</p></div><div className="overflow-x-auto"><table className="w-full min-w-[450px] text-left"><thead className="bg-slate-50 text-[10px] uppercase text-slate-400"><tr><th className="px-3 py-2">File</th><th className="px-3 py-2">Waktu</th><th className="px-3 py-2">Valid / error</th></tr></thead><tbody className="divide-y divide-slate-100">{batches.map(batch=><tr key={batch.id}><td className="max-w-40 truncate px-3 py-3 text-xs font-medium" title={batch.sourceFileName}>{batch.sourceFileName}</td><td className="px-3 py-3 text-[11px] text-slate-500">{new Date(batch.importedAt).toLocaleString("id-ID")}</td><td className="px-3 py-3 text-[11px]">{batch.rowCount} / <span className={batch.errorCount ? "text-red-600" : "text-slate-400"}>{batch.errorCount}</span></td></tr>)}{!batches.length && <tr><td colSpan={3} className="px-3 py-8 text-center text-xs text-slate-400">Belum ada impor.</td></tr>}</tbody></table></div></div>
    </section>
     <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="text-sm font-bold">Work order tersedia</h2><p className="mt-1 text-[11px] text-slate-400">{orders.length} order terbaru · data sumber bersifat read-only</p></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400"><tr><th className="px-5 py-3">Order</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Functional location</th><th className="px-4 py-3">Area hasil mapping</th><th className="px-4 py-3">Sumber</th><th className="px-4 py-3">Baris</th></tr></thead><tbody className="divide-y divide-slate-100">{orders.map(order=><tr key={order.id}><td className="px-5 py-3 text-xs font-semibold">{order.sapOrderNumber}</td><td className="max-w-md px-4 py-3 text-xs text-slate-600">{order.description}</td><td className="px-4 py-3 text-xs text-slate-600">{order.functionalLocation}</td><td className="px-4 py-3 text-xs">{mappingByFunLoc.get(normalizeFunLoc(order.functionalLocation)) ? <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">{mappingByFunLoc.get(normalizeFunLoc(order.functionalLocation))}</span> : <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">Belum dipetakan</span>}</td><td className="max-w-40 truncate px-4 py-3 text-[11px] text-slate-500">{order.sourceBatch.sourceFileName}</td><td className="px-4 py-3 text-[11px] text-slate-500">{order.sourceRowNumber ?? "—"}</td></tr>)}{!orders.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-400">Belum ada work order SAP.</td></tr>}</tbody></table></div></section>
  </div>;
}

function normalizeFunLoc(value: string) { return value.trim().toUpperCase().replace(/\s+/g, ""); }
