"use strict";
const yup = require("yup");
const regex = require("../regex");

const email = {
  email: yup
    .string()
    .required()
    .min(5, "Minimum email of characters: 5")
    .max(128, "Maximum email of characters: 128")
    .matches(regex.emailRegex, "Invalid email format"),
};

const password = {
  password: yup
    .string()
    .required()
    .min(8, "Minimum password of characters: 8")
    .max(32, "Maximum password of characters: 32")
    .matches(regex.passwordRegex, "Invalid password format"),
};

module.exports.authSchema = yup.object().shape({
  ...email,
  ...password,
});

module.exports.registrationSchema = yup.object().shape({
  ...email,
  ...password,
  userName: yup
    .string()
    .required()
    .min(2, "Minimum userName of characters: 2")
    .max(64, "Maximum userName of characters: 64")
    .matches(regex.userNameRegex, "Invalid userName format"),
  homePage: yup
    .string()
    .min(10, "Minimum homePage of characters: 10")
    .max(256, "Maximum homePage of characters: 256")
    .matches(regex.homePageRegex, "Invalid homePage format"),
});

module.exports.postComment = yup.object().shape({
  parentCommentId: yup.number(),
  content: yup.string().required().matches(/[^ ]+/i, "Invalid text format"),
  captcha: yup.string().required(),
});

module.exports.getComments = yup.object().shape({
  limit: yup.number().positive().integer(),
  page: yup.number().positive().integer(),
  sort: yup.string().oneOf(["email", "userName", "createdAt"]),
  sortDirect: yup.string().oneOf(["ASC", "DESC"]),
});
