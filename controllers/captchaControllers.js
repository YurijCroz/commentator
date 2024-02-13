"use strict";
const randomstring = require("randomstring");
const { createCanvas } = require("canvas");

const lengthCaptcha = +process.env.LENGTH_CAPTCHA || 3;

const generateCaptcha = () => {
  return randomstring.generate({
    length: lengthCaptcha,
    charset: "alphanumeric",
  });
};

module.exports.getCaptchaController = async (req, res, next) => {
  try {
    const captcha = generateCaptcha();
    const canvas = createCanvas(200, 50);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText(captcha, 10, 40);

    req.session.captcha = captcha;
    res.writeHead(200, {
      "Content-Type": "image/png",
    });
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    next(error);
  }
};
