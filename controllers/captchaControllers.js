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

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const addNoise = (canvas, ctx) => {
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(${getRandomInt(0, 255)},${getRandomInt(
      0,
      255
    )},${getRandomInt(0, 255)},0.3)`;
    ctx.fillRect(
      getRandomInt(0, canvas.width),
      getRandomInt(0, canvas.height),
      1,
      1
    );
  }
};

module.exports.getCaptchaController = async (req, res, next) => {
  try {
    const captcha = generateCaptcha();
    const canvas = createCanvas(250, 100);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    addNoise(canvas, ctx);

    ctx.font = "30px Arial";
    const textWidth = ctx.measureText(captcha).width;

    const startX = (canvas.width - textWidth) / 2;
    let x = startX;
    const y = canvas.height / 2;

    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";

    for (let i = 0; i < captcha.length; i++) {
      const yOffset = getRandomInt(-10, 10);
      const angle = (Math.PI / 180) * getRandomInt(-10, 10);
      ctx.save();
      ctx.translate(x, y + yOffset);
      ctx.rotate(angle);
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
      x += ctx.measureText(captcha[i]).width + 5;
    }

    req.session.captcha = captcha;
    res.writeHead(200, {
      "Content-Type": "image/png",
    });
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    next(error);
  }
};
