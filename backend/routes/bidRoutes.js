import {
    placeBid,
    getMyBids,
    getClientBids,
    getSingleBid,
    getBidsForProject,
    updateBid,
    deleteBid,
    acceptBid,
    rejectBid,
} from "../controllers/bidController.js";

import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Developer
router.get("/my-bids", checkAuth, authorizeRoles("developer"), getMyBids);
// Client (specific routes first to avoid collision with "/:bidId")
router.get("/client/all", checkAuth, authorizeRoles("client"), getClientBids);
router.get("/:bidId", checkAuth, authorizeRoles("developer"), getSingleBid);
router.post("/:projectId", checkAuth, authorizeRoles("developer"), placeBid);
router.put("/:bidId", checkAuth, authorizeRoles("developer"), updateBid);
router.delete("/:bidId", checkAuth, authorizeRoles("developer"), deleteBid);

// Client
router.get("/project/:projectId", checkAuth, authorizeRoles("client"), getBidsForProject);
router.put("/:bidId/accept", checkAuth, authorizeRoles("client"), acceptBid);
router.put("/:bidId/reject", checkAuth, authorizeRoles("client"), rejectBid);

export default router;
