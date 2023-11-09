import express from "express";
import { Login, getProfile, signUp } from "../controller/auth-controller.js";
import { checkAuth } from "../middleware/checkAuth.js";

const AuthRouter = express.Router();

AuthRouter.post("/auth/signup", signUp);
AuthRouter.post("/auth/login", Login);
AuthRouter.get("/auth/get-user", checkAuth, getProfile);

export default AuthRouter;
