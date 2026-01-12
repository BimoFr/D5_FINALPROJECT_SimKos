// TODO: Ini adalah titik masuk aplikasi SIMKOS
const path = require("path");

// 1. Point dotenv to the correct location
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const bodyParser = require("body-parser");
// Import konfigurasi database kamu yang "bersih" tadi
const db = require("./config/database"); 
const mainRoutes = require("./routes/index");

const app = express();
const PORT = process.env.APP_PORT || 2584; // Port 2584 (Sesuai Dockerfile)

// --- MIDDLEWARE ---
app.set("views", path.join(__dirname, "view")); 
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.urlencoded({ extended: true }));

// --- USE ROUTES ---
app.use("/", mainRoutes);

// --- START SERVER DENGAN PENGECEKAN DATABASE (ANTI CRASH) ---
async function startApp() {
  console.log("⏳ Menunggu Database siap...");

  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      // Coba "ping" database sebentar
      const connection = await db.getConnection();
      console.log("✅ Database Connected! (SIMKOS Ready)");
      connection.release(); // Lepas koneksi tes
      
      // HANYA JALANKAN SERVER JIKA DATABASE SUDAH OKE
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
      return; // Keluar dari fungsi, sukses!

    } catch (err) {
      attempts++;
      console.error(`⚠️ Database belum siap (Percobaan ${attempts}/${maxAttempts})...`);
      // Tunggu 3 detik sebelum coba lagi
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Jika sampai sini berarti gagal total
  console.error("❌ Gagal koneksi database setelah 30 detik. Matikan container.");
  process.exit(1);
}

// Jalankan fungsi start
startApp();