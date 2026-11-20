# SISTEM PENCATATAN KEUANGAN & STOK TBS
## POOL TBS KARYA MAJU
**Dokumen Referensi SOP**: `SOP-TBS-2026/01`  
**Standar**: *Standard Operating Procedure (SOP) & Format Buku Kerja Usaha Peron Kelapa Sawit*

---

### 🌟 Ringkasan Sistem Terintegrasi
Aplikasi ini dirancang khusus untuk mengelola operasional peron/lapak tandan buah segar (TBS) kelapa sawit secara **dinamis, real-time, dan terintegrasi dalam satu sistem**. Seluruh alur data, rumus kalkulasi, pemisahan arus kas, dan mekanisme pengendalian risiko mengacu ketat pada Dokumen SOP-TBS-2026/01.

---

### 🛡️ 3 Titik Kritis Pencegahan Kebocoran Kas Sesuai SOP
1. **Potongan Sortasi Lapak vs PKS**: Memastikan potongan mutu di lapak sebanding dengan refraksi sortasi pabrik.
2. **Susut Tonase Pengangkutan**: Memonitor selisih tonase muat jalan vs timbang PKS dengan batas aman toleransi 1,5% – 2,5%.
3. **Pengendalian Kasbon Petani**: Memotong angsuran kasbon secara otomatis saat petani menimbang buah dan mencatat kartu hutang secara transparan.

---

### 💵 Aturan Baku Arus Uang & Barang (Dual Wallet System)
> **"Jangan mencampur saldo kas di laci lapak dengan saldo di rekening PKS!"**
- **Kas Laci Lapak (Tunai / Kas Kecil)**: Digunakan khusus untuk pembayaran tunai harian ke petani (`Netto Bayar Lapak`), pinjaman kasbon baru, serta operasional harian lapak (solar genset, uang makan).
- **Kas Bank Rekening PKS (Transfer)**: Rekening penampung resmi penerimaan transfer pembayaran dari pabrik PKS sesuai `Netto Cair PKS` (setelah refraksi & potongan PPh Pasal 22 sebesar 0,25%).
- **Fitur Mutasi Internal**: Pencatatan resmi penarikan uang tunai dari Bank ke Kas Laci Lapak untuk menambah modal kerja timbang petani.

---

### 📑 4 Modul Inti yang Terintegrasi

#### 🚜 Modul 1: Buku Pembelian TBS Petani (Kas Keluar & Stok Masuk)
- **Data Timbang Lengkap**: Tanggal, No. Nota Timbang, Nama Petani/Poktan, No. Kendaraan, Bruto (kg), Tara (kg), Netto Bersih (kg).
- **Potongan Mutu (%)**: Mengakomodasi sampah, tangkai panjang, buah mentah, atau air.
- **Kalkulasi Otomatis**:
  $$\text{Netto Bayar (kg)} = \text{Netto} \times (1 - \text{Pot\%})$$
  $$\text{Total Nilai TBS (Rp)} = \text{Netto Bayar (kg)} \times \text{Harga Beli (Rp/kg)}$$
  $$\text{Bayar Bersih Tunai (Rp)} = \text{Total Nilai TBS} - \text{Potongan Kasbon (Rp)}$$
- **Otomatisasi Sistem**:
  - Mengeluarkan uang dari `Kas Laci Lapak` sebesar Bayar Bersih Tunai.
  - Memotong sisa hutang/kasbon petani bersangkutan.
  - Menambah stok fisik TBS di pelataran lapak.
  - Cetak Struk/Nota Timbang instan (Thermal 58mm/80mm & A4).

#### 🏭 Modul 2: Buku Penjualan & Pengiriman PKS (Piutang & Kas Masuk)
- **Pencatatan Tiket PKS**: No. Tiket PKS, No. Polisi Truk, Supir, Tonase Muat Lapak, Netto Timbang PKS, Refraksi Pabrik (%), Harga DO (Rp/kg).
- **Kalkulasi Otomatis Pajak & Transfer**:
  $$\text{Netto Cair (kg)} = \text{Netto PKS} \times (1 - \text{Refraksi\%})$$
  $$\text{Gross (Rp)} = \text{Netto Cair} \times \text{Harga DO}$$
  $$\text{PPh Pasal 22 (0,25\%)} = \text{Gross} \times 0,0025$$
  $$\text{Net Cair Transfer PKS (Rp)} = \text{Gross} - \text{PPh 22}$$
- **Sistem Status**:
  - `Pending`: Dicatat sebagai Piutang PKS yang belum ditransfer.
  - `Cair`: Dengan 1 tombol "Cairkan ➔", otomatis menambah saldo rekening `Kas Bank PKS`.

