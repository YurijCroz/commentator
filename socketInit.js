"use strict";
const { Server } = require("socket.io");
const NotificationSocket = require("./controllers/sockets/NotificationSocket");

let notificationSocket;

const cors = {
  origin: "*",
};

module.exports.createConnection = (httpServer) => {
  const io = new Server(httpServer, { cors });
  notificationSocket = new NotificationSocket();
  notificationSocket.connect("/notifications", io);
};

module.exports.getNotificationController = () => {
  return notificationSocket;
};
