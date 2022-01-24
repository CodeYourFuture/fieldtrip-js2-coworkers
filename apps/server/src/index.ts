import { app } from "./app";
import * as config from "./config";
import { io } from "./io";

const server = app.listen(config.PORT, () => {
  console.log("app listening on port", config.PORT);
});

io(server);
