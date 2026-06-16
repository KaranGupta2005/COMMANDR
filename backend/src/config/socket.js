import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { addUser, removeUser } from "../utils/socketRegistry.js";

// socket handlers
import locationHandler from "../socket/locationHandler.js";
import rescueChatHandler from "../socket/rescueChatHandler.js";
import routeHandler from "../socket/routeHandler.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Auth middleware — extract user from cookie token
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next();

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.accessToken;
      if (!token) return next();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.userId || decoded.id || decoded._id;
      socket.role = decoded.role;

      next();
    } catch (err) {
      // Don't block connection — unauthenticated sockets are handled downstream
      console.warn("Socket auth warning:", err.message);
      next();
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id, socket.userId ? `(user: ${socket.userId})` : "(unauthenticated)");

    if (socket.userId) {
      addUser(socket.userId, socket.id);
      socket.join(socket.userId.toString());
      if (socket.role) socket.join(socket.role);
    }

    // Register event handlers
    locationHandler(io, socket);
    rescueChatHandler(io, socket);
    routeHandler(io, socket);

    socket.on("disconnect", (reason) => {
      if (socket.userId) {
        removeUser(socket.userId);
      }
      console.log("🔴 Socket disconnected:", socket.id, `(${reason})`);
    });
  });

  return io;
};
