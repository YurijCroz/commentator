"use strict";
const sharp = require("sharp");

module.exports.imageConversionToWebp = (inputFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    sharp(inputFilePath)
      .resize({ width: 320, height: 240, fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outputFilePath, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
  });
};

