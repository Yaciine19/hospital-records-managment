import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const authRoute = Router();

authRoute.post("/login", loginUser);
authRoute.post("/register", registerUser);

export default authRoute;
