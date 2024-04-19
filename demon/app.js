const ejs = require("ejs");
const https = require("https");
const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
const url = "https://api.quotable.io/random";


app.get("/", (req, res) => {
  https
    .get(url, requesURL => {
      let result = "";
      requesURL.on("data", datas => (result += datas));
      requesURL.on("end", () => {
        let respon = JSON.parse(result);
        console.log(respon);
        res.render("index", {
          motivasi: respon.content,
          date: respon.dateAdded,
          dates: respon.dateModified,
          author: respon.author
        });
      });
    })
    .on("error", err => console.log("Server API " + err));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server Ready in PORT: ${PORT}...`));
