// TODO: Ini adalah titik masuk aplikasi, setup Express, Middleware, dan Server Listener disini
// 1. Add the 'path' module to handle file paths reliably
const path = require("path");

// 2. Point dotenv to the correct location (likely one folder up)
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const bodyParser = require("body-parser");
const mainRoutes = require("./routes/index");

const app = express();
const PORT = process.env.APP_PORT || 2584;

// --- MIDDLEWARE ---
// 3. Explicitly tell Express where the 'views' folder is
app.set("views", path.join(__dirname, "view")); 
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.urlencoded({ extended: true }));

// --- USE ROUTES ---
app.use("/", mainRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});