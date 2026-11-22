# Plan Proses Penggunaan Aplikasi MASOGAK

## 1. Tujuan dan cakupan

Dokumen ini menjelaskan alur operasional mingguan untuk mengelola work order SAP, menyusun rencana maintenance, mengatur PIC dan waktu kerja, mencatat hasil aktual, serta menyiapkan laporan. Alur ini mengikuti struktur data dan aturan bisnis yang telah disepakati dalam `schema-rencana-maintenance.md`.

## 2. Peran pengguna

- **Admin aplikasi**: mengelola master personel, tipe work order, dan area/line.
- **Planner / supervisor maintenance**: mengimpor data SAP, membuat rencana mingguan, mengelompokkan order, menentukan team leader, PIC, durasi dan jadwal, serta menerbitkan rencana.
- **Team leader**: meninjau pekerjaan di area/line yang dipimpin dan memantau progres.
- **PIC / teknisi / operator / production support**: melihat pekerjaan yang ditugaskan dan memperbarui hasil pelaksanaan.
- **Pimpinan / viewer**: memantau ringkasan dan mengunduh laporan.

## 3. Alur utama penggunaan

### Tahap A — Persiapan master data

1. Admin membuka **Master Data**.
2. Pastikan personel tersedia, aktif, dan memiliki identitas yang benar; tentukan role PIC yang dapat dipilih (T, O, atau P).
3. Pastikan daftar area/line, tipe WO, dan team leader yang berlaku tersedia.
4. Nonaktifkan personel yang tidak lagi dapat ditugaskan, tanpa menghapus histori pekerjaan.

**Hasil:** pilihan personel dan klasifikasi rencana siap digunakan.

### Tahap B — Impor dan validasi work order SAP

1. Planner membuka **Work Order SAP** atau tombol **Impor SAP**, lalu memilih file Excel SAP.
2. Aplikasi mencatat batch impor dan membaca hanya kolom **Order**, **Description**, dan **Functional Location**. Kolom SAP lainnya tidak disimpan.
3. Aplikasi memvalidasi keberadaan nomor order dan teks yang diperlukan, serta mendeteksi nomor order yang berulang dalam batch.
4. Planner meninjau ringkasan jumlah baris valid dan bermasalah. Baris bermasalah diperbaiki pada file sumber lalu diimpor ulang; data sumber yang sudah diimpor tidak diedit dari layar rencana.
5. Work order yang sudah pernah dimasukkan ke rencana ditandai agar tidak dapat ditugaskan kembali ke minggu/rencana lain.

**Hasil:** data sumber SAP tervalidasi dan dapat dipilih untuk perencanaan.

### Tahap C — Membuat rencana mingguan

1. Planner memilih **Buat rencana**.
2. Isi nama rencana, nomor minggu, tahun, rentang tanggal, dan site/plant.
3. Simpan sebagai **Draft**.
4. Buat kelompok area/line sesuai kebutuhan, misalnya UTILITY atau SPS 600ml, lalu atur urutannya dan tentukan team leader setiap kelompok.
5. Pastikan rentang tanggal rencana konsisten dengan minggu yang dipilih.

**Hasil:** draft rencana mingguan beserta kelompok kerja tersedia.

### Tahap D — Memilih dan melengkapi work order

1. Planner memilih work order SAP yang relevan untuk rencana, atau membuat pekerjaan tambahan tanpa nomor SAP bila dibutuhkan.
2. Masukkan setiap order ke satu kelompok area/line.
3. Lengkapi tipe WO bila diperlukan, satu PIC, role PIC, dan durasi rencana dalam menit.
4. Periksa deskripsi dan functional location. Jika perlu penyesuaian untuk rencana, gunakan nilai override tanpa mengubah data SAP sumber.
5. Tentukan tanggal pelaksanaan dan catatan kerja.
6. Untuk pekerjaan tambahan, isi nomor (jika ada), deskripsi, area, PIC, dan durasi secara manual.

**Aturan:** satu work order SAP hanya boleh memiliki satu assignment pada satu rencana; satu assignment memiliki satu PIC dan satu durasi rencana. Durasi tidak boleh negatif.

### Tahap E — Menyusun jadwal dan menerbitkan rencana

