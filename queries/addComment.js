"use strict";
const { Sequelize, Comment } = require("../dbSchema/models");
const ServerError = require("../errors/ServerError");

module.exports.addComment = async (body) => {
  try {
    const comment = await Comment.create({
      ...body,
    });

    return comment;
  } catch (error) {
    throw new ServerError();
  }
};
