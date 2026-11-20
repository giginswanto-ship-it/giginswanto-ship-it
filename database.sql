-- ==============================================================================
-- SISTEM PENCATATAN KEUANGAN & STOK TBS - POOL TBS KARYA MAJU
-- Dokumen Standar: SOP-TBS-2026/01
-- RDBMS Target: MySQL / MariaDB (Kompatibel PostgreSQL & SQLite dengan penyesuaian)
-- Tanggal Pembuatan: 2026-11-20
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `pool_tbs_karyamaju` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `pool_tbs_karyamaju`;

-- ------------------------------------------------------------------------------
-- 1. TABEL PENGATURAN & PROFIL PERON (SETTINGS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `peron_name` VARCHAR(100) NOT NULL DEFAULT 'POOL TBS KARYA MAJU',
    `pks_partner` VARCHAR(100) NOT NULL DEFAULT 'PT. Sawit Makmur Perkasa',
    `dokumen_id` VARCHAR(50) NOT NULL DEFAULT 'SOP-TBS-2026/01',
    `alamat` TEXT NULL,
    `telepon` VARCHAR(30) NULL,
    `default_harga_beli` DECIMAL(12, 2) NOT NULL DEFAULT 2450.00,
    `default_harga_do` DECIMAL(12, 2) NOT NULL DEFAULT 2780.00,
    `pph_rate` DECIMAL(6, 4) NOT NULL DEFAULT 0.0025 COMMENT 'PPh Pasal 22 sebesar 0,25%',
    `target_susut_max` DECIMAL(5, 2) NOT NULL DEFAULT 2.50 COMMENT 'Batas toleransi maksimal susut jalan (1.5% - 2.5%)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Konfigurasi profil dan parameter standar operasional peron';

-- ------------------------------------------------------------------------------
-- 2. TABEL MASTER PETANI & PENGENDALIAN KASBON (FARMERS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `petani`;
CREATE TABLE `petani` (
    `id` VARCHAR(20) PRIMARY KEY COMMENT 'Contoh: F-001',
    `nama_petani` VARCHAR(100) NOT NULL,
    `no_telepon` VARCHAR(30) NULL,
    `lokasi_kebun` VARCHAR(150) NULL,
    `saldo_kasbon` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Sisa hutang/kasbon berjalan saat ini',
    `total_pinjaman_history` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Akumulasi total pinjaman yang pernah diambil',
    `status_aktif` ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_petani_nama` (`nama_petani`),
    INDEX `idx_petani_saldo_kasbon` (`saldo_kasbon`)
) ENGINE=InnoDB COMMENT='Master data petani mitra dan kontrol saldo kasbon';

-- ------------------------------------------------------------------------------
-- 3. MODUL 1: BUKU PEMBELIAN TBS PETANI (KAS KELUAR & STOK MASUK)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `pembelian_tbs`;
CREATE TABLE `pembelian_tbs` (
    `id` VARCHAR(30) PRIMARY KEY COMMENT 'Contoh: BUY-20261120-001',
    `no_nota` VARCHAR(30) NOT NULL UNIQUE COMMENT 'Contoh: TB-20261120-001',
    `tanggal_timbang` DATE NOT NULL,
    `petani_id` VARCHAR(20) NOT NULL,
    `nama_petani` VARCHAR(100) NOT NULL,
    `no_kendaraan` VARCHAR(20) NULL DEFAULT '-',
    `bruto_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Timbangan kotor masuk berisi buah',
    `tara_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Timbangan kosong keluar kendaraan',
    `netto_kg` DECIMAL(10, 2) GENERATED ALWAYS AS (`bruto_kg` - `tara_kg`) STORED COMMENT 'Netto Kotor Lapak',
    `pot_mutu_persen` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'Potongan sortasi lapak (sampah, tangkai panjang, air)',
    `pot_mutu_kg` DECIMAL(10, 2) GENERATED ALWAYS AS (ROUND((`bruto_kg` - `tara_kg`) * (`pot_mutu_persen` / 100), 2)) STORED,
    `n_bayar_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Netto Bayar Lapak = Netto - Potongan Kg (Menambah Stok Lapak)',
    `harga_beli_per_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Harga beli di peron/lapak (Rp/kg)',
    `total_nilai_rp` DECIMAL(15, 2) NOT NULL COMMENT 'Total = N. Bayar * Harga Beli',
    `pot_kasbon_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Potongan angsuran kasbon petani',
    `bayar_bersih_rp` DECIMAL(15, 2) NOT NULL COMMENT 'Bayar Bersih Tunai ke Petani = Total - Pot. Kasbon (Kas Keluar Laci)',
    `catatan_mutu` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pembelian_petani` FOREIGN KEY (`petani_id`) REFERENCES `petani` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_pembelian_tanggal` (`tanggal_timbang`),
    INDEX `idx_pembelian_petani` (`petani_id`)
) ENGINE=InnoDB COMMENT='Buku pembelian buah sawit dari petani (Modul 1)';

-- ------------------------------------------------------------------------------
-- 4. MODUL 2: BUKU PENJUALAN & PENGIRIMAN PKS (PIUTANG & KAS MASUK)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `penjualan_pks`;
CREATE TABLE `penjualan_pks` (
    `id` VARCHAR(30) PRIMARY KEY COMMENT 'Contoh: SALE-20261120-001',
    `tanggal_kirim` DATE NOT NULL,
    `no_tiket_pks` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nomor tiket timbang resmi PKS, contoh: PKS-08911',
    `no_polisi` VARCHAR(20) NOT NULL COMMENT 'Nomor plat truk, contoh: BM 8123 XX',
    `nama_supir` VARCHAR(100) NULL,
    `pks_tujuan` VARCHAR(100) NOT NULL DEFAULT 'PT. Sawit Makmur Perkasa',
    `netto_lapak_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Timbangan muat di lapak sebelum berangkat (Audit susut jalan)',
    `netto_pks_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Netto resmi timbang PKS',
    `refraksi_persen` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'Sortasi potongan mutu pabrik PKS (misal 2.0%)',
    `refraksi_kg` DECIMAL(10, 2) GENERATED ALWAYS AS (ROUND(`netto_pks_kg` * (`refraksi_persen` / 100), 2)) STORED,
    `n_cair_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Netto Cair = Netto PKS * (1 - Refraksi%)',
    `harga_do_per_kg` DECIMAL(10, 2) NOT NULL COMMENT 'Harga Delivery Order resmi pabrik PKS (Rp/kg)',
    `gross_rp` DECIMAL(15, 2) NOT NULL COMMENT 'Gross = N. Cair * Harga DO',
    `pph22_persen` DECIMAL(5, 4) NOT NULL DEFAULT 0.0025 COMMENT 'Tarif PPh 22 (0.25%)',
    `pph22_rp` DECIMAL(15, 2) NOT NULL COMMENT 'PPh 22 = Gross * 0.25%',
    `net_cair_rp` DECIMAL(15, 2) NOT NULL COMMENT 'Net Cair Transfer Bank = Gross - PPh 22',
    `status_pembayaran` ENUM('Pending', 'Cair') NOT NULL DEFAULT 'Pending' COMMENT 'Pending = Piutang PKS, Cair = Masuk Rekening Bank',
    `tanggal_cair` DATE NULL COMMENT 'Tanggal dana efektif masuk rekening bank peron',
    `rekening_bank_tujuan` VARCHAR(50) NULL DEFAULT 'Rekening Penampung PKS',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_penjualan_tanggal` (`tanggal_kirim`),
    INDEX `idx_penjualan_tiket` (`no_tiket_pks`),
    INDEX `idx_penjualan_status` (`status_pembayaran`)
) ENGINE=InnoDB COMMENT='Buku penjualan dan pengiriman TBS ke pabrik PKS (Modul 2)';

-- ------------------------------------------------------------------------------
-- 5. MODUL 3: JURNAL KAS & OPERASIONAL HARIAN (DUAL WALLET ARUS KAS)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `jurnal_kas`;
CREATE TABLE `jurnal_kas` (
    `id` VARCHAR(30) PRIMARY KEY COMMENT 'Contoh: JRN-20261120-001',
    `tanggal` DATE NOT NULL,
    `keterangan` VARCHAR(255) NOT NULL,
    `kategori` ENUM(
        'Modal Kerja',
        'Pembelian TBS',
        'Biaya Angkut',
        'Upah Muat',
        'Penjualan PKS',
        'Kasbon Petani',
        'Solar & Genset',
        'Gaji & Operasional',
        'Konsumsi & ATK',
        'Perawatan Lapak',
        'Mutasi Kas',
        'Operasional Lain'
    ) NOT NULL,
    `akun_kas` ENUM(
        'Kas Laci Lapak',
        'Kas Bank PKS',
        'Kas Lapak & Bank',
        'Kas Laci & Bank'
    ) NOT NULL COMMENT 'Aturan Baku SOP: Jangan mencampur saldo laci lapak dengan bank PKS!',
    `kas_masuk_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `kas_keluar_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `lapak_masuk_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `lapak_keluar_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `bank_masuk_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `bank_keluar_rp` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `ref_modul` VARCHAR(30) NULL COMMENT 'BUY / SALE / LOAN / MUT / EXP',
    `ref_id` VARCHAR(50) NULL COMMENT 'ID referensi transaksi terkait',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_jurnal_tanggal` (`tanggal`),
    INDEX `idx_jurnal_kategori` (`kategori`),
    INDEX `idx_jurnal_akun` (`akun_kas`)
) ENGINE=InnoDB COMMENT='Jurnal kas harian dengan pemisahan dompet laci lapak dan rekening bank (Modul 3)';

-- ------------------------------------------------------------------------------
-- 6. RIWAYAT MUTASI KASBON PETANI (KASBON AUDIT LOG)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `kasbon_log`;
CREATE TABLE `kasbon_log` (
    `id` VARCHAR(30) PRIMARY KEY COMMENT 'Contoh: KB-20261120-001',
    `tanggal` DATE NOT NULL,
    `petani_id` VARCHAR(20) NOT NULL,
    `nama_petani` VARCHAR(100) NOT NULL,
    `jenis_mutasi` ENUM('Pinjaman', 'Potongan Timbang', 'Pelunasan Tunai') NOT NULL,
    `jumlah_rp` DECIMAL(15, 2) NOT NULL,
    `sisa_saldo_kasbon_rp` DECIMAL(15, 2) NULL COMMENT 'Saldo kasbon setelah transaksi',
    `keterangan` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_kasbon_petani` FOREIGN KEY (`petani_id`) REFERENCES `petani` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_kasbon_petani` (`petani_id`),
    INDEX `idx_kasbon_tanggal` (`tanggal`)
) ENGINE=InnoDB COMMENT='Audit trail mutasi pinjaman dan potongan timbang kasbon petani';

-- ==============================================================================
-- 7. SQL VIEWS UNTUK EVALUASI BISNIS, SUSUT TONASE & LABA RUGI (MODUL 4)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- VIEW 1: AUDIT SUSUT TONASE PER TRUK PENGIRIMAN KE PKS
-- Menghitung selisih timbang jalan dan status toleransi SOP (1.5% - 2.5%)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_audit_susut_truk` AS
SELECT 
    `id` AS `sale_id`,
    `tanggal_kirim`,
    `no_tiket_pks`,
    `no_polisi`,
    `nama_supir`,
    `netto_lapak_kg`,
    `netto_pks_kg`,
    (`netto_lapak_kg` - `netto_pks_kg`) AS `susut_jalan_kg`,
    ROUND(((`netto_lapak_kg` - `netto_pks_kg`) / `netto_lapak_kg`) * 100, 2) AS `susut_jalan_persen`,
    `refraksi_persen`,
    `n_cair_kg`,
    `harga_do_per_kg`,
    `net_cair_rp`,
    `status_pembayaran`,
    CASE 
        WHEN ROUND(((`netto_lapak_kg` - `netto_pks_kg`) / `netto_lapak_kg`) * 100, 2) <= 1.50 THEN 'AMAN (<= 1.5%)'
        WHEN ROUND(((`netto_lapak_kg` - `netto_pks_kg`) / `netto_lapak_kg`) * 100, 2) <= 2.50 THEN 'WASPADA (Toleransi SOP 1.5% - 2.5%)'
        ELSE 'BAHAYA (Kebocoran > 2.5%)'
    END AS `status_toleransi_sop`
FROM `penjualan_pks`;

-- ------------------------------------------------------------------------------
-- VIEW 2: REKAPITULASI LABA RUGI OPERASIONAL PERON HARIAN (P&L STATEMENT)
-- Formula SOP: Laba Bersih = Netto Cair PKS - Pembelian Petani - Biaya Angkut - Operasional Lapak
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_laba_rugi_harian` AS
SELECT 
    p.`tanggal` AS `tanggal_operasional`,
    COALESCE(beli.`total_tonase_bayar_kg`, 0) AS `tonase_beli_petani_kg`,
    COALESCE(beli.`total_beli_rp`, 0) AS `pembelian_petani_rp`,
    COALESCE(beli.`total_pot_kasbon_rp`, 0) AS `potongan_kasbon_rp`,
    COALESCE(beli.`total_bayar_bersih_rp`, 0) AS `bayar_bersih_tunai_rp`,
    COALESCE(jual.`total_tonase_cair_kg`, 0) AS `tonase_cair_pks_kg`,
    COALESCE(jual.`total_gross_pks_rp`, 0) AS `gross_penjualan_pks_rp`,
    COALESCE(jual.`total_pph22_rp`, 0) AS `pajak_pph22_rp`,
    COALESCE(jual.`total_net_cair_rp`, 0) AS `netto_cair_pks_rp`,
    COALESCE(biaya.`biaya_angkut_rp`, 0) AS `biaya_muat_dan_angkut_rp`,
    COALESCE(biaya.`biaya_operasional_rp`, 0) AS `biaya_operasional_lapak_rp`,
    -- FORMULA LABA BERSIH SESUAI SOP:
    (COALESCE(jual.`total_net_cair_rp`, 0) - COALESCE(beli.`total_beli_rp`, 0) - COALESCE(biaya.`biaya_angkut_rp`, 0) - COALESCE(biaya.`biaya_operasional_rp`, 0)) AS `laba_bersih_peron_rp`,
    -- SPREAD MARGIN PER KG:
    CASE 
        WHEN COALESCE(jual.`total_tonase_cair_kg`, 0) > 0 AND COALESCE(beli.`total_tonase_bayar_kg`, 0) > 0 
        THEN ROUND((COALESCE(jual.`total_gross_pks_rp`, 0) / jual.`total_tonase_cair_kg`) - (COALESCE(beli.`total_beli_rp`, 0) / beli.`total_tonase_bayar_kg`), 2)
        ELSE 0.00
    END AS `spread_margin_kotor_per_kg`
FROM (
    SELECT DISTINCT `tanggal_timbang` AS `tanggal` FROM `pembelian_tbs`
    UNION
    SELECT DISTINCT `tanggal_kirim` AS `tanggal` FROM `penjualan_pks`
    UNION
    SELECT DISTINCT `tanggal` AS `tanggal` FROM `jurnal_kas`
) p
LEFT JOIN (
    SELECT 
        `tanggal_timbang`,
        SUM(`n_bayar_kg`) AS `total_tonase_bayar_kg`,
        SUM(`total_nilai_rp`) AS `total_beli_rp`,
        SUM(`pot_kasbon_rp`) AS `total_pot_kasbon_rp`,
        SUM(`bayar_bersih_rp`) AS `total_bayar_bersih_rp`
    FROM `pembelian_tbs`
    GROUP BY `tanggal_timbang`
) beli ON p.`tanggal` = beli.`tanggal_timbang`
LEFT JOIN (
    SELECT 
        `tanggal_kirim`,
        SUM(`n_cair_kg`) AS `total_tonase_cair_kg`,
        SUM(`gross_rp`) AS `total_gross_pks_rp`,
        SUM(`pph22_rp`) AS `total_pph22_rp`,
        SUM(`net_cair_rp`) AS `total_net_cair_rp`
    FROM `penjualan_pks`
    GROUP BY `tanggal_kirim`
) jual ON p.`tanggal` = jual.`tanggal_kirim`
LEFT JOIN (
    SELECT 
        `tanggal`,
        SUM(CASE WHEN `kategori` IN ('Biaya Angkut', 'Upah Muat') THEN `kas_keluar_rp` ELSE 0 END) AS `biaya_angkut_rp`,
        SUM(CASE WHEN `kategori` IN ('Solar & Genset', 'Gaji & Operasional', 'Konsumsi & ATK', 'Perawatan Lapak', 'Operasional Lain') THEN `kas_keluar_rp` ELSE 0 END) AS `biaya_operasional_rp`
    FROM `jurnal_kas`
    GROUP BY `tanggal`
) biaya ON p.`tanggal` = biaya.`tanggal`;

-- ------------------------------------------------------------------------------
-- VIEW 3: SALDO BERJALAN DUAL WALLET KAS
-- Memisahkan saldo fisik Kas Laci Lapak dan Rekening Bank PKS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_saldo_dual_wallet` AS
SELECT 
    SUM(`lapak_masuk_rp` - `lapak_keluar_rp`) AS `saldo_kas_laci_lapak_rp`,
    SUM(`bank_masuk_rp` - `bank_keluar_rp`) AS `saldo_kas_bank_pks_rp`,
    SUM((`lapak_masuk_rp` - `lapak_keluar_rp`) + (`bank_masuk_rp` - `bank_keluar_rp`)) AS `total_likuiditas_usaha_rp`
FROM `jurnal_kas`;

-- ==============================================================================
-- 8. DATA AWAL SESUAI DOKUMEN SOP (SEED DATA: 20/11/2026)
-- ==============================================================================

-- Profil Peron
INSERT INTO `settings` (`id`, `peron_name`, `pks_partner`, `dokumen_id`, `alamat`, `telepon`, `default_harga_beli`, `default_harga_do`, `pph_rate`, `target_susut_max`)
VALUES (1, 'POOL TBS KARYA MAJU', 'PT. Sawit Makmur Perkasa', 'SOP-TBS-2026/01', 'Jl. Poros Perkebunan Sawit KM 14, Riau', '0812-7654-3210', 2450.00, 2780.00, 0.0025, 2.50)
ON DUPLICATE KEY UPDATE `peron_name` = VALUES(`peron_name`);

-- Master Petani (Beserta saldo kasbon awal)
INSERT INTO `petani` (`id`, `nama_petani`, `no_telepon`, `lokasi_kebun`, `saldo_kasbon`, `total_pinjaman_history`, `status_aktif`) VALUES
('F-001', 'Pak Budi', '0813-1122-3344', 'Blok A Sawit Rejo', 0.00, 500000.00, 'Aktif'),
('F-002', 'Poktan Jaya', '0821-4455-6677', 'Desa Karya Maju (Kelompok Tani)', 0.00, 0.00, 'Aktif'),
('F-003', 'Pak Syamsul', '0852-9988-7766', 'Simpang Kiri KM 8', 1300000.00, 1500000.00, 'Aktif'),
('F-004', 'Pak Joko', '0812-7711-2233', 'Blok C Perkebunan', 250000.00, 250000.00, 'Aktif')
ON DUPLICATE KEY UPDATE `nama_petani` = VALUES(`nama_petani`);

-- Log Kasbon Awal
INSERT INTO `kasbon_log` (`id`, `tanggal`, `petani_id`, `nama_petani`, `jenis_mutasi`, `jumlah_rp`, `sisa_saldo_kasbon_rp`, `keterangan`) VALUES
('KB-20261110-001', '2026-11-10', 'F-001', 'Pak Budi', 'Pinjaman', 500000.00, 500000.00, 'Kasbon beli pupuk NPK'),
('KB-20261115-001', '2026-11-15', 'F-003', 'Pak Syamsul', 'Pinjaman', 1500000.00, 1500000.00, 'Pinjaman operasional panen & dodos'),
('KB-20261120-001', '2026-11-20', 'F-001', 'Pak Budi', 'Potongan Timbang', 500000.00, 0.00, 'Potong timbang nota TB-20261120-001 (Lunas)'),
('KB-20261120-002', '2026-11-20', 'F-003', 'Pak Syamsul', 'Potongan Timbang', 200000.00, 1300000.00, 'Potong timbang nota TB-20261120-003 (Sisa Rp 1.300.000)')
ON DUPLICATE KEY UPDATE `jumlah_rp` = VALUES(`jumlah_rp`);

-- Data Pembelian TBS Petani (Modul 1 Sesuai Tabel SOP Halaman 1)
-- Pak Budi: 3.450 (Bruto), 1.950 (Tara), 1.500 (Netto), 3% (Pot), 1.455 (N.Bayar), 2.450 (Harga), 3.564.750 (Total), 500.000 (Kasbon)
-- Poktan Jaya: 8.200 (Bruto), 2.400 (Tara), 5.800 (Netto), 2% (Pot), 5.684 (N.Bayar), 2.470 (Harga), 14.039.480 (Total), 0 (Kasbon)
-- Pak Syamsul: 2.980 (Bruto), 1.880 (Tara), 1.100 (Netto), 4% (Pot), 1.056 (N.Bayar), 2.450 (Harga), 2.587.200 (Total), 200.000 (Kasbon)
INSERT INTO `pembelian_tbs` (`id`, `no_nota`, `tanggal_timbang`, `petani_id`, `nama_petani`, `no_kendaraan`, `bruto_kg`, `tara_kg`, `pot_mutu_persen`, `n_bayar_kg`, `harga_beli_per_kg`, `total_nilai_rp`, `pot_kasbon_rp`, `bayar_bersih_rp`, `catatan_mutu`) VALUES
('BUY-20261120-001', 'TB-20261120-001', '2026-11-20', 'F-001', 'Pak Budi', 'BM 9876 AA', 3450.00, 1950.00, 3.00, 1455.00, 2450.00, 3564750.00, 500000.00, 3064750.00, 'TBS Matang 95%, tangkai pendek'),
('BUY-20261120-002', 'TB-20261120-002', '2026-11-20', 'F-002', 'Poktan Jaya', 'BM 8890 CD', 8200.00, 2400.00, 2.00, 5684.00, 2470.00, 14039480.00, 0.00, 14039480.00, 'Kualitas super, buah besar'),
('BUY-20261120-003', 'TB-20261120-003', '2026-11-20', 'F-003', 'Pak Syamsul', 'BM 7721 KL', 2980.00, 1880.00, 4.00, 1056.00, 2450.00, 2587200.00, 200000.00, 2387200.00, 'Ada tangkai panjang sedikit')
ON DUPLICATE KEY UPDATE `total_nilai_rp` = VALUES(`total_nilai_rp`);

-- Data Penjualan & Pengiriman PKS (Modul 2 Sesuai Tabel SOP Halaman 1)
-- PKS-08911: BM 8123 XX, 8.350 (Netto PKS), 2.0% (Refraksi), 8.183 (N.Cair), 2.780 (Harga DO), 22.748.740 (Gross), 56.872 (PPh 22), Status Cair
-- PKS-08945: BK 9044 YZ, 9.120 (Netto PKS), 2.5% (Refraksi), 8.892 (N.Cair), 2.780 (Harga DO), 24.719.760 (Gross), 61.799 (PPh 22), Status Pending
INSERT INTO `penjualan_pks` (`id`, `tanggal_kirim`, `no_tiket_pks`, `no_polisi`, `nama_supir`, `pks_tujuan`, `netto_lapak_kg`, `netto_pks_kg`, `refraksi_persen`, `n_cair_kg`, `harga_do_per_kg`, `gross_rp`, `pph22_persen`, `pph22_rp`, `net_cair_rp`, `status_pembayaran`, `tanggal_cair`, `rekening_bank_tujuan`) VALUES
('SALE-20261120-001', '2026-11-20', 'PKS-08911', 'BM 8123 XX', 'Anto', 'PT. Sawit Makmur Perkasa', 8500.00, 8350.00, 2.00, 8183.00, 2780.00, 22748740.00, 0.0025, 56872.00, 22691868.00, 'Cair', '2026-11-20', 'Bank Rekening PKS'),
('SALE-20261120-002', '2026-11-20', 'PKS-08945', 'BK 9044 YZ', 'Herman', 'PT. Sawit Makmur Perkasa', 9300.00, 9120.00, 2.50, 8892.00, 2780.00, 24719760.00, 0.0025, 61799.00, 24657961.00, 'Pending', NULL, 'Bank Rekening PKS')
ON DUPLICATE KEY UPDATE `gross_rp` = VALUES(`gross_rp`);

-- Data Jurnal Kas & Operasional (Modul 3 Sesuai Tabel SOP Halaman 2)
-- 1. Saldo Awal: 50.000.000 (Kas Lapak & Bank) -> Saldo 50.000.000
-- 2. Pembelian TBS Pak Budi: Keluar 3.064.750 (Kas Laci) -> Saldo 46.935.250
-- 3. Uang Jalan Sopir & Muat Truk BM 8123 XX: Keluar 750.000 (Kas Laci) -> Saldo 46.185.250
-- 4. Pencairan Tiket PKS-08911 (Net PPh 22): Masuk 22.691.868 (Kas Bank) -> Saldo 68.877.118
INSERT INTO `jurnal_kas` (`id`, `tanggal`, `keterangan`, `kategori`, `akun_kas`, `kas_masuk_rp`, `kas_keluar_rp`, `lapak_masuk_rp`, `lapak_keluar_rp`, `bank_masuk_rp`, `bank_keluar_rp`, `ref_modul`, `ref_id`) VALUES
('JRN-20261120-001', '2026-11-20', 'Saldo Awal Kas Lapak & Bank', 'Modal Kerja', 'Kas Lapak & Bank', 50000000.00, 0.00, 25000000.00, 0.00, 25000000.00, 0.00, 'INIT', 'INIT-20261120'),
('JRN-20261120-002', '2026-11-20', 'Pembelian TBS Pak Budi (Nettelah Kasbon)', 'Pembelian TBS', 'Kas Laci Lapak', 0.00, 3064750.00, 0.00, 3064750.00, 0.00, 0.00, 'BUY', 'BUY-20261120-001'),
('JRN-20261120-003', '2026-11-20', 'Uang Jalan Sopir & Muat Truk BM 8123 XX', 'Biaya Angkut', 'Kas Laci Lapak', 0.00, 750000.00, 0.00, 750000.00, 0.00, 0.00, 'EXP', 'EXP-TRUCK-001'),
('JRN-20261120-004', '2026-11-20', 'Pencairan Tiket PKS-08911 (Net PPh 22)', 'Penjualan PKS', 'Kas Bank PKS', 22691868.00, 0.00, 0.00, 0.00, 22691868.00, 0.00, 'SALE', 'SALE-20261120-001')
ON DUPLICATE KEY UPDATE `kas_masuk_rp` = VALUES(`kas_masuk_rp`);

-- ==============================================================================
-- AKHIR DARI FILE DATABASE SQL
-- POOL TBS KARYA MAJU - SISTEM TERPADU SOP-TBS-2026/01
-- ==============================================================================
