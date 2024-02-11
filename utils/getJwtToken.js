"use strict";
const jwt = require("jsonwebtoken");

const getJwtToken = (userData, secret, expiresIn) => {
  const token = jwt.sign(
    {
      userId: userData.userId,
      userName: userData.userName,
      email: userData.email,
      homePage: userData.homePage,
    },
    secret,
    { expiresIn }
  );
  return token;
};

module.exports = getJwtToken;
