"use strict";
const { Router } = require("express");
const controllers = require("../controllers/authControllers");
const validators = require("../middleware/validators");
const checkToken = require("../middleware/checkToken");

const authRouter = Router();

authRouter.post(
  "/registration",
  validators.validateRegistration,
  controllers.registrationUser
);

authRouter.post("/login", validators.validateAuthorization, controllers.login);

authRouter.post(
  "/refresh",
  checkToken.checkRefreshToken,
  controllers.refreshToken
);

module.exports = authRouter;
