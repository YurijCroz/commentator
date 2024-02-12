"use strict";
const { Router } = require("express");
const controllers = require("../controllers/commentControllers");
const validators = require("../middleware/validators");
const { checkToken } = require("../middleware/checkToken");
const { uploadFile } = require("../utils/fileUpload");

const commentRouter = Router();

commentRouter.get(
  "/getComments",
  validators.validateGetComments,
  controllers.getComments
);

commentRouter.post(
  "/comment",
  checkToken,
  uploadFile,
  validators.validatePostComment,
  controllers.createComment
);

module.exports = commentRouter;