1. Planner menentukan waktu mulai dan selesai untuk setiap pekerjaan yang dijadwalkan.
2. Aplikasi memeriksa bahwa waktu selesai lebih besar dari waktu mulai dan tanggal berada dalam periode rencana.
3. Aplikasi menolak slot yang bertumpang tindih untuk PIC yang sama pada pekerjaan berbeda.
4. Tinjau daftar pekerjaan yang belum memiliki PIC, durasi, tanggal, atau slot waktu; lengkapi sebelum publikasi sesuai kebijakan tim.
5. Tinjau beban kerja per kelompok dan PIC, lalu simpan perubahan draft.
6. Setelah disetujui, planner mengubah status rencana menjadi **Published**. Perubahan berikutnya mengikuti otorisasi dan dicatat agar pengguna memahami versi rencana terkini.

**Hasil:** rencana mingguan siap dilaksanakan dan dapat dilihat oleh team leader serta PIC.

### Tahap F — Pelaksanaan dan pencatatan aktual

1. PIC membuka daftar pekerjaan terjadwal dan memeriksa deskripsi, lokasi, waktu, serta catatan.
2. Saat pekerjaan dimulai, PIC memperbarui status menjadi **In Progress**.
3. Setelah pekerjaan dilakukan, PIC atau pengguna yang berwenang mengisi tanggal pelaksanaan, waktu aktual bila tersedia, **ACT. TIME** dalam jam, status hasil (Completed, Partial, atau Not Done), dan catatan.
4. Bila pekerjaan belum selesai, catat kendala dan status yang sesuai; jangan mengubah durasi rencana untuk menyamarkan durasi aktual.
5. Team leader meninjau catatan aktual dan memastikan pekerjaan selesai atau memiliki tindak lanjut.
6. Setelah pekerjaan diverifikasi, status assignment diperbarui menjadi **Done** atau status pengecualian yang sesuai.

**Hasil:** data pelaksanaan tercatat terpisah dari rencana, sehingga rencana dan aktual dapat dibandingkan.

### Tahap G — Pemantauan dan laporan

1. Planner dan pimpinan memantau ringkasan jumlah work order, pekerjaan yang belum ditugaskan, total durasi rencana, status jadwal, dan persentase penyelesaian.
2. Gunakan pencarian dan filter status untuk meninjau order tertentu.
3. Ekspor laporan rencana/aktual ke Excel setelah data ditinjau. Format spreadsheet dibentuk dari data terstruktur, bukan menjadi sumber data utama.
4. Setelah periode selesai dan seluruh aktual ditinjau, tandai rencana **Completed**. Rencana yang dibatalkan diberi status **Cancelled**, bukan dihapus.

## 4. Status yang digunakan

| Objek | Status | Makna operasional |
|---|---|---|
| Rencana | Draft | Masih disusun dan belum dipublikasikan |
| Rencana | Published | Jadwal telah disetujui dan dibagikan |
| Rencana | In Progress | Periode pelaksanaan sedang berjalan |
| Rencana | Completed | Periode selesai dan review aktual telah dilakukan |
| Rencana | Cancelled | Rencana tidak dilanjutkan; histori dipertahankan |
| Assignment | Planned | Order sudah masuk rencana, belum lengkap ditugaskan |
| Assignment | Assigned | PIC telah ditentukan |
| Assignment | Scheduled | PIC dan jadwal telah ditentukan |
| Assignment | In Progress | Pekerjaan sedang dilaksanakan |
| Assignment | Done | Pekerjaan selesai dan diverifikasi sesuai proses |
| Assignment | Skipped / Cancelled | Tidak dilaksanakan atau dibatalkan dengan alasan/catatan |

## 5. Validasi dan penanganan pengecualian

- Nomor order SAP adalah identitas work order; functional location boleh berulang.
- Duplikasi nomor order dalam batch harus ditinjau, bukan digabung berdasarkan functional location.
- Data SAP yang sudah diimpor dipertahankan sebagai sumber; perubahan rencana menggunakan override.
- Order yang tidak ditemukan pada data sumber harus ditandai untuk review; pekerjaan non-SAP dibuat secara eksplisit sebagai pekerjaan tambahan.
- Satu order SAP tidak boleh muncul di lebih dari satu rencana atau memiliki PIC/durasi ganda.
- Slot PIC yang bertabrakan harus dijadwalkan ulang sebelum rencana diterbitkan.
- Nilai kosong berarti belum diketahui; jangan menggantinya dengan nol tanpa makna bisnis.
- Semua catatan aktual disimpan terpisah dari nilai rencana.

