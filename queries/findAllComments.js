"use strict";
const { Comment, User, Sequelize } = require("../dbSchema/models");
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

const repliesModel = {
  model: Comment,
  as: "replies",
  attributes: commentAtt,
  required: false,
  include: userModel,
};

module.exports.findAllComments = async (
  parentCommentId,
  options,
  { sort, sortDirect } = defaultOrder
) => {
  const currentOrder =
    sort !== DEFAULT_SORT_BY
      ? [literal(`"user"."${sort}"`), sortDirect]
      : [sort, sortDirect];

  const include = parentCommentId
    ? [{ ...userModel }, { ...repliesModel }]
    : [{ ...userModel }];

  const order = parentCommentId
    ? [currentOrder, [literal('"replies"."createdAt"'), "DESC"]]
    : [currentOrder];

  try {
    const comments = await Comment.findAll({
      attributes: commentAtt,
      where: { parentCommentId },
      ...options,
      include,
      order,
      subQuery: false,
    });

    if (!parentCommentId && !comments.length) {
      throw new UserNotFoundError("No comments found");
    }

    return comments.map((comment) => comment.get({ plain: true }));
  } catch (error) {
    throw error;
  }
};
