import { io } from "socket.io-client";
import { toaster } from "evergreen-ui";
import { applySnapshot, onPatch } from "mobx-state-tree";
import { store } from "src/store";
import { SERVER_URL } from "src/config";

export const socket = io(SERVER_URL!, {
  autoConnect: false,
  path: "/ws",
  withCredentials: true,
});

socket.on("course:update", ({ courseId, course }) => {
  const courseModel = store.courses.get(courseId);
  if (!courseModel) return;
  applySnapshot(courseModel, course);
  console.log(course);
});

function onStepPassed(label: string) {
  const originalTitle = document.title;
  document.title = `Step Completed!`;
  setTimeout(() => {
    document.title = originalTitle;
    // Toast doesn't close if tab didn't have focus when it was opened
    toaster.closeAll();
  }, 6500);
  toaster.success("Step Completed!", {
    description: `You finished "${label}"`,
    duration: 6500,
  });
}
