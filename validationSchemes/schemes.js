"use strict";
const yup = require("yup");
const regex = require("../regex");

module.exports.authSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .matches(regex.emailRegex, "Invalid email format"),
  password: yup
    .string()
    .required()
    .matches(regex.passwordRegex, "Invalid password format"),
  homePage: yup
    .string()
    .matches(
      /^(http|https):\/\/[^\s\/$.?#].[^\s]*$/i,
      "Invalid homePage format"
    ),
});

module.exports.postComment = yup.object().shape({
  parentCommentId: yup.number(),
  content: yup.string().required().matches(/[^ ]+/i, "Invalid text format"),
});

module.exports.getComments = yup.object().shape({
  limit: yup.number().positive(),
  page: yup.number().min(0),
  sort: yup.string().oneOf(["email", "userName", "createdAt"]),
  sortDirect: yup.string().oneOf(["ASC", "DESC"]),
});
