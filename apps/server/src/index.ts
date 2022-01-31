import { app } from "./app";
import * as config from "./config";
import { io } from "./io";
import { migrate } from "./services/db";

migrate().then(() => {
  const server = app.listen(config.PORT, () => {
    console.log("app listening on port", config.PORT);
  });

  io(server);
});
