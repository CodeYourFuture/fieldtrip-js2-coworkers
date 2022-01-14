import cookieSession from "cookie-session";
import Keygrip from "keygrip";
import * as config from "../config";

export const session = cookieSession({
  name: "session",
  keys: new Keygrip(
    [config.SESSION_KEY1, config.SESSION_KEY2],
    "SHA384",
    "base64"
  ),
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
});
