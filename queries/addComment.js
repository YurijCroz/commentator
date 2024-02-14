"use strict";
const { Comment } = require("../dbSchema/models");
const ServerError = require("../errors/ServerError");

module.exports.addComment = async (body) => {
  try {
    const comment = await Comment.create({
      ...body,
    });

    return comment.get({ plain: true });
  } catch (error) {
    throw new ServerError();
  }
};
