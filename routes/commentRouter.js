"use strict";
const { Router } = require("express");
const controllers = require("../controllers/commentControllers");
const validators = require("../middleware/validators");
const validateContentMsg = require("../middleware/checkStringDOM");
const { checkToken } = require("../middleware/checkToken");
const { uploadFile } = require("../utils/fileUpload");
const checkCaptcha = require("../middleware/checkCaptcha");

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
  checkCaptcha,
  validators.validatePostComment,
  validateContentMsg,
  controllers.createComment
);

module.exports = commentRouter;