## 6. Urutan layar / navigasi yang disarankan

1. **Ringkasan** — indikator rencana aktif, progres, dan pekerjaan yang perlu perhatian.
2. **Work Order SAP** — riwayat batch, impor, hasil validasi, dan daftar order yang tersedia.
3. **Rencana Mingguan** — daftar rencana, detail kelompok, assignment, serta kalender/jadwal.
4. **Pelaksanaan** — daftar pekerjaan per PIC/team leader dan formulir pencatatan aktual.
5. **Master Data** — personel, role, area/line, tipe WO, dan team leader.
6. **Laporan** — ringkasan, perbandingan rencana-aktual, dan ekspor Excel.

## 7. Kriteria alur siap digunakan

- Pengguna dapat mengimpor file dan melihat hasil validasi dengan alasan kesalahan yang jelas.
- Pengguna dapat membuat draft rencana mingguan, kelompok, dan assignment tanpa mengubah data sumber.
- Sistem mencegah order SAP ditugaskan lebih dari sekali dan mencegah tabrakan jadwal PIC.
- PIC dapat memperbarui status dan data aktual sesuai hak akses.
- Planner dapat meninjau progres serta mengekspor laporan yang konsisten dengan data rencana dan aktual.

## 8. Proses CRUD per modul

Bagian ini menjabarkan operasi **Create, Read, Update, Delete** pada setiap modul. Penghapusan mengikuti prinsip menjaga histori: data yang sudah dipakai pada transaksi tidak dihapus permanen, melainkan dinonaktifkan, dibatalkan, atau ditandai tidak berlaku.

### 8.1 Master personel

| Operasi | Proses |
|---|---|
| **Create** | Admin menambahkan kode karyawan (bila tersedia), nama, role PIC yang dapat dijalankan (T/O/P), dan status aktif. Validasi kode karyawan agar tidak duplikat. |
| **Read** | Tampilkan daftar dan detail personel, role, status aktif, serta keterkaitan dengan assignment/team leader. Sediakan pencarian berdasarkan nama atau kode. |
| **Update** | Admin mengubah nama, kode, role, atau status. Perubahan tidak mengubah snapshot histori pelaksanaan; personel yang sudah tidak tersedia diubah menjadi nonaktif. |
| **Delete** | Personel tanpa relasi transaksi dapat dihapus sesuai kebijakan. Jika pernah menjadi PIC atau team leader, larang hard delete; nonaktifkan agar histori tetap utuh. |

### 8.2 Master area/line, tipe WO, dan kategori terkait

| Operasi | Proses |
|---|---|
| **Create** | Admin membuat item master dengan nama/kode, deskripsi bila perlu, dan status aktif. Cegah kode/nama duplikat dalam cakupan yang sama. |
| **Read** | Tampilkan daftar item aktif dan nonaktif, dengan pencarian dan filter. Item yang digunakan dalam rencana lama tetap dapat dilihat. |
| **Update** | Admin memperbarui label, kode, atau status aktif. Perubahan nama master tidak boleh mengubah nilai historis yang sudah menjadi bagian dari rencana terbit. |
| **Delete** | Item yang belum pernah digunakan dapat dihapus. Item yang sudah direferensikan assignment/rencana dinonaktifkan, bukan dihapus permanen. |

### 8.3 Batch impor SAP dan work order SAP

| Operasi | Proses |
|---|---|
| **Create** | Planner mengunggah file. Sistem membuat batch, membaca hanya Order, Description, dan Functional Location, memvalidasi baris, lalu menyimpan hasil valid sesuai aturan duplikasi. Tampilkan ringkasan valid/gagal sebelum atau sesudah konfirmasi simpan. |
| **Read** | Tampilkan riwayat batch, waktu impor, nama file, status, jumlah baris, jumlah error, dan daftar order dengan sumber batch/baris. Cari berdasarkan nomor order atau functional location. |
| **Update** | Data sumber SAP bersifat read-only setelah impor. Untuk koreksi, impor ulang data yang telah diperbaiki sebagai batch baru; gunakan aturan pencocokan nomor order yang disepakati dan jangan menimpa histori batch. Metadata status batch dapat diperbarui oleh proses validasi. |
| **Delete** | Batch/order yang belum dipakai pada rencana dapat dihapus atau dibatalkan oleh planner berwenang sesuai kebijakan retensi. Jika sudah direferensikan assignment, larang hard delete; tandai batch/order tidak berlaku atau pertahankan sebagai histori. Penghapusan tidak boleh menghapus catatan pelaksanaan. |

