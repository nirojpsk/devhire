import {
    createProject,
    getAllProjects,
    getSingleProject,
    getClientProjects,
    updateProject,
    deleteProject,
    selectDeveloper,
    updateProjectStatus

} from "../controllers/projectController.js";

import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// public or developer
router.get("/", getAllProjects);
router.get("/:projectId", getSingleProject);

// client only
router.post("/", checkAuth, authorizeRoles("client"), createProject);
router.get("/my-projects", checkAuth, authorizeRoles("client"), getClientProjects);
router.put("/:projectId", checkAuth, authorizeRoles("client"), updateProject);
router.delete("/projectId", checkAuth, authorizeRoles("client"), deleteProject);
router.put("/projectId/select", checkAuth, authorizeRoles("client"), selectDeveloper);
router.put("/:projectId/status", checkAuth, authorizeRoles("client"), updateProjectStatus);

export default router;