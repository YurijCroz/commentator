"use strict";
const { User } = require("../dbSchema/models");
const NotFound = require("../errors/UserNotFoundError");

const findUser = async (where) => {
  try {
    const user = await User.findOne({
      where: { ...where },
      attributes: [
        "userId",
        "userName",
        "email",
        "homePage",
        "password",
        "refreshToken",
      ],
    });

    return user ? user.get({ plain: true }) : user;
  } catch (error) {
    throw new NotFound("user with this data didn`t exist");
  }
};

module.exports = findUser;
