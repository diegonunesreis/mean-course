const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();


// DATABASE CONFIGURATIONS

mongoose.connect("mongodb+srv://root:cK7qJzHoAt2hY29H@cluster0.lvf2n.mongodb.net/mean-course?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((reason) => {
    console.log("Connection failed " + reason);
  });


// EXPRESS CONFIGURATIONS

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
