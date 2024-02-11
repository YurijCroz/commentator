"use strict";

const handlerError = async (err, req, res, next) => {
  try {
    res.status(err.code).send(err);
  } catch (error) {
    console.error(error);
  }
};

module.exports = handlerError;
