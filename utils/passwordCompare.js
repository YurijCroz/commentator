"use strict";
const NotFound = require("../errors/UserNotFoundError");
const bcrypt = require("bcrypt");

const passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if (!passwordCompare) {
    throw new NotFound("Wrong password");
  }
};

module.exports = passwordCompare;
