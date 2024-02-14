"use strict";
require("dotenv").config();
const app = require("./app.js");
const controller = require("./socketInit");

const PORT = process.env.API_PORT;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

controller.createConnection(server);
