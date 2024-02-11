"use strict";
const { Router } = require("express");
const controllers = require("../controllers/commentControllers");
const validators = require("../middleware/validators");
const { checkToken } = require("../middleware/checkToken");

const commentRouter = Router();

commentRouter.get("/getComments", controllers.getComments);

commentRouter.post(
  "/comment",
  checkToken,
  validators.validatePostComment,
  controllers.createComment
);

module.exports = commentRouter;
