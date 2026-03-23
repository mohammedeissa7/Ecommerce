import express from "express";
import { login, signup, logout, refreshToken } from './../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);


export default authRouter;


