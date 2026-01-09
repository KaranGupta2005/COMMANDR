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
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  /* ================= AUTH MIDDLEWARE ================= */

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        // ❌ DO NOT BLOCK POLLING
        return next();
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.accessToken;

      if (!token) return next();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.userId || decoded.id || decoded._id;
      socket.role = decoded.role;

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(); // ❗ DO NOT BLOCK CONNECTION
    }
  });

  /* ================= CONNECTION ================= */

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    if (socket.userId) {
      addUser(socket.userId, socket.id);
      socket.join(socket.userId.toString());
      if (socket.role) socket.join(socket.role);
    } else {
      console.warn("⚠️ Unauthenticated socket:", socket.id);
    } // role broadcasts

    // handlers
    locationHandler(io, socket);
    rescueChatHandler(io, socket);
    routeHandler(io, socket);

    socket.on("disconnect", () => {
      removeUser(socket.userId);
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};
