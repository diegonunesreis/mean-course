const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");
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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


// REQUESTS

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: "Post added successfully",
      postId: result._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then((result) => {
      res.status(200).json({
        message: "Post deleted!"
      })
    });
});

module.exports = app;
