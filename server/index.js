const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var port = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("new_join", data);
    socket.username = data.username;
    socket.room = data.room;
    console.log(`User : ${data.username} joined room - ${data.room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    socket.to(socket.room).emit("new_left", { left: socket.username });
    console.log("User disconnected", socket.username);
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
