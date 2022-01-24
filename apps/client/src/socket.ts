import { io } from "socket.io-client";
import { store } from "./store";
import { SERVER_URL } from "./config";
import { toaster } from "evergreen-ui";

export const socket = io(SERVER_URL!, {
  autoConnect: false,
  path: "/ws",
  withCredentials: true,
});

socket.on("trigger:passed", ({ repo, actionId }) => {
  const action = store.courses.get(repo)?.getActionById(actionId);
  if (action) {
    action.setPassed(true);
    const originalTitle = document.title;
    document.title = `Step Completed!`;
    setTimeout(() => {
      document.title = originalTitle;
      // Toast doesn't close if tab didn't have focus when it was opened
      toaster.closeAll();
    }, 6500);
    toaster.success("Step Completed!", {
      description: `You finished "${action.label}"`,
      duration: 6500,
    });
  }
});
