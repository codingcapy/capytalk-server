import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("message", (body) => {
    console.log(body);
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(6),
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
