"use strict";
const { JSDOM } = require("jsdom");
const BadRequestError = require("../errors/BadRequestError");

const allowedTags = ["a", "code", "i", "strong"];

const sanitizeHTML = (input) => {
  const dom = new JSDOM(input);
  const document = dom.window.document;

  const elements = document.body.getElementsByTagName("*");

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      element.parentNode.removeChild(element);
    }
  }

  return document.body.innerHTML;
};

const validateContentMsg = async ({ body }, res, next) => {
  try {
    body.content = body.content.trim();
    const sanitizedContent = sanitizeHTML(body.content);

    if (body.content.length !== sanitizedContent.length) {
      return next(new BadRequestError("Text contains prohibited characters"));
    }
    body.content = sanitizedContent;

    next();
  } catch (error) {
    return next(new BadRequestError(error));
  }
};

module.exports = validateContentMsg;
