import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const authRoute = Router();

// Login
authRoute.post("/login", loginUser);

// Register new user
authRoute.post("/register", registerUser);

export default authRoute;