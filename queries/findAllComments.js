"use strict";
const { Comment, User, Sequelize } = require("../dbSchema/models");
const ServerError = require("../errors/ServerError");
const UserNotFoundError = require("../errors/UserNotFoundError");
const CONSTANTS = require("../constants");
const { DEFAULT_SORT_BY, DEFAULT_SORT_DIRECT } = CONSTANTS;
const { literal } = Sequelize;

const commentAtt = [
  "commentId",
  "parentCommentId",
  "content",
  "fileName",
  "createdAt",
];

const defaultOrder = { sort: DEFAULT_SORT_BY, sortDirect: DEFAULT_SORT_DIRECT };

const userModel = {
  model: User,
  as: "user",
  attributes: ["userName", "email", "homePage"],
};

module.exports.findAllComments = async (
  parentCommentId,
  options,
  { sort, sortDirect } = defaultOrder
) => {
  const currentOrder =
    sort !== DEFAULT_SORT_BY
      ? [literal(`"user"."${sort}"`), sortDirect]
      : [[sort, sortDirect]];

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
          include: userModel,
        },
      ],
      order: [currentOrder, [literal('"replies"."createdAt"'), "DESC"]],
      subQuery: false,
    });

    if (!parentCommentId && !comments.length) {
      throw new UserNotFoundError("No comments found");
    }

    return comments.map((comment) => comment.get({ plain: true }));
  } catch (error) {
    throw new ServerError(error.message);
  }
};
