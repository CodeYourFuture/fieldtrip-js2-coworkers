import type { Server as HTTPServer } from "http";
import courses from "@packages/courses";
import { Server } from "socket.io";
import { emitter } from "./emitter";
import * as mw from "./middlewares";
import * as config from "./config";
import { Course } from "./services";
import { Enrollments } from "./types";

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
    // @ts-ignore @todo add socket.io types
    const username = socket.request.session.user?.login;
    if (!username) return;
    emitter.on(`${username}:enrollment:updated`, async (data: Enrollments) => {
      if (!data) return;
      const courseConfig = courses[data.course_id as any];
      const course = new Course(courseConfig, data);
      const compiledCourse = await course.compile();
      socket.emit("course:update", {
        courseId: data.course_id,
        course: compiledCourse,
      });
    });
  });
};
