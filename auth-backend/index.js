import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
console.log("Environment variables loaded:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "[HIDDEN]" : undefined,
  JWT_SECRET: process.env.JWT_SECRET ? "[HIDDEN]" : undefined,
});
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("chat msg", (msg) => {
    console.log("Received msg " + msg);

    io.emit("chat msg", msg);
  });
});

app.use(express.json()); // It parses the incoming request body, if any, and populates the req.body property with the parsed JSON data. This allows you to easily access the JSON data sent by clients in HTTP requests.

app.use("/auth", authRouter); // any requests whose path starts with /auth will be routed to the authRouter middleware for further processing

app.get("/", (req, res) => {
  res.send("Welcome to HHLD Chat App!");
});

const startServer = async () => {
  try {
    await connectToMongoDB();
    server.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please try these solutions:`
        );
        console.error(
          "1. Stop any other server instances that might be running"
        );
        console.error(
          "2. Choose a different port by setting PORT in your .env file"
        );
        console.error("3. Wait a few seconds and try again");
      } else {
        console.error("Server error:", error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
