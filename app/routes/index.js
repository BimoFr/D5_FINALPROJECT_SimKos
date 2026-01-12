// TODO: Definisikan semua jalur (Route) aplikasi kalian disini (GET, POST, PUT, DELETE)
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ==========================================
// 1. DASHBOARD (Halaman Utama)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const [kamar] = await db.query('SELECT * FROM kamar');
        const [penyewa] = await db.query('SELECT * FROM penyewa');
        
        const [sewa] = await db.query(`
            SELECT p.*, py.nama_lengkap, k.nomor_kamar 
            FROM penyewaan p
            JOIN penyewa py ON p.id_penyewa = py.id_penyewa
            JOIN kamar k ON p.id_kamar = k.id_kamar
            ORDER BY p.id_sewa DESC LIMIT 10
        `);
        
        res.render('index', { 
            kamar, penyewa, sewa, 
            page: 'Dashboard' 
        });
    } catch (err) {
        console.error(err);
        res.send("Terjadi Kesalahan Database");
    }
});

// ==========================================
// 2. MANAJEMEN KAMAR (CRUD LENGKAP)
// ==========================================

// List Kamar
router.get('/kamar', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM kamar ORDER BY nomor_kamar ASC');
    res.render('kamar/index', { data: rows, page: 'Manajemen Kamar' });
});

// Form Tambah Kamar
router.get('/kamar/add', (req, res) => {
    res.render('kamar/add', { page: 'Manajemen Kamar' });
});

// Proses Simpan Kamar
router.post('/kamar/add', async (req, res) => {
    const { nomor, tipe, harga } = req.body;
    try {
        await db.query('INSERT INTO kamar (nomor_kamar, tipe_kamar, harga_per_bulan, status_kamar) VALUES (?, ?, ?, ?)', 
            [nomor, tipe, harga, 'Kosong']);
        res.redirect('/kamar?status=success&message=Kamar berhasil ditambahkan');
    } catch (err) {
        res.redirect('/kamar?status=error&message=Gagal menyimpan, nomor mungkin duplikat');
    }
});

// Form Edit Kamar
router.get('/kamar/edit/:id', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM kamar WHERE id_kamar = ?', [req.params.id]);
    if (rows.length > 0) {
        res.render('kamar/edit', { data: rows[0], page: 'Manajemen Kamar' });
    } else {
        res.redirect('/kamar');
    }
});

// Proses Update Kamar
router.post('/kamar/update/:id', async (req, res) => {
    const { nomor, tipe, harga, status } = req.body;
    try {
        await db.query('UPDATE kamar SET nomor_kamar=?, tipe_kamar=?, harga_per_bulan=?, status_kamar=? WHERE id_kamar=?', 
            [nomor, tipe, harga, status, req.params.id]);
        res.redirect('/kamar?status=success&message=Data kamar diperbarui');
    } catch (err) {
        res.redirect('/kamar?status=error&message=Gagal update data');
    }
});

// Hapus Kamar
router.get('/kamar/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM kamar WHERE id_kamar = ?', [req.params.id]);
        res.redirect('/kamar?status=success&message=Kamar berhasil dihapus');
    } catch (error) {
        res.redirect('/kamar?status=error&message=Gagal menghapus, data terkait transaksi');
    }
});

// ==========================================
// 3. MANAJEMEN PENYEWA (CRUD LENGKAP)
// ==========================================

// List Penyewa
router.get('/penyewa', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM penyewa ORDER BY id_penyewa DESC');
    res.render('penyewa/index', { data: rows, page: 'Manajemen Penghuni' });
});

// Form Tambah Penyewa
router.get('/penyewa/add', (req, res) => {
    res.render('penyewa/add', { page: 'Manajemen Penghuni' });
});

// Proses Simpan Penyewa
router.post('/penyewa/add', async (req, res) => {
    const { nama, nik, wa, alamat } = req.body;
    try {
        await db.query('INSERT INTO penyewa (nama_lengkap, nik, nomor_wa, alamat_asal) VALUES (?, ?, ?, ?)', 
            [nama, nik, wa, alamat]);
        res.redirect('/penyewa?status=success&message=Penyewa berhasil ditambahkan');
    } catch (err) {
        res.redirect('/penyewa?status=error&message=NIK mungkin sudah ada');
    }
});

// Form Edit Penyewa
router.get('/penyewa/edit/:id', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM penyewa WHERE id_penyewa = ?', [req.params.id]);
    if (rows.length > 0) {
        res.render('penyewa/edit', { data: rows[0], page: 'Manajemen Penghuni' });
    } else {
        res.redirect('/penyewa');
    }
});

