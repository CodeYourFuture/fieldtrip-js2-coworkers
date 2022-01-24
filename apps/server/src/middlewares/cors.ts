import corsFactory from "cors";
import { CLIENT_HOST } from "../config";

export const cors = corsFactory({
  origin: CLIENT_HOST,
  credentials: true,
});
