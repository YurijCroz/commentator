"use strict";
const { User } = require("../dbSchema/models");
const bcrypt = require("bcrypt");
const findUser = require("../queries/findUser");
const passwordCompare = require("../utils/passwordCompare");
const getJwtToken = require("../utils/getJwtToken");
const updateUser = require("../queries/updateUser");
const NotUniqueEmail = require("../errors/NotUniqueEmail");
const TokenError = require("../errors/TokenError");
const ServerError = require("../errors/ServerError");

const {
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_TIME,
  SALT_ROUNDS,
} = process.env;

module.exports.registrationUser = async (req, res, next) => {
  try {
    const foundUser = await findUser({ email: req.body.email });
    if (foundUser) {
      next(new NotUniqueEmail());
    }
    const body = {
      userName: req.body.userName,
      email: req.body.email,
      homePage: req.body.homePage,
      password: bcrypt.hashSync(req.body.password, +SALT_ROUNDS),
    };
    const newUser = await User.create({
      ...body,
    });
    if (!newUser) {
      next(new ServerError());
    }
    res.status(200).send({ massage: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await findUser({ email: req.body.email });
    await passwordCompare(req.body.password, foundUser.password);
    const accessToken = getJwtToken(
      foundUser,
      JWT_SECRET_ACCESS,
      +ACCESS_TOKEN_TIME
    );
    const refreshToken = getJwtToken(
      foundUser,
      JWT_SECRET_REFRESH,
      REFRESH_TOKEN_TIME
    );
    await updateUser({ refreshToken }, foundUser.userId);
    res.send({
      tokensPair: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.refreshToken = async (req, res, next) => {
  try {
    const foundUser = await findUser({ userId: req.refreshTokenData.userId });
    if (foundUser.refreshToken === req.body.refreshToken) {
      const accessToken = getJwtToken(
        foundUser,
        JWT_SECRET_ACCESS,
        +ACCESS_TOKEN_TIME
      );
      const refreshToken = getJwtToken(
        foundUser,
        JWT_SECRET_REFRESH,
        REFRESH_TOKEN_TIME
      );
      await updateUser({ refreshToken }, foundUser.userId);
      res.send({
        tokensPair: { accessToken, refreshToken },
      });
    } else {
      next(new TokenError());
    }
  } catch (error) {
    next(error);
  }
};
