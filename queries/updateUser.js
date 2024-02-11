"use strict";
const { User } = require("../dbSchema/models");
const ServerError = require("../errors/ServerError");

const updateUser = async (data, userId) => {
  const [updatedCount, [updatedUser]] = await User.update(data, {
    where: { userId },
    returning: true,
  });
  if (updatedCount < 1) {
    throw new ServerError("cannot update user");
  }
  return updatedUser.dataValues;
};

module.exports = updateUser;
