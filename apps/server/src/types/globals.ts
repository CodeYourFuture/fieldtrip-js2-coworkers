import type { Locals } from "./";
import type { Session } from "./";

declare global {
  namespace Express {
    interface Request {
      locals: Locals;
      session: Session;
    }
  }
}
