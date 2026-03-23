import {
    getAllProjectsAdmin,
    getAllUsers,
    deleteProjectAdmin,
    deleteUser,
    banUser,
    getUserProfileAdmin,
} from "../controllers/adminController.js";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/users", checkAuth, authorizeRoles("admin"), getAllUsers);
router.get("/projects", checkAuth, authorizeRoles("admin"), getAllProjectsAdmin);
router.delete("/project/:projectId", checkAuth, authorizeRoles("admin"), deleteProjectAdmin);
router.delete("/user/:userId", checkAuth, authorizeRoles("admin"), deleteUser);
router.put("/ban/:userId", checkAuth, authorizeRoles("admin"), banUser);
router.get("/user/:userId/profile", checkAuth, authorizeRoles("admin"), getUserProfileAdmin);

export default router;
