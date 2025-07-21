const express = require('express');
const env = require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const PORT =process.env.PORT
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('📩 Message received:', msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
