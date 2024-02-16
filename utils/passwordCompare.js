"use strict";
const UserNotFoundError = require("../errors/UserNotFoundError");
const bcrypt = require("bcrypt");

const passwordCompare = async (pass1, pass2) => {
  try {
    const passwordCompare = await bcrypt.compare(pass1, pass2);
    if (!passwordCompare) {
      throw new UserNotFoundError("Invalid email or password");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = passwordCompare;
