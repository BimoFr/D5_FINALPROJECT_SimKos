-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
CREATE DATABASE IF NOT EXISTS tekser_simkos;
USE tekser_simkos;

-- TABEL KAMAR
CREATE TABLE kamar (
    id_kamar INT AUTO_INCREMENT PRIMARY KEY,
    nomor_kamar VARCHAR(10) NOT NULL UNIQUE,
    tipe_kamar VARCHAR(50) NOT NULL,
    harga_per_bulan DECIMAL(12, 0) NOT NULL,
    status_kamar ENUM('Kosong', 'Terisi') DEFAULT 'Kosong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABEL PENYEWA
CREATE TABLE penyewa (
    id_penyewa INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    nik VARCHAR(20) UNIQUE NOT NULL,
    nomor_wa VARCHAR(20),
    alamat_asal TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABEL PENYEWAAN
CREATE TABLE penyewaan (
    id_sewa INT AUTO_INCREMENT PRIMARY KEY,
    id_penyewa INT NOT NULL,
    id_kamar INT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    total_bayar DECIMAL(12, 0),
    status_pembayaran ENUM('Lunas', 'Hutang') DEFAULT 'Hutang',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_penyewa) REFERENCES penyewa(id_penyewa) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_kamar) REFERENCES kamar(id_kamar) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- DATA DUMMY

-- Input Data Tabel Kamar 
INSERT INTO kamar (nomor_kamar, tipe_kamar, harga_per_bulan, status_kamar) VALUES 
('101', 'Standard (Kipas)', 800000, 'Terisi'),
('102', 'Standard (Kipas)', 800000, 'Kosong'),
('103', 'Standard (Kipas)', 800000, 'Terisi'),
('104', 'Standard (Kipas)', 800000, 'Kosong'),
('201', 'Deluxe (AC)', 1200000, 'Terisi'),
('202', 'Deluxe (AC)', 1200000, 'Kosong'),
('203', 'Deluxe (AC)', 1200000, 'Terisi'),
('204', 'Deluxe (AC)', 1200000, 'Kosong'),
('301', 'VIP Exclusive', 2000000, 'Terisi'),
('302', 'VIP Exclusive', 2000000, 'Terisi'),
('303', 'VIP Exclusive', 2000000, 'Kosong');

-- Input Data Tabel Penyewa 
INSERT INTO penyewa (nama_lengkap, nik, nomor_wa, alamat_asal) VALUES 
('Budi Santoso', '330111110001', '081234567890', 'Jl. Merdeka No. 1, Semarang'),
('Siti Aminah', '330111110002', '089876543210', 'Jl. Sudirman No. 45, Solo'),
('Rizky Pratama', '330111110003', '085678912345', 'Jl. Malioboro No. 10, Yogyakarta'),
('Andi Saputra', '330111110004', '081299998888', 'Jl. Pahlawan No. 5, Surabaya'),
('Dewi Lestari', '330111110005', '081377776666', 'Jl. Diponegoro No. 12, Bandung'),
('Fajar Nugraha', '330111110006', '082155554444', 'Jl. Thamrin No. 8, Jakarta'),
('Maya Indah', '330111110007', '087833332222', 'Jl. Gatot Subroto No. 3, Malang'),
('Eko Kurniawan', '330111110008', '089611110000', 'Jl. Ahmad Yani No. 9, Tegal');

-- Input Data Tabel Transaksi
INSERT INTO penyewaan (id_penyewa, id_kamar, tanggal_mulai, tanggal_selesai, total_bayar, status_pembayaran) VALUES 
(1, 1, '2026-01-01', '2026-02-01', 800000, 'Lunas'),
(4, 3, '2026-01-05', '2026-02-05', 800000, 'Hutang'),
(2, 5, '2026-01-10', '2026-02-10', 1200000, 'Lunas'),
(5, 7, '2026-01-12', '2026-02-12', 1200000, 'Lunas'),
(3, 9, '2026-01-20', '2026-02-20', 2000000, 'Hutang'),
(6, 10, '2026-01-24', '2026-02-24', 2000000, 'Hutang');