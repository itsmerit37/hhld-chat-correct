import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// ✅ Mount the auth router here
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to HHLD Chat App!");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("chat msg", (msg) => {
    socket.broadcast.emit("chat msg", msg);

  });
});

const startServer = async () => {
  try {
    await connectToMongoDB();
    server.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