**Catatan:** kebijakan apakah impor ulang memperbarui satu rekaman terkini atau menyimpan snapshot per batch perlu konsisten dengan skema dan implementasi. Jangan mengubah kolom SAP selain tiga kolom yang disetujui.

### 8.4 Rencana maintenance

| Operasi | Proses |
|---|---|
| **Create** | Planner membuat rencana dengan nama, minggu, tahun, tanggal mulai/selesai, dan site; sistem memberi status awal **Draft**. Validasi periode dan duplikasi rencana sesuai aturan site/minggu. |
| **Read** | Pengguna melihat daftar rencana sesuai hak akses, filter tahun/minggu/site/status, lalu membuka ringkasan, kelompok, assignment, progres, dan aktual. Viewer hanya dapat membaca dan mengekspor. |
| **Update** | Planner mengubah metadata dan isi rencana saat Draft. Rencana Published/In Progress hanya dapat diubah oleh pengguna berwenang melalui proses revisi; validasi ulang jadwal dan catat perubahan. Status diubah melalui transisi yang diizinkan. |
| **Delete** | Draft kosong yang belum memiliki assignment dapat dihapus oleh planner. Rencana yang sudah memiliki assignment atau telah dipublikasikan tidak dihapus permanen; ubah status menjadi **Cancelled** dan simpan alasan serta histori. Rencana Completed dipertahankan sebagai arsip. |

### 8.5 Kelompok area/line dan team leader

| Operasi | Proses |
|---|---|
| **Create** | Planner menambahkan kelompok pada rencana Draft, memilih area/line, menetapkan team leader aktif, dan menentukan urutan tampilan. |
| **Read** | Tampilkan kelompok, team leader, urutan, serta assignment yang tergabung. Team leader hanya melihat kelompok yang menjadi tanggung jawabnya bila pembatasan akses diterapkan. |
| **Update** | Planner mengganti nama/urutan atau team leader saat Draft. Setelah Published, perubahan memerlukan izin revisi; assignment dan histori tetap terkait ke rencana yang sama. |
| **Delete** | Kelompok kosong pada Draft dapat dihapus. Kelompok yang memiliki assignment tidak dapat dihapus sebelum assignment dipindahkan; pada rencana terbit, pertahankan histori dan gunakan perubahan terkontrol, bukan hard delete. |

### 8.6 Assignment / pekerjaan dalam rencana

| Operasi | Proses |
|---|---|
| **Create** | Planner menambahkan work order SAP yang belum pernah ditugaskan, atau membuat pekerjaan tambahan non-SAP. Isi kelompok, tipe WO, satu PIC dan role, durasi menit, tanggal, override, serta catatan sesuai kebutuhan. Sistem menolak order SAP duplikat dan durasi negatif. |
| **Read** | Tampilkan data sumber dan override, kelompok, team leader, PIC, role, tanggal, durasi, status, jadwal, dan aktual. Sediakan filter per rencana, kelompok, PIC, tanggal, dan status. |
| **Update** | Planner mengubah detail saat Draft. Setelah Published, perubahan mengikuti hak revisi dan memvalidasi ulang status, tanggal, durasi, serta konflik slot PIC. PIC hanya dapat memperbarui status/progres yang menjadi kewenangannya, bukan data sumber atau penugasan inti. |
| **Delete** | Assignment Draft yang belum memiliki aktual dapat dihapus/dilepas dari rencana. Assignment yang sudah dipublikasikan, dimulai, atau memiliki aktual tidak dihapus permanen; tandai **Cancelled/Skipped** dan wajibkan alasan. Penghapusan assignment SAP harus melepaskan relasi secara konsisten agar aturan satu order-satu rencana tetap berlaku sesuai kebijakan. |

### 8.7 Slot jadwal (ScheduleBlock)

