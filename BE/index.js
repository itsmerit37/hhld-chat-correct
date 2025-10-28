import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

// dotenv library loads environment variables from .env file into process.env

dotenv.config();
const PORT = process.env.PORT || 8080;
// use the port specified in the environment variable PORT, or default to port 5000
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

// Track online users
const onlineUsers = new Set();

// Helper function to broadcast online users
const broadcastOnlineUsers = () => {
  io.emit("users online", Array.from(onlineUsers));
};

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  console.log(`Client connected - Username: ${username || "Anonymous"}`);

  // Store username in socket object and add to online users
  socket.username = username;
  if (username) {
    onlineUsers.add(username);
    broadcastOnlineUsers();
  }

  socket.on("chat msg", (msg) => {
    console.log("Message received:", {
      ...msg,
      from: socket.username,
    });

    // Broadcast the message with sender information
    socket.broadcast.emit("chat msg", {
      ...msg,
      sender: socket.username || "Anonymous",
    });
  });

  socket.on("disconnect", () => {
    console.log(
      `Client disconnected - Username: ${socket.username || "Anonymous"}`
    );
    if (socket.username) {
      onlineUsers.delete(socket.username);
      broadcastOnlineUsers();
    }
  });
});

// When a client connects to the Socket.IO server, a unique socket object is created to represent that client's connection. This socket object allows bidirectional communication between the server and the specific client that it represents.

app.get("/", (req, res) => {
  res.send("Welcome to HHLD Chat App!");
});

server.listen(PORT, (req, res) => {
  console.log(`Server is running at ${PORT}`);
});
