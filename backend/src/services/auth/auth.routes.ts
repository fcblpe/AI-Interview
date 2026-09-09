import { Router } from "express";
import { login, register, signout, me } from "./auth.controller";
import auth from "./auth.middleware";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/signout", auth, signout);
authRouter.get("/me", auth, me);

export default authRouter;
