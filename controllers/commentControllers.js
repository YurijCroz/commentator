"use strict";
const { findAllComments } = require("../queries/findAllComments");
const { addComment } = require("../queries/addComment");
const ServerError = require("../errors/ServerError");

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
    throw new ServerError();
  }
};

module.exports.getComments = async (req, res, next) => {
  try {
    const sort = "createdAt";
    const sortDirect = "DESC";
    const options = {
      limit: 25,
      offset: 0,
      order: [[sort, sortDirect]],
    };

    const comments = await findAllComments(null, options);

    for (const comment of comments) {
      if (comment.replies.length) {
        for (const reply of comment.replies) {
          reply.replies = await recursiveGetComments(reply);
        }
      }
    }

    res.status(200).send(comments);
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

    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
};
