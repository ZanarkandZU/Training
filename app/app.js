const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
let users;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "jadwalKegiatan",
  user: "root",
  password: "root"
});

db.connect(err => {
  if (err) console.log("koneksi error di database");

  app.get("/", (req, res) => {
    const sql = "SELECT * FROM kegiatan";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Gagal mendapatkan data dari database:", err);
        return res.status(500).send("Terjadi kesalahan pada server.");
      }
      users = result || [];
      console.log(users);
      res.render("app", { users, title: "Tabel Kegiatan" });
    });
  });

  app.post("/add", (req, res) => {
    const { kegiatan, waktu } = req.body;
    const insertSql = "INSERT INTO kegiatan (kegiatan, waktu) VALUES (?, ?)";
    db.query(insertSql, [kegiatan, waktu], (err, result) => {
      if (err) return console.error("Gagal menyimpan data ke database:");
      res.redirect("/");
    });
  });

  app.post("/delete", (req, res) => {
    const id = req.body.id;
    const deleteSql = "DELETE FROM kegiatan WHERE kegiatan.id = ?";
    db.query(deleteSql, [id], (err, result) => {
      if (err) return console.error("Gagal menghapus data dari database:", err);
      res.redirect("/");
    });
  });

  app.post("/remove", (req, res) => {
    for (let i = 0; i < users.length; i++) {
      const deleteQuery = `DELETE FROM kegiatan WHERE kegiatan.id = ${users[i].id}`;

      db.query(deleteQuery, (err, result) => {
        if (err) return console.error("Error deleting data:", err);
      });
    }
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}...`));
