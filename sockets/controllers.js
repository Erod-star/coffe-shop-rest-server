const { Socket } = require("socket.io");
const { confirmJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

// Remove new Socket() in prod!!!
const socketController = async (socket = new Socket(), io) => {
  const user = await confirmJWT(socket.handshake.headers["x-token"]);

  if (!user) return socket.disconnect();

  // ? Add connected user
  chatMessages.connectUser(user);
  io.emit("active-users", chatMessages.usersArr);
  socket.emit("retrive-messages", chatMessages.lastMessages);

  // ? Private chat room
  socket.join(user.id);

  // ? Socket listeners
  // Clean on user disconnection
  socket.on("disconnect", () => {
    console.log(`Disconnecting user ${user.name}`);
    chatMessages.disconnectUser(user.id);
    io.emit("active-users", chatMessages.usersArr);
  });

  socket.on("send-message", ({ uid, message }) => {
    if (uid) {
      socket
        .to(uid)
        .emit("retrive-private-message", { from: user.name, message });
    } else {
      chatMessages.sendMessage(user.id, user.name, message);
      io.emit("retrive-messages", chatMessages.lastMessages);
    }
  });
};

module.exports = {
  socketController,
};
