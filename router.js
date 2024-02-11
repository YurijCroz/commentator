"use strict";
const { Router } = require("express");

const router = Router();

const authRouter = require("./routes/authRouter");
router.use("/auth", authRouter);

const commentRouter = require("./routes/commentRouter");
router.use("/comments", commentRouter);

module.exports = router;
