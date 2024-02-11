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
