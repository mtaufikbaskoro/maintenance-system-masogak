# Rencana skema database: SAP sebagai sumber, rencana maintenance sebagai hasil

## Tujuan

Mengimpor daftar work order SAP sebagai data sumber, lalu mengolah dan menugaskan work order ke rencana eksekusi mingguan seperti yang dicontohkan di `example-data/example result.xlsx`. Data sumber tetap tersimpan apa adanya; hasil penjadwalan dan pelaksanaan disimpan terpisah agar perubahan rencana tidak mengubah histori impor SAP.

## Temuan dari file contoh

### Data SAP (`example-sap-data.xlsx`)

File SAP memiliki banyak kolom, tetapi aplikasi hanya menyimpan tiga nilai dari setiap order: `Order`, `Description`, dan `Functional Location` (`FunLoc`). Kolom SAP lainnya tidak disimpan sebagai data order. Nomor order menjadi identitas work order; FunLoc dapat berulang dan tidak boleh dijadikan kunci unik.

### Hasil (`example result.xlsx`)

Lembar hasil berjudul `48 KronesB HodC 19-11-2026`, untuk rencana maintenance minggu ke-48. Isinya dikelompokkan berdasarkan area/line, misalnya UTILITY, SPS 600ml, 220ml, dan PRE-WT & WT. Kolom detail mencakup tipe WO, nomor dan deskripsi work order, functional location, team leader, durasi menit/jam, PIC execution, slot waktu per jam, actual time, hari/tanggal eksekusi, dan note.

File hasil merupakan laporan terformat, bukan tabel datar: terdapat header bertingkat/merge, kelompok area, baris pemisah, slot waktu sebagai kolom, dan sel kosong. Database sebaiknya menyimpan fakta terstruktur, kemudian membentuk spreadsheet sebagai tampilan/ekspor.

## Prinsip desain

1. Simpan hanya tiga field SAP yang disetujui (`Order`, `Description`, `FunLoc`) sebagai data work order. Batch dapat menyimpan metadata proses impor, tetapi jangan menyimpan kolom SAP lain atau payload mentah.
2. Gunakan `sapOrderNumber` sebagai kunci bisnis untuk mencocokkan order. Functional location adalah atribut aset, bukan kunci unik.
3. Pisahkan order sumber, rencana mingguan, penugasan, peserta/PIC, blok jadwal, dan aktual pelaksanaan.
4. Simpan jam eksekusi sebagai slot/baris dengan waktu mulai dan selesai, bukan kolom tetap per jam.
5. Jangan menyimpan nilai kolom SAP selain `Order`, `Description`, dan `FunLoc`.
6. Satu work order hanya berada pada satu minggu dan memiliki satu assignment, satu PIC, serta satu durasi rencana. Order tidak boleh dimasukkan ke minggu lain atau muncul berulang dengan PIC/durasi berbeda.
7. Simpan durasi rencana dalam menit sebagai angka kanonis. Jam pada laporan dapat dihitung.

## Skema konseptual yang disarankan

### `SapImportBatch`

Satu catatan per file impor.

- `id` (PK)
- `sourceFileName`
- `importedAt`
- `sourceReportDate` (opsional)
- `periodStart`, `periodEnd` (opsional)
- `status` (misalnya `IMPORTED`, `VALIDATED`, `FAILED`)
- `rowCount`, `errorCount`

Satu batch memiliki banyak baris sumber SAP.

### `SapWorkOrder` — data SAP yang dipakai aplikasi

- `id` (PK internal)
- `sapOrderNumber` (string, wajib; kunci bisnis order SAP)
- `description`
- `functionalLocation` (FunLoc)
- `sourceBatchId` (FK ke `SapImportBatch`)
- `sourceRowNumber` (baris asal spreadsheet, opsional untuk membantu penelusuran kesalahan impor)
- `createdAt`, `updatedAt`

Indeks yang disarankan: nomor order, FunLoc, dan batch impor. Terapkan unique `(sourceBatchId, sapOrderNumber)` untuk mencegah order ganda dalam satu file impor. Jika hanya satu rekaman terkini per order yang disimpan, `sapOrderNumber` juga unik pada tabel work order. Jangan simpan message, tanggal SAP, status, tipe, biaya, cost center, priority, user status, atau kolom SAP lainnya.

### `MaintenancePlan`

Satu rencana/periode, misalnya rencana maintenance minggu ke-48.

