"use client";

import * as React from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, CalendarDays, Check, CheckCircle2,
  X, CircleHelp, Clock3, FileSpreadsheet, Filter, LayoutDashboard,
  ListTodo, MoreHorizontal, Plus, Search, Settings2, Users, Wrench,
} from "lucide-react";

type Order = { id: string; description: string; location: string; group: string; duration: number; pic: string; role: string; status: string; date: string };

const initialOrders: Order[] = [];

const navItems = [
  { label: "Ringkasan", icon: LayoutDashboard }, { label: "Rencana Mingguan", icon: CalendarDays, active: true },
  { label: "Work Order SAP", icon: ListTodo }, { label: "Personel", icon: Users },
];

export function MaintenanceDashboard() {
  const [orders, setOrders] = React.useState(initialOrders);
  const [tab, setTab] = React.useState("Semua");
  const [search, setSearch] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [showImport, setShowImport] = React.useState(false);
  const [showPlan, setShowPlan] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const [planName, setPlanName] = React.useState("Rencana baru");

  const filtered = orders.filter((order) => {
    const matchesTab = tab === "Semua" || (tab === "Perlu PIC" ? order.status === tab : order.status === tab);
    const query = search.toLowerCase();
    return matchesTab && `${order.id} ${order.description} ${order.location} ${order.group} ${order.pic}`.toLowerCase().includes(query);
  });
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3200); };

  function importFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setShowImport(false);
    notify(`${file.name} siap divalidasi. Hanya kolom Order, Description, dan Functional Location yang akan digunakan.`);
  }

  function markDone(id: string) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status: "Selesai" } : order));
    notify(`Work order ${id} ditandai selesai.`);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
        <a href="#" className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Wrench size={20} /></span>
          <span><strong className="block text-[15px] tracking-tight">MASOGAK</strong><small className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Maintenance system</small></span>
        </a>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, active }) => <button key={label} onClick={() => label !== "Rencana Mingguan" && notify(`${label} akan tersedia di navigasi modul.`)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={17} strokeWidth={1.8} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}</button>)}
          </nav>
        </div>
        <div className="mt-8 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Data & konfigurasi</p>
          <button onClick={() => notify("Master data personel dan area siap dikelola.")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-500 hover:bg-slate-50"><Settings2 size={17} />Master data</button>
          <button onClick={() => notify("Laporan dibentuk dari data rencana dan aktual.")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-500 hover:bg-slate-50"><Activity size={17} />Laporan</button>
        </div>
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">AR</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Admin Rencana</p><p className="text-[10px] text-slate-400">Maintenance planner</p></div><MoreHorizontal size={17} className="text-slate-400" /></div>
        </div>
      </aside>

      <main className="lg:pl-[248px]">
        <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400"><span className="hidden sm:inline">Maintenance</span><span className="hidden sm:inline">/</span><span className="font-semibold text-slate-700">Rencana mingguan</span></div>
          <div className="flex items-center gap-3"><span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />SAP tersinkron</span><button onClick={() => notify("Tidak ada notifikasi baru.")} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50" aria-label="Notifikasi"><Activity size={18} /><i className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" /></button><div className="h-8 w-8 rounded-full bg-blue-100 text-center text-[11px] font-bold leading-8 text-blue-700">AR</div></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-blue-700"><CalendarDays size={14} /> Perencanaan & eksekusi</div><h1 className="text-[26px] font-bold tracking-tight text-slate-900">Rencana maintenance</h1><p className="mt-1 text-[13px] text-slate-500">Kelola work order SAP, susun jadwal, dan pantau pelaksanaan mingguan.</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={() => setShowImport(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><ArrowDownToLine size={15} /> Impor SAP</button><button onClick={() => setShowPlan(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"><Plus size={16} /> Buat rencana</button></div>
          </div>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="mb-2 flex items-center gap-2"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Belum ada rencana</span></div><h2 className="text-[18px] font-bold tracking-tight">Rencana maintenance</h2><p className="mt-1 text-xs text-slate-500">Buat rencana mingguan untuk mulai mengatur work order.</p></div><button onClick={() => setShowPlan(true)} className="flex h-9 items-center gap-2 self-start rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">Buat rencana <ArrowRight size={14} /></button></div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 md:grid-cols-4"><Metric label="Total work order" value={String(orders.length).padStart(2,"0")} sub="dalam rencana" icon={<ListTodo size={16} />} /><Metric label="Perlu penugasan" value={String(orders.filter(o=>o.status==="Perlu PIC").length).padStart(2,"0")} sub="belum ditentukan PIC" warning icon={<Users size={16} />} /><Metric label="Durasi rencana" value={`${(orders.reduce((s,o)=>s+o.duration,0)/60).toFixed(1)} jam`} sub="total durasi PIC" icon={<Clock3 size={16} />} /><Metric label="Penyelesaian" value={`${Math.round(orders.filter(o=>o.status==="Selesai").length/orders.length*100)}%`} sub="work order selesai" icon={<CheckCircle2 size={16} />} /></div>
          </section>

          <div className="mb-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)]">
              <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold">Alur proses</h3><p className="mt-1 text-[11px] text-slate-400">Dari data sumber hingga pencatatan aktual</p></div><button aria-label="Informasi alur proses" onClick={()=>notify("Data SAP tetap tersimpan sebagai sumber; perubahan rencana tidak mengubah histori impor.")} className="text-slate-400 hover:text-slate-600"><CircleHelp size={16}/></button></div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[{n:"01",title:"Impor SAP",sub:"3 kolom sumber",done:false},{n:"02",title:"Susun rencana",sub:"Minggu & area",done:false},{n:"03",title:"Atur jadwal",sub:"PIC & slot waktu",active:false},{n:"04",title:"Catat aktual",sub:"Durasi & hasil"}].map((step,i)=><div key={step.n} className="relative rounded-xl border border-slate-100 bg-slate-50/70 p-3"><div className="mb-3 flex items-center justify-between"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${step.done?"bg-emerald-100 text-emerald-700":step.active?"bg-blue-600 text-white":"bg-slate-200 text-slate-500"}`}>{step.done?<Check size={14}/>:step.n}</span>{i<3&&<ArrowRight size={13} className="hidden text-slate-300 sm:block"/>}</div><p className="text-[11px] font-bold">{step.title}</p><p className="mt-1 text-[10px] text-slate-400">{step.sub}</p></div>)}</div>
            </section>
            <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5"><div className="mb-3 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-blue-700"><FileSpreadsheet size={15}/></span><h3 className="text-xs font-bold text-slate-800">Impor SAP</h3></div><p className="text-[13px] font-semibold">{fileName || "Belum ada file diimpor"}</p><div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">{fileName ? <><CheckCircle2 size={12} className="text-emerald-600"/> File dipilih, menunggu validasi</> : "Impor daftar work order SAP untuk memulai"}</div><div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3"><span className="text-[10px] text-slate-500">Hanya Order, Description & FunLoc disimpan</span><button onClick={()=>setShowImport(true)} className="text-[10px] font-bold text-blue-700 hover:text-blue-900">Pilih file</button></div></section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h3 className="text-sm font-bold">Work order dalam rencana</h3><p className="mt-1 text-[11px] text-slate-400">Penugasan, durasi kerja, dan progres pelaksanaan</p></div><button onClick={()=>notify("Laporan Excel akan dibentuk dari data terstruktur rencana.")} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"><ArrowDownToLine size={14}/> Ekspor laporan</button></div>
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center"><div className="flex gap-1 overflow-x-auto">{["Semua","Terjadwal","Ditugaskan","Perlu PIC","Selesai"].map(t=><button key={t} onClick={()=>setTab(t)} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[10px] font-semibold ${tab===t?"bg-slate-100 text-slate-900":"text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}>{t}{t==="Semua"&&<span className="ml-1.5 text-slate-400">{orders.length}</span>}</button>)}</div><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari order atau area..." className="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[11px] outline-none placeholder:text-slate-400 focus:border-blue-400 sm:w-56"/><Filter size={13} className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 text-slate-400"/></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-slate-50/80"><tr className="text-[9px] font-bold uppercase tracking-[.1em] text-slate-400"><th className="px-5 py-3">Work order / sumber</th><th className="px-4 py-3">Area / line</th><th className="px-4 py-3">PIC execution</th><th className="px-4 py-3">Jadwal</th><th className="px-4 py-3">Durasi</th><th className="px-4 py-3">Status</th><th className="px-5 py-3"></th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(order=><tr key={order.id} className="group hover:bg-slate-50/60"><td className="px-5 py-3.5"><div className="flex items-start gap-3"><span className="mt-0.5 h-8 w-8 rounded-lg bg-slate-100 text-center text-[9px] font-bold leading-8 text-slate-600">WO</span><div><p className="text-[11px] font-bold text-slate-800">{order.id}<span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-semibold text-slate-500">PM</span></p><p className="mt-1 max-w-[280px] truncate text-[10px] text-slate-500">{order.description}</p><p className="mt-1 text-[9px] text-slate-400">{order.location}</p></div></div></td><td className="px-4 py-3.5"><span className="rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-slate-600">{order.group}</span></td><td className="px-4 py-3.5"><div className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold ${order.pic==="Belum ditentukan"?"bg-amber-50 text-amber-700":"bg-violet-50 text-violet-700"}`}>{order.pic==="Belum ditentukan"?"?":order.pic.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><span><span className={`block text-[10px] font-semibold ${order.pic==="Belum ditentukan"?"text-amber-700":"text-slate-700"}`}>{order.pic}</span><span className="text-[9px] text-slate-400">Role {order.role}</span></span></div></td><td className="px-4 py-3.5 text-[10px] text-slate-600">{order.date}</td><td className="px-4 py-3.5 text-[10px] font-semibold text-slate-700">{order.duration} <span className="font-normal text-slate-400">mnt</span></td><td className="px-4 py-3.5"><Status status={order.status}/></td><td className="px-5 py-3.5 text-right">{order.status!=="Selesai"&&<button onClick={()=>markDone(order.id)} title="Catat selesai" className="rounded-md p-1.5 text-slate-300 opacity-0 transition hover:bg-emerald-50 hover:text-emerald-700 group-hover:opacity-100"><CheckCircle2 size={16}/></button>}</td></tr>)}{filtered.length===0&&<tr><td colSpan={7} className="p-10 text-center text-xs text-slate-400">Tidak ada work order yang cocok.</td></tr>}</tbody></table></div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3"><span className="text-[10px] text-slate-400">Menampilkan {filtered.length} dari {orders.length} work order</span><button onClick={()=>notify("Seluruh work order sudah ditampilkan.")} className="text-[10px] font-semibold text-blue-700">Lihat semua <span className="ml-1">→</span></button></div>
          </section>
          <p className="mt-4 text-center text-[10px] text-slate-400">Data sumber SAP tidak berubah saat rencana diperbarui <span className="mx-1">·</span> Setiap work order hanya dapat ditugaskan ke satu rencana</p>
        </div>
      </main>

      {notice&&<div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl">{notice}</div>}
      {showImport&&<Modal title="Impor work order SAP" onClose={()=>setShowImport(false)}><p className="text-xs leading-5 text-slate-500">Pilih file Excel sumber. Sistem hanya membaca kolom <b>Order</b>, <b>Description</b>, dan <b>Functional Location</b>. Kolom SAP lainnya diabaikan.</p><label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center hover:border-blue-400"><FileSpreadsheet size={26} className="mb-2 text-blue-600"/><span className="text-xs font-semibold">Pilih file .xlsx</span><span className="mt-1 text-[10px] text-slate-400">Validasi nomor order dan duplikasi dalam batch</span><input type="file" accept=".xlsx,.xls" className="sr-only" onChange={e=>importFile(e.target.files?.[0])}/></label><div className="mt-4 flex justify-end"><button onClick={()=>setShowImport(false)} className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Tutup</button></div></Modal>}
      {showPlan&&<Modal title="Buat rencana maintenance" onClose={()=>setShowPlan(false)}><label className="block text-[11px] font-semibold text-slate-600">Nama rencana<input value={planName} onChange={e=>setPlanName(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"/></label><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-[11px] font-semibold text-slate-600">Minggu<input defaultValue="48" type="number" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"/></label><label className="text-[11px] font-semibold text-slate-600">Tahun<input defaultValue="2026" type="number" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"/></label></div><label className="mt-3 block text-[11px] font-semibold text-slate-600">Site / plant<input defaultValue="KronesB HodC" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"/></label><div className="mt-5 flex justify-end gap-2"><button onClick={()=>setShowPlan(false)} className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Batal</button><button onClick={()=>{setShowPlan(false);notify("Rencana draft berhasil dibuat.")}} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Buat draft</button></div></Modal>}
    </div>
  );
}

function Metric({label,value,sub,icon,warning=false}:{label:string;value:string;sub:string;icon:React.ReactNode;warning?:boolean}) { return <div className="rounded-xl border border-slate-100 p-3.5"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-medium text-slate-500">{label}</span><span className={`${warning?"text-amber-600":"text-slate-400"}`}>{icon}</span></div><div className="text-[21px] font-bold tracking-tight text-slate-900">{value}</div><p className="mt-0.5 text-[9px] text-slate-400">{sub}</p></div> }
function Status({status}:{status:string}) { const style=status==="Selesai"?"bg-emerald-50 text-emerald-700":status==="Perlu PIC"?"bg-amber-50 text-amber-700":status==="Terjadwal"?"bg-blue-50 text-blue-700":"bg-slate-100 text-slate-600"; return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${style}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{status}</span> }
function Modal({title,children,onClose}:{title:string;children:React.ReactNode;onClose:()=>void}) { return <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h2 id="modal-title" className="text-sm font-bold">{title}</h2><button onClick={onClose} aria-label="Tutup dialog" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={17}/></button></div>{children}</div></div> }
