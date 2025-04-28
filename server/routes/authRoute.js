import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRoute = Router();

// Login
authRoute.post("/login", loginUser);

// Register new user (Admin only)
authRoute.post("/register", protect, registerUser);

export default authRoute;
