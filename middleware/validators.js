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
