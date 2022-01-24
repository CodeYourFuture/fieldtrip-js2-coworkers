import type { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { emitter } from "./emitter";
import * as mw from "./middlewares";
import * as config from "./config";

export const io = (server: HTTPServer) => {
  const io = new Server(server, {
    path: "/ws",
    cors: {
      origin: config.CLIENT_HOST,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    mw.session(socket.request as any, {} as any, next as any);
  });

  io.on("connection", (socket) => {
    // @ts-ignore
    const username = socket.request.session.user.login;
    emitter.on("clientUpdate", (data) => {
      if (data.username === username) {
        socket.emit(data.type, data);
      }
    });
  });
};
