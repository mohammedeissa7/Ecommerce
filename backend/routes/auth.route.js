import express from "express";
import { login, signup, signin } from './../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

export default authRouter;

