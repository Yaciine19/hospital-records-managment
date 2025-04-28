import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRoute = Router();

authRoute.post("/login", loginUser);
authRoute.post("/register", registerUser);

export default authRoute;
