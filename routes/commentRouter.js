"use strict";
const { Router } = require("express");
const controllers = require("../controllers/commentControllers");
const { checkToken } = require("../middleware/checkToken");

const commentRouter = Router();

commentRouter.get("/getComments", controllers.getComments);

commentRouter.post("/comment", checkToken, controllers.createComment);

module.exports = commentRouter;
