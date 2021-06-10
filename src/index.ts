import express from "express";
import * as path from "path";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

const app = express();
const port = 8080; // default port to listen

const httpServer = createServer(app);
// set up socket.io and bind it to our
// http server.
const io = new Server(httpServer, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

// define a route handler for the default home page
app.get("/", (req: any, res: any) => {
  res.sendFile(__dirname + "/views/client.html");
});

// on user connection bind message event to emit messages to all user including sender
io.on("connection", (socket: Socket) => {
  socket.on("message", (message: any) => {
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// start the server
httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:${port}`);
});
