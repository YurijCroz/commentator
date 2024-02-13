"use strict";
const BadRequestError = require("../errors/BadRequestError");

const validateCaptcha = ({ session, body }, res, next) => {
  try {
    const { captcha } = body;

    if (session && session.captcha && captcha === session.captcha) {
      session.captcha = null;
      return next();
    }

    session.captcha = null;
    return next(new BadRequestError("Invalid CAPTCHA"));
  } catch (error) {
    next(error);
  }
};

module.exports = validateCaptcha;
