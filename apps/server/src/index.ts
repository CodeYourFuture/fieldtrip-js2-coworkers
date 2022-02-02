import { app } from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate, taskq } from "./services";
import { processTrigger } from "./tasks";

migrate()
  .then(() => {
    const server = app.listen(config.PORT, () => {
      console.log("app listening on port", config.PORT);
    });

    io(server);

    taskq.take(/^trigger:/, processTrigger);
    taskq.start();
  })
  .catch((err) => {
    throw err;
  });
