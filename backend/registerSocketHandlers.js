const activeUsers = new Map();

module.exports = (socket, io) => {
  console.log("User connected:", socket.id);

  socket.on("register_user", (userId) => {
    activeUsers.set(socket.id, userId);
    socket.emit("registered", `Registered as ${userId}`);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("room_joined", `${socket.id} joined the room`);
  });

  socket.on("send_room_message", ({ message, room }) => {
    const payload = { user: socket.id, message };
    socket.to(room).emit("receive_message", payload);
    socket.emit("message_ack", "Group message sent");
  });

  socket.on("private_message", ({ toSocketId, message }) => {
    const payload = {
      from: socket.id,
      message,
    };

    io.to(toSocketId).emit("receive_private_message", payload);
    socket.emit("message_ack", "Private message sent");
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
};
