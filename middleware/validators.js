"use strict";
const schemes = require("../validationSchemes/schemes");
const BadRequestError = require("../errors/BadRequestError");

module.exports.validateAuthorization = async (req, res, next) => {
  try {
    await schemes.authSchema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    return next(new BadRequestError(error.errors));
  }
};

module.exports.validatePostComment = async (req, res, next) => {
  try {
    await schemes.postComment.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    return next(new BadRequestError(error.errors));
  }
};

module.exports.validateGetComments = async (req, res, next) => {
  try {
    await schemes.getComments.validate(req.query, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    return next(new BadRequestError(error.errors));
  }
};
