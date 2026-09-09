import type { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload {
  id: string;
  role: "user"| "admin" | string;
  email: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload | JwtPayload | string;
    }
  }
}
