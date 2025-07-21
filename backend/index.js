const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registerSocketHandlers = require('./registerSocketHandlers');
require("dotenv").config()
const app = express();
const server = http.createServer(app);

app.use(cors());
const PORT=process.env.PORT

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  registerSocketHandlers(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
