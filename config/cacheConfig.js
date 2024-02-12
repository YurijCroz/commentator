"use strict";
const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 300,
  useClones: true,
  errorOnMissing: false,
});

module.exports = cache;