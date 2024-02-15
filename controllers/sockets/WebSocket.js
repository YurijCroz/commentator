"use strict";

class WebSocket {
  connect(namespace, io) {
    this.io = io.of(namespace);
    this.listen();
  }

  listen() {
    this.io.on("connection", (socket) => {
      this.anotherSubscribes(socket);
    });
  }
}

module.exports = WebSocket;
