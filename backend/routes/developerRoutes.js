import {
    getDeveloperProfile,
    updateDeveloperProfile,
    addReview,
    createDeveloperProfile,
    getDeveloperProfileByUserId,
    addReviewByUserId,
} from "../controllers/developerController.js";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/profile", checkAuth, authorizeRoles("developer"), createDeveloperProfile);
router.get("/profile", checkAuth, authorizeRoles("developer"), getDeveloperProfile);
router.put("/profile", checkAuth, authorizeRoles("developer"), updateDeveloperProfile);
router.get("/user/:userId/profile", checkAuth, authorizeRoles("client", "admin"), getDeveloperProfileByUserId);
router.post("/user/:userId/review", checkAuth, authorizeRoles("client"), addReviewByUserId);
router.post("/:developerId/review", checkAuth, authorizeRoles("client"), addReview);

export default router;
