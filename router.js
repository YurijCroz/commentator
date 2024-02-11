"use strict";
const { Router } = require("express");

const router = Router();

const authRouter = require("./routes/authRouter");
router.use("/auth", authRouter);

module.exports = router;