// Proses Update Penyewa
router.post('/penyewa/update/:id', async (req, res) => {
    const { nama, nik, wa, alamat } = req.body;
    try {
        await db.query('UPDATE penyewa SET nama_lengkap=?, nik=?, nomor_wa=?, alamat_asal=? WHERE id_penyewa=?', 
            [nama, nik, wa, alamat, req.params.id]);
        res.redirect('/penyewa?status=success&message=Data penyewa diperbarui');
    } catch (err) {
        res.redirect('/penyewa?status=error');
    }
});

// Hapus Penyewa
router.get('/penyewa/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM penyewa WHERE id_penyewa = ?', [req.params.id]);
        res.redirect('/penyewa?status=success&message=Penyewa berhasil dihapus');
    } catch (error) {
        res.redirect('/penyewa?status=error');
    }
});

// ==========================================
// 4. TRANSAKSI (PENYEWAAN) - LENGKAP
// ==========================================

// List Transaksi
router.get('/penyewaan', async (req, res) => {
    const [rows] = await db.query(`
        SELECT p.*, py.nama_lengkap, k.nomor_kamar 
        FROM penyewaan p
        JOIN penyewa py ON p.id_penyewa = py.id_penyewa
        JOIN kamar k ON p.id_kamar = k.id_kamar
        ORDER BY p.id_sewa DESC
    `);
    res.render('penyewaan/index', { data: rows, page: 'Manajemen Transaksi' });
});

// Form Tambah Transaksi
router.get('/penyewaan/add', async (req, res) => {
    const [kamar] = await db.query("SELECT * FROM kamar WHERE status_kamar = 'Kosong'");
    const [penyewa] = await db.query("SELECT * FROM penyewa");
    res.render('penyewaan/add', { kamar, penyewa, page: 'Manajemen Transaksi' });
});

// Proses Simpan Transaksi
router.post('/penyewaan/add', async (req, res) => {
    const { id_penyewa, id_kamar, tgl_mulai, tgl_selesai, total, status } = req.body;
    try {
        await db.query(`INSERT INTO penyewaan (id_penyewa, id_kamar, tanggal_mulai, tanggal_selesai, total_bayar, status_pembayaran) 
                        VALUES (?, ?, ?, ?, ?, ?)`, 
                        [id_penyewa, id_kamar, tgl_mulai, tgl_selesai, total, status]);
        
        await db.query("UPDATE kamar SET status_kamar = 'Terisi' WHERE id_kamar = ?", [id_kamar]);
        res.redirect('/penyewaan?status=success&message=Transaksi berhasil disimpan');
    } catch (err) {
        console.error(err);
        res.redirect('/penyewaan?status=error');
    }
});

// Fitur: Pelunasan Cepat
router.get('/penyewaan/lunas/:id', async (req, res) => {
    await db.query("UPDATE penyewaan SET status_pembayaran = 'Lunas' WHERE id_sewa = ?", [req.params.id]);
    res.redirect('/penyewaan?status=success&message=Pembayaran dilunasi');
});

// Fitur: Edit Transaksi
router.get('/penyewaan/edit/:id', async (req, res) => {
    const [rows] = await db.query(`
        SELECT p.*, py.nama_lengkap, k.nomor_kamar 
        FROM penyewaan p
        JOIN penyewa py ON p.id_penyewa = py.id_penyewa
        JOIN kamar k ON p.id_kamar = k.id_kamar
        WHERE p.id_sewa = ?
    `, [req.params.id]);

    if (rows.length > 0) {
        const data = rows[0];
        data.tgl_mulai_fmt = data.tanggal_mulai ? data.tanggal_mulai.toISOString().split('T')[0] : '';
        data.tgl_selesai_fmt = data.tanggal_selesai ? data.tanggal_selesai.toISOString().split('T')[0] : '';
        
        res.render('penyewaan/edit', { data, page: 'Manajemen Transaksi' });
    } else {
        res.redirect('/penyewaan');
    }
});

// Proses Update Transaksi
router.post('/penyewaan/update/:id', async (req, res) => {
    const { tgl_mulai, tgl_selesai, total, status } = req.body;
    try {
        await db.query(`
            UPDATE penyewaan 
            SET tanggal_mulai=?, tanggal_selesai=?, total_bayar=?, status_pembayaran=? 
            WHERE id_sewa=?`, 
            [tgl_mulai, tgl_selesai, total, status, req.params.id]);
        res.redirect('/penyewaan?status=success&message=Transaksi diperbarui');
    } catch (error) {
        res.redirect('/penyewaan?status=error');
    }
});

module.exports = router;