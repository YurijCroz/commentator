"use strict";
const WebSocket = require("./WebSocket");

class NotificationSocket extends WebSocket {
  anotherSubscribes(socket) {
    this.onSubscribe(socket);
    this.onUnsubscribe(socket);
  }

  emitNewComment(target, msg) {
    this.io.to(target).emit("comment", { ...msg });
  }

  onSubscribe(socket) {
    socket.on("subscribe", (id) => {
      socket.join(id);
    });
  }

  onUnsubscribe(socket) {
    socket.on("unsubscribe", (id) => {
      socket.leave(id);
    });
  }
}

module.exports = NotificationSocket;
