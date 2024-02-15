"use strict";
const { Router } = require("express");
const { getCaptchaController } = require("../controllers/captchaControllers");

const captchaRouter = Router();

captchaRouter.get("/", getCaptchaController);

module.exports = captchaRouter;
