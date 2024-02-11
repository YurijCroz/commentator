"use strict";

require("dotenv").config();
const app = require("./app.js");

const PORT = process.env.API_PORT;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;
