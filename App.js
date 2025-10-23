const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());


const filePath = path.join(__dirname, 'public_html', 'test.html');


app.get("/", (req, res) => {
  res.sendFile(filePath);
});

exports.app = app;