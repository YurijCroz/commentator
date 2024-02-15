"use strict";
const express = require("express");
const cors = require("cors");
const router = require("./router.js");
const handlerError = require("./handlerError");
const session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/public", express.static("./public"));
app.use("/api", router);
app.use(handlerError);

module.exports = app;
