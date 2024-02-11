"use strict";
const jwt = require("jsonwebtoken");
const TokenError = require("../errors/TokenError");

const { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } = process.env;

module.exports.checkToken = async (req, res, next) => {
  try {
    const [bearer, accessToken] = req.headers.authorization.split(" ");
    if (!accessToken) {
      return next(new TokenError("need token"));
    }
    req.tokenData = jwt.verify(accessToken, JWT_SECRET_ACCESS);
    next();
  } catch (error) {
    next(new TokenError());
  }
};

module.exports.checkRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return next(new TokenError("need refresh token"));
    }
    req.refreshTokenData = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
    next();
  } catch (error) {
    next(new TokenError());
  }
};
