"use strict";
const { sequelize } = require("../dbSchema/models");
const { findAllComments } = require("../queries/findAllComments");
const { addComment } = require("../queries/addComment");
const ServerError = require("../errors/ServerError");
const cache = require("../config/cacheConfig");
const CONSTANTS = require("../constants");
const { COMMENTS_AND_TOTAL_PAGE_CACHE, DEFAULT_SORT_BY, DEFAULT_SORT_DIRECT } =
  CONSTANTS;

const recursiveGetComments = async (reply) => {
  try {
    const nextReplies = await findAllComments(reply.commentId);

    for (const nextReply of nextReplies) {
      if (nextReply.replies.length) {
        for (const reply of nextReply.replies) {
          reply.replies = await recursiveGetComments(reply);
        }
      }
    }

    return nextReplies;
  } catch (error) {
    throw error.name && error.message && error.code
      ? error
      : new ServerError(error);
  }
};

const getCommentsAndTotalPage = async ({ order, ...options }) => {
  try {
    const comments = await findAllComments(null, options, order);

    for (const comment of comments) {
      if (comment.replies.length) {
        for (const reply of comment.replies) {
          reply.replies = await recursiveGetComments(reply);
        }
      }
    }

    const [totalCountQuery] = await sequelize.query(
      'SELECT COUNT(*) AS total_count FROM "Comments" WHERE "parentCommentId" IS NULL;',
      { type: sequelize.QueryTypes.SELECT }
    );
    const count = +totalCountQuery.total_count;

    const totalPages = Math.ceil(count / options.limit);

    return [totalPages, comments];
  } catch (error) {
    throw error.name && error.message && error.code
      ? error
      : new ServerError(error);
  }
};

module.exports.getComments = async (req, res, next) => {
  try {
    const sort = req.query.sort || DEFAULT_SORT_BY;
    const sortDirect = req.query.sortDirect || DEFAULT_SORT_DIRECT;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 25;
    const options = {
      limit,
      offset: (page - 1) * limit,
      order: { sort, sortDirect },
    };

    const isDefaultParams =
      sort === DEFAULT_SORT_BY &&
      sortDirect === DEFAULT_SORT_DIRECT &&
      page === 1 &&
      limit === 25;

    const cacheSendData = cache.get(COMMENTS_AND_TOTAL_PAGE_CACHE);

    if (isDefaultParams && cacheSendData) {
      res.status(200).send(cacheSendData);
    } else {
      const [totalPages, comments] = await getCommentsAndTotalPage(options);

      if (isDefaultParams) {
        cache.set(COMMENTS_AND_TOTAL_PAGE_CACHE, {
          totalPages,
          comments,
        });
      }

      res.status(200).send({ totalPages, comments });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.createComment = async (req, res, next) => {
  try {
    const file = req.file ? { fileName: req.file.filename } : {};
    const body = {
      parentCommentId: req.body.parentCommentId
        ? req.body.parentCommentId
        : null,
      content: req.body.content,
      userId: req.tokenData.userId,
      ...file,
    };

    const comment = await addComment(body);

    if (comment) {
      const options = {
        limit: 25,
        offset: 0,
        order: { sort: DEFAULT_SORT_BY, sortDirect: DEFAULT_SORT_DIRECT },
      };
      const [totalPages, comments] = await getCommentsAndTotalPage(options);
      cache.set(COMMENTS_AND_TOTAL_PAGE_CACHE, {
        totalPages,
        comments,
      });
    }

    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
};
