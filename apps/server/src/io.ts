import type { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { emitter } from "./emitter";
import * as mw from "./middlewares";
import * as config from "./config";
import courses from "@packages/courses";
import { Course } from "./utils";
import { StoreData } from "./types";

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
    emitter.on(`${username}:store:updated`, async (data: StoreData) => {
      if (!data.courseId && !data.enrollment) return;
      const courseConfig = courses[data.courseId as any];
      const course = new Course(courseConfig, data);
      const compiledCourse = await course.compile();
      socket.emit("course:update", {
        courseId: data.courseId,
        course: compiledCourse,
      });
    });
  });
};