#### 💰 Modul 3: Jurnal Kas & Operasional Harian
- Menampilkan 2 dompet terpisah: **Kas Laci Lapak** dan **Kas Bank PKS**.
- Rekonsiliasi transaksi modal kerja, pembelian buah, uang jalan supir, biaya muat, solar genset, gaji karyawan lapak, dan mutasi saldo.
- Running balance (saldo berjalan) yang selalu ter-update otomatis.

#### ⚖️ Modul 4 & Evaluasi: Analisis Margin, Susut Tonase & Laba Rugi
1. **Formula Susut Tonase Pengangkutan**:
   $$\text{Susut (\%)} = \left[ \frac{\text{Total Netto Bayar Petani} - \text{Total Netto Dibayar PKS}}{\text{Total Netto Bayar Petani}} \right] \times 100\%$$
   - Indikator Warna Otomatis:
     - 🟢 **Hijau (<= 1,5%)**: Aman & Sangat Efisien.
     - 🟡 **Kuning (1,5% - 2,5%)**: Batas Toleransi Normal SOP.
     - 🔴 **Merah (> 2,5%)**: BAHAYA KEBOCORAN! Indikasi buah tercecer di jalan, sortasi PKS terlalu tajam, atau kalibrasi timbangan jembatan lapak bermasalah.
2. **Formula Laba Bersih Peron Harian (Rp)**:
   $$\text{Laba Bersih} = \text{Total Netto Cair PKS (Rp)} - \text{Total Pembelian Petani (Rp)} - \text{Biaya Muat \& Angkut} - \text{Operasional Lapak}$$
3. **Analisis Spread Margin**: Rata-rata Harga DO Pabrik vs Rata-rata Harga Beli Petani (Margin Kotor per kg).
4. **Monitoring Restan**: Menghitung sisa stok TBS di pelataran lapak yang belum terangkut ke pabrik.

---

### 🚀 Cara Menjalankan Aplikasi

#### Cara 1: Menggunakan Launcher Satu-Klik (Windows)
1. Buka folder `c:\Users\Swanto\OneDrive\Desktop\POOL TBS KARYA MAJU`.
2. Klik ganda (double click) pada file **`start_app.bat`**.
3. Aplikasi akan langsung membuka browser secara otomatis di alamat `http://localhost:3000`.

#### Cara 2: Menjalankan via Terminal / Command Prompt
```bash
cd "c:\Users\Swanto\OneDrive\Desktop\POOL TBS KARYA MAJU"
node server.js
```
Lalu buka browser Anda di: `http://localhost:3000`

#### Cara 3: Membuka Langsung Offline Tanpa Server
Cukup klik dua kali pada file **`index.html`** di browser Chrome / Edge / Firefox mana pun. Aplikasi memiliki mesin LocalStorage mandiri dan berfungsi 100% tanpa internet.

---

### 📂 Struktur Direktori Proyek
```
POOL TBS KARYA MAJU/
├── data/
│   └── database.json      # Basis data utama JSON (persisten aplikasi lokal)
├── database.sql           # Skema SQL RDBMS lengkap (DDL, DML Seed, Views P&L/Susut)
├── index.html             # Antarmuka Single Page App responsif
├── styles.css             # Desain UI modern dan print stylesheet
├── app.js                 # Logika bisnis terpadu, rumus SOP, dan canvas chart
├── server.js              # Server backend ringan (Node.js native http)
├── start_app.bat          # File peluncur otomatis Windows
├── package.json           # Konfigurasi proyek npm
└── README.md              # Buku panduan & dokumentasi SOP
```

---

### 🗄️ Panduan Penggunaan File SQL (`database.sql`)
File **`database.sql`** disediakan untuk integrasi ke sistem RDBMS (MySQL, MariaDB, phpMyAdmin, atau cloud SQL):
1. **Import ke MySQL / MariaDB via CLI**:
   ```bash
   mysql -u root -p < database.sql
   ```
2. **Import via phpMyAdmin / DBeaver / Navicat**:
   - Buka phpMyAdmin, buat/pilih database atau langsung buka tab **Import**.
   - Pilih file `database.sql` dan klik **Go / Kirim**.
3. **Fitur Khusus SQL**:
   - Skema tabel terelasi penuh: `settings`, `petani`, `pembelian_tbs`, `penjualan_pks`, `jurnal_kas`, `kasbon_log`.
   - `STORED GENERATED COLUMNS` untuk perhitungan instan netto, potongan kg, dan refraksi.
   - **SQL Views Analitik**:
     - `v_audit_susut_truk`: Audit susut jalan per truk dan status toleransi SOP.
     - `v_laba_rugi_harian`: Laporan P&L operasional harian otomatis.
     - `v_saldo_dual_wallet`: Monitoring saldo Kas Laci Lapak vs Kas Bank PKS secara terpisah.

---
*Dibuat untuk POOL TBS KARYA MAJU — Standar Operasional Prosedur Peron Kelapa Sawit (SOP-TBS-2026/01).*