- `id` (PK)
- `name`
- `weekNumber`, `year`
- `periodStart`, `periodEnd`
- `site` / `plant` (nullable)
- `status` (`DRAFT`, `PUBLISHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `createdBy`, `createdAt`, `updatedAt`

Keunikan dapat menggunakan `(year, weekNumber, site)`, dengan kemungkinan lebih dari satu rencana per minggu bila kebijakan mengizinkan.

### `MaintenanceGroup`

Pengelompokan baris hasil berdasarkan area/line seperti UTILITY atau SPS 600ml.

- `id` (PK)
- `planId` (FK)
- `name`
- `teamLeaderId` (FK ke `Person`, nullable saat belum ditetapkan)
- `sortOrder`

Kelompok bersifat milik rencana, bukan atribut permanen order SAP. Setiap area/line memiliki team leader yang berlaku untuk assignment dalam kelompok tersebut. Team leader ditentukan melalui master data aplikasi.

### `WorkAssignment`

Order yang dimasukkan ke rencana beserta detail rencana yang dapat berbeda dari data sumber.

- `id` (PK)
- `planId` (FK)
- `sapWorkOrderId` (FK, nullable untuk pekerjaan tambahan non-SAP)
- `groupId` (FK nullable)
- `workOrderTypeCode` (nullable; diisi manual atau dari sumber non-SAP jika diperlukan)
- `descriptionOverride` (nullable)
- `functionalLocationOverride` (nullable)
- `plannedDurationMinutes` (integer nullable)
- `plannedDate` (date nullable)
- `sortOrder`
- `status` (`PLANNED`, `ASSIGNED`, `SCHEDULED`, `IN_PROGRESS`, `DONE`, `SKIPPED`, `CANCELLED`)
- `notes`
- `createdAt`, `updatedAt`

Untuk work order SAP, terapkan unique constraint pada `sapWorkOrderId` di seluruh assignment agar order hanya dapat berada pada satu minggu/rencana. Saat impor SAP, assignment otomatis dibuat pada plan minggu berjalan dan boleh belum memiliki PIC, role, atau `plannedDurationMinutes` (semuanya nullable) sampai planner melengkapinya. Setelah ditugaskan, satu assignment memiliki tepat satu PIC dan satu durasi kerja PIC. Pekerjaan tambahan tanpa nomor SAP dapat tetap dibuat sebagai assignment manual dengan aturan satu PIC dan satu durasi yang sama.

Catatan kualitas contoh: order **2003053741** tampak muncul dua kali pada file hasil dengan PIC dan durasi berbeda. Ini adalah kesalahan pada data contoh dan diabaikan; aplikasi tidak boleh meniru atau mendukung duplikasi tersebut.

### `Person` dan PIC assignment

`Person`:

- `id` (PK)
- `employeeCode` (nullable; unique bila tersedia)
- `displayName`
- `active`

`WorkAssignment.picId` dan `picRole` nullable selama assignment belum ditugaskan; setelah penugasan keduanya wajib diisi bersama. Role PIC adalah `T` teknisi, `O` operator, atau `P` production support. Team leader tidak disimpan per assignment; team leader diperoleh dari `MaintenanceGroup` (area/line) tempat assignment tersebut berada.

### `ScheduleBlock`

Slot waktu untuk assignment, mewakili grid jam pada spreadsheet.

- `id` (PK)
- `workAssignmentId` (FK)
- `startAt`, `endAt` (datetime; atau tanggal dan waktu terpisah sesuai kebijakan zona waktu)
- `plannedHours` (decimal nullable, dapat dihitung dari rentang waktu)
- `note` (nullable)

Blok waktu menunjukkan jam mulai dan selesai pekerjaan. Validasi: `endAt > startAt`. Untuk PIC yang sama, blok waktu pada work order berbeda tidak boleh tumpang tindih. Header `21:00-21:00` pada data contoh adalah kesalahan dan diabaikan.

### `WorkExecution`

Catatan pelaksanaan aktual yang terpisah dari rencana.

- `id` (PK)
- `workAssignmentId` (FK)
- `executionDate` (date)
- `actualStartAt`, `actualEndAt` (nullable)
- `actualDurationHours` (decimal nullable; nilai `ACT. TIME` dalam jam, diisi manual melalui aplikasi)
- `status` (misalnya `STARTED`, `COMPLETED`, `PARTIAL`, `NOT_DONE`)
- `note`
- `recordedBy`, `createdAt`, `updatedAt`

Satu assignment memiliki catatan aktual pelaksanaan. `Hari` dan `Tanggal` dari hasil menjadi data tanggal, bukan teks gabungan. `ACT. TIME` adalah durasi aktual dalam jam dan diinput manual melalui aplikasi.

## Relasi inti

```text
SapImportBatch 1 ─── * SapWorkOrder (atau SapWorkOrderSnapshot)
SapWorkOrder   1 ─── * WorkAssignment * ─── 1 MaintenancePlan
MaintenancePlan 1 ─── * MaintenanceGroup
MaintenanceGroup 1 ─── * WorkAssignment
WorkAssignment * ─── 1 PIC (Person)
WorkAssignment 1 ─── 0..1 ScheduleBlock
WorkAssignment 1 ─── 0..1 WorkExecution
```

`WorkAssignment.groupId` opsional. Pekerjaan tambahan tanpa nomor SAP dapat disimpan dengan `sapWorkOrderId = null` dan detail manual.

## Alur data aplikasi

1. **Impor**: catat batch, parse worksheet SAP, ambil dan simpan hanya `Order`, `Description`, dan `Functional Location`. Validasi nomor order dan nilai teks. Dalam transaksi yang sama, cari atau buat plan Draft minggu berjalan dan buat assignment Planned untuk setiap work order valid; PIC dan durasi belum diisi.
2. **Normalisasi**: rapikan tiga nilai yang digunakan. Deteksi duplikasi nomor order dalam batch; jangan deduplikasi berdasarkan FunLoc. Kolom SAP lain diabaikan dan tidak disimpan.
3. **Buat rencana**: buat `MaintenancePlan` untuk minggu dan lokasi target, lalu susun kelompok area/line.
4. **Pilih order**: tautkan work order SAP ke assignment. Simpan perubahan rencana sebagai snapshot/override, bukan mengubah data sumber.
5. **Atur personel dan jadwal**: tetapkan team leader pada setiap area/line, lalu satu PIC per assignment, durasi kerja PIC, tanggal, serta jam mulai dan selesai. Tolak jadwal yang bertumpang tindih jika PIC yang sama mengerjakan work order berbeda.
6. **Catat aktual**: isi manual tanggal, `ACT. TIME` dalam jam, status, dan catatan pekerjaan terpisah dari rencana.
7. **Ekspor**: bentuk ulang data relasional menjadi layout Excel seperti contoh. Header, formula, merge cell, dan format adalah urusan lapisan ekspor.

## Validasi penting

- Gunakan nomor order sebagai identitas; satu functional location dapat memiliki banyak order.
- Order yang tidak ditemukan pada sumber ditandai untuk review, bukan diam-diam dianggap SAP order yang valid.
- Bedakan `null` (belum diisi) dari `0` (nilai nol).
- `plannedDurationMinutes` adalah durasi kerja PIC yang ditugaskan dan tidak boleh negatif.
- Satu order hanya boleh ditautkan ke satu minggu/rencana dan memiliki satu assignment. PIC dan durasi boleh kosong sebelum ditugaskan, tetapi wajib dilengkapi sebelum pekerjaan dijadwalkan/dipublikasikan.
- PIC yang sama tidak boleh memiliki slot waktu bertumpang tindih pada work order yang berbeda.
- Tanggal eksekusi seharusnya berada pada periode rencana.
- Baris `Pekerjaan Tambahan` didukung tanpa nomor work order SAP.
- Kategori area/line, tipe WO, team leader per area/line, PIC, dan informasi lain yang tidak ada pada tiga kolom SAP yang disimpan harus diisi pada rencana atau melalui master data.
- Sel slot waktu kosong tidak berarti pekerjaan tidak dijadwalkan; simpan hanya alokasi yang benar-benar ada.

## Pertanyaan sebelum implementasi

Semua aturan berikut telah dikonfirmasi: satu order hanya berada pada satu minggu dengan satu assignment, PIC, dan durasi kerja PIC; slot waktu menunjukkan jam mulai/selesai dan tidak boleh bentrok untuk PIC yang sama pada work order berbeda; `ACT. TIME` adalah aktual dalam jam dan diisi manual. Type WO, kategori area/line, team leader per area/line, dan data PIC dikelola manual melalui master data aplikasi. Duplikasi order dan header slot yang keliru pada contoh hasil diabaikan.

## Tahapan implementasi yang disarankan

1. Terapkan kebijakan identitas order dan validasi impor untuk tiga kolom SAP.
2. Implementasikan rencana, kelompok, assignment unik per order, dan master data personel/tipe/area.
3. Implementasikan slot waktu dengan validasi bentrok per PIC, serta input manual actual time.
4. Bangun ekspor Excel dari data terstruktur agar menyerupai file hasil.

Dokumen ini merupakan rencana desain saja; tidak ada perubahan kode aplikasi atau skema Prisma.
