"use strict";
const deleteFile = require("./utils/deleteFile");

const handlerError = async (err, req, res, next) => {
  try {
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    res.status(err.code).send(err);
  } catch (error) {
    console.error(error);
  }
};

module.exports = handlerError;