| Operasi | Proses |
|---|---|
| **Create** | Planner menambahkan slot waktu pada assignment dengan waktu mulai dan selesai. Sistem memastikan selesai setelah mulai, berada dalam periode rencana, dan tidak bentrok dengan slot PIC yang sama pada pekerjaan lain. |
| **Read** | Tampilkan slot pada kalender/timeline dan detail assignment, termasuk catatan slot. |
| **Update** | Planner mengubah tanggal/jam atau catatan; sistem menjalankan ulang seluruh validasi konflik sebelum menyimpan. Perubahan pada jadwal Published mengikuti proses revisi/notifikasi. |
| **Delete** | Slot pada Draft dapat dihapus. Slot pada rencana Published dapat dihapus oleh planner berwenang dengan alasan/perubahan tercatat; jangan hapus assignment atau aktual terkait. |

### 8.8 Catatan pelaksanaan aktual (WorkExecution)

| Operasi | Proses |
|---|---|
| **Create** | PIC membuat catatan aktual ketika pekerjaan dimulai atau selesai, mengisi tanggal, waktu aktual bila ada, durasi aktual dalam jam, status hasil, dan catatan. Validasi durasi tidak negatif dan tanggal sesuai aturan periode/pengecualian. |
| **Read** | PIC melihat catatan miliknya; team leader melihat catatan kelompoknya; planner dan viewer berwenang melihat aktual serta perbandingan terhadap rencana. |
| **Update** | PIC memperbarui catatan selama belum dikunci/ditinjau. Setelah diverifikasi, koreksi memerlukan wewenang supervisor dan alasan; perubahan aktual tidak mengubah durasi rencana. |
| **Delete** | Catatan aktual tidak dihapus permanen setelah disimpan. Jika salah input, gunakan pembatalan/koreksi yang tercatat (status, alasan, pelaku, waktu), atau minta supervisor melakukan koreksi dengan audit trail. |

### 8.9 Laporan dan ekspor

Laporan merupakan keluaran baca-saja, bukan data transaksi yang diedit langsung.

| Operasi | Proses |
|---|---|
| **Create** | Pengguna membuat keluaran laporan dengan memilih rencana/periode, filter, dan format ekspor. |
| **Read** | Tampilkan pratinjau ringkasan dan rincian rencana versus aktual sesuai hak akses. |
| **Update** | Ubah parameter/filter laporan lalu buat pratinjau ulang; koreksi data dilakukan pada modul sumber, bukan pada file laporan. |
| **Delete** | File ekspor sementara dapat dihapus sesuai kebijakan penyimpanan. Penghapusan file tidak menghapus rencana, assignment, atau aktual di aplikasi. |

## 9. Hak akses CRUD ringkas

| Modul | Admin | Planner / Supervisor | Team leader | PIC | Viewer |
|---|---|---|---|---|---|
| Master data | CRUD | Read | Read | Read terbatas | Read |
| Impor SAP | Read / kelola teknis | Create, Read; koreksi lewat batch baru | Read | — | Read terbatas |
| Rencana & kelompok | Read | CRUD sesuai status/transisi | Read kelompok | Read penugasan | Read |
| Assignment & jadwal | Read | CRUD sesuai status/transisi | Read / review | Read penugasan | Read |
| Aktual | Read / audit | Read / koreksi berwenang | Read / review | Create, Read, Update milik sendiri | Read |
| Laporan | Read / ekspor | Read / ekspor | Read / ekspor terbatas | Read pekerjaan sendiri | Read / ekspor sesuai izin |

Hak akses di atas adalah rancangan operasional; implementasi autentikasi dan otorisasi perlu menetapkan cakupan data, khususnya untuk team leader dan PIC.

## 10. Aturan umum penghapusan dan audit

1. **Hard delete** hanya untuk data yang belum direferensikan transaksi dan belum memiliki histori.
2. Data yang telah dipublikasikan, dijadwalkan, dilaksanakan, atau dipakai laporan dipertahankan; gunakan status nonaktif, Cancelled, Skipped, atau mekanisme koreksi.
3. Perubahan penting mencatat pengguna, waktu, nilai sebelum/sesudah, dan alasan, terutama untuk perubahan setelah publikasi dan koreksi aktual.
4. Sebelum menyimpan update, jalankan validasi yang sama dengan proses create, termasuk keunikan order, rentang periode, durasi, serta konflik PIC.
5. Tampilkan konfirmasi dan dampak sebelum operasi delete/cancel, misalnya jumlah assignment terdampak dan apakah data aktual sudah ada.
