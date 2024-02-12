"use strict";
const { Comment, User } = require("../dbSchema/models");
const ServerError = require("../errors/ServerError");
const UserNotFoundError = require("../errors/UserNotFoundError");

const commentAtt = [
  "commentId",
  "parentCommentId",
  "content",
  "fileName",
  "createdAt",
];

const order = [["createdAt", "DESC"]];

const userModel = {
  model: User,
  as: "user",
  attributes: ["userId", "userName", "email", "homePage"],
};

module.exports.findAllComments = async (
  parentCommentId,
  options = { order }
) => {
  try {
    const comments = await Comment.findAll({
      attributes: commentAtt,
      where: { parentCommentId },
      ...options,
      include: [
        { ...userModel },
        {
          model: Comment,
          as: "replies",
          attributes: commentAtt,
          required: false,
          order,
          include: userModel,
        },
      ],
    });

    if (!parentCommentId && !comments.length) {
      throw new UserNotFoundError("No comments found");
    }

    return comments.map((comment) => comment.get({ plain: true }));
  } catch (error) {
    throw new ServerError(error.message);
  }
};
