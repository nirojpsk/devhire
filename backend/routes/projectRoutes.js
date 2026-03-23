import {
    createProject,
    getAllProjects,
    getSingleProject,
    getClientProjects,
    updateProject,
    deleteProject,
    selectDeveloper,
    updateProjectStatus,
    submitProjectByDeveloper,
    getSubmittedProjectsForClient,
    reviewSubmittedProject,
    reviewDeveloperForProject,

} from "../controllers/projectController.js";

import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// public or developer
router.get("/", optionalAuth, getAllProjects);

// client only — must come before /:projectId so "my-projects" isn't matched as a param
router.get("/my-projects", checkAuth, authorizeRoles("client"), getClientProjects);
router.get("/submitted-projects", checkAuth, authorizeRoles("client"), getSubmittedProjectsForClient);

router.get("/:projectId", optionalAuth, getSingleProject);
router.post("/", checkAuth, authorizeRoles("client"), createProject);
router.put("/:projectId", checkAuth, authorizeRoles("client"), updateProject);
router.delete("/:projectId", checkAuth, authorizeRoles("client"), deleteProject);
router.put("/:projectId/select", checkAuth, authorizeRoles("client"), selectDeveloper);
router.put("/:projectId/status", checkAuth, authorizeRoles("client"), updateProjectStatus);
router.put("/:projectId/submit", checkAuth, authorizeRoles("developer"), submitProjectByDeveloper);
router.put("/:projectId/review-submission", checkAuth, authorizeRoles("client"), reviewSubmittedProject);
router.put("/:projectId/review-developer", checkAuth, authorizeRoles("client"), reviewDeveloperForProject);

export default router;
