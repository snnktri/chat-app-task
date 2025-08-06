import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5160",
    methods: ["GET", "POST"],
  },
});

interface AuthPayload {
  userId?: string;
}

type UserMap = {
  [userId: string]: string;
};

const users: UserMap = {};

export const getReceiverId = (receiverId: string) => {
  console.log(`Looking up socket ID for receiver: ${receiverId}`);
  const socketId = users[receiverId];
  if (!socketId) {
    console.warn(`No socket ID found for receiver ${receiverId}`);
  }
  return socketId;
};

io.on("connection", (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  const auth = socket.handshake.auth as AuthPayload;
  const userId = auth.userId?.toString();

  if (userId) {
    users[userId] = socket.id;
    console.log("Online users:", users);

  
    socket.emit("onlineUsers", Object.keys(users));

 
    socket.broadcast.emit("userOnline", userId);
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    if (userId) {
      delete users[userId];

     
      socket.broadcast.emit("userOffline", userId);
    }
  });
});

export { app, io, httpServer };
