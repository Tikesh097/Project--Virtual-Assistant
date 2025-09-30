import express from "express";
import { logout, signUp, Login } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.get("/logout", logout);

export default authRouter;
