import { getDeveloperProfile, updateDeveloperProfile, addReview, createDeveloperProfile } from "../controllers/developerController.js";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/profile", checkAuth, authorizeRoles("developer", createDeveloperProfile));
router.get("/profile", checkAuth, authorizeRoles("developer"), getDeveloperProfile);
router.put("/profile", checkAuth, authorizeRoles("developer"), updateDeveloperProfile);
router.post("/:developerId/review", checkAuth, authorizeRoles("client"), addReview);

export default router;
