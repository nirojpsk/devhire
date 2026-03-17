import { createClientProfile, getClientProfile, updateClientProfile } from "../controllers/clientController.js";
import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/profile", checkAuth, authorizeRoles("client"), createClientProfile);
router.get("/profile", checkAuth, authorizeRoles("client"), getClientProfile);
router.put("/profile", checkAuth, authorizeRoles("client"), updateClientProfile);

export default router;