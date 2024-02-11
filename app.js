"use strict";
const express = require("express");
const cors = require("cors");
const router = require("./router.js");
const handlerError = require("./handlerError");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/public", express.static("./public"));
app.use("/api", router);
app.use(handlerError);

module.exports = app;
