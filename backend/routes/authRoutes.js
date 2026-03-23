import { loginUser, registerUser, logoutUser, getCurrentUser, changePassword } from "../controllers/authController.js";
import checkAuth from "../middleware/authMiddleware.js";
import express from "express";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", checkAuth, getCurrentUser);
router.put("/change-password", checkAuth, changePassword);

export default router;
