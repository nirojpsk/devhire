import Bid from "../models/Bid.js";
import Project from "../models/Project.js";
import Developer from "../models/DeveloperProfile.js";
import mongoose from "mongoose";

const getRemainingDaysToDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

// 1. PLACE BID [DEVELOPER]
const placeBid = async (req, res) => {
    try {
        const developerId = req.user._id;
        const { projectId } = req.params;
        const { bidAmount, proposal, deliveryTime } = req.body;
        const numericBidAmount = Number(bidAmount);
        const numericDeliveryTime = Number(deliveryTime);
        const trimmedProposal = proposal?.trim?.() || "";

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        if (!bidAmount || !proposal || !deliveryTime) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        if (Number.isNaN(numericBidAmount) || numericBidAmount <= 0) {
            return res.status(400).json({
                message: "Bid amount must be greater than 0",
            });
        }

        if (Number.isNaN(numericDeliveryTime) || numericDeliveryTime <= 0) {
            return res.status(400).json({
                message: "Delivery time must be greater than 0",
            });
        }

        if (trimmedProposal.length < 50) {
            return res.status(400).json({
                message: "Proposal must be at least 50 characters long",
            });
        }

        const developerProfile = await Developer.findOne({ userId: developerId });
        if (!developerProfile) {
            return res.status(400).json({
                message: "Please create your developer profile before placing a bid",
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (project.status !== "open") {
            return res.status(400).json({
                message: "Bids can only be placed on open projects",
            });
        }

        const remainingDays = getRemainingDaysToDeadline(project.deadline);
        if (numericDeliveryTime > remainingDays) {
            return res.status(400).json({
                message: `Delivery time must be within the project deadline (${remainingDays} day(s) left)`,
            });
        }

        if (numericBidAmount < Number(project.budget.min)) {
            return res.status(400).json({
                message: `Bid amount cannot be less than the project minimum budget ($${project.budget.min})`,
            });
        }

        const existingBid = await Bid.findOne({ projectId, developerId });

        if (existingBid) {
            return res.status(400).json({
                message: "You have already placed a bid on this project",
            });
        }

        const bid = await Bid.create({
            projectId,
            developerId,
            bidAmount: numericBidAmount,
            proposal: trimmedProposal,
            deliveryTime: numericDeliveryTime,
        });

        res.status(201).json({
            message: "Bid placed successfully",
            bid,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const firstValidationMessage = Object.values(err.errors)?.[0]?.message;
            return res.status(400).json({
                message: firstValidationMessage || "Invalid bid data",
            });
        }

        res.status(500).json({
            message: "Error placing bid",
            error: err.message,
        });
    }
};

// 2. GET MY BIDS [DEVELOPER]
const getMyBids = async (req, res) => {
    try {
        const developerId = req.user._id;

        const bids = await Bid.find({ developerId })
            .populate("projectId", "title status budget deadline submission selectedDeveloper");

        const sanitizedBids = bids.map((bidDoc) => {
            const bid = bidDoc.toObject();
            const selectedDeveloperId = bid.projectId?.selectedDeveloper
                ? String(bid.projectId.selectedDeveloper)
                : null;
            const isSubmittingDeveloper = selectedDeveloperId === String(developerId);

            if (!isSubmittingDeveloper && bid.projectId) {
                delete bid.projectId.submission;
            }

            return bid;
        });

        res.status(200).json({
            message: "Developer bids fetched successfully",
            bids: sanitizedBids,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching your bids",
            error: err.message,
        });
    }
};

// 3. GET SINGLE BID [DEVELOPER]
const getSingleBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const developerId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(bidId)) {
            return res.status(400).json({
                message: "Invalid bid ID",
            });
        }

        const bid = await Bid.findById(bidId).populate("projectId", "title deadline");

        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }

        if (bid.developerId.toString() !== developerId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        res.status(200).json({
            message: "Bid fetched successfully",
            bid,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching the bid",
            error: err.message,
        });
    }
};

// 4. GET BIDS FOR A PROJECT [CLIENT]
const getBidsForProject = async (req, res) => {
    try {
        const clientId = req.user._id;
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized to view bids for this project",
            });
        }

        const bids = await Bid.find({ projectId }).populate(
            "developerId",
            "name email profilePicture"
        );

        res.status(200).json({
            message: "Bids fetched successfully",
            bids,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching bids",
            error: err.message,
        });
    }
};

// 5. UPDATE BID [DEVELOPER]
const updateBid = async (req, res) => {
    try {
        const developerId = req.user._id;
        const { bidId } = req.params;
        const { bidAmount, proposal, deliveryTime } = req.body;

        if (!mongoose.Types.ObjectId.isValid(bidId)) {
            return res.status(400).json({
                message: "Invalid bid ID",
            });
        }

        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }

        if (bid.developerId.toString() !== developerId.toString()) {
            return res.status(403).json({
                message: "Not authorized to update this bid",
            });
        }

        if (bid.status !== "pending") {
            return res.status(400).json({
                message: "Cannot update bid after it is accepted/rejected",
            });
        }

        if (bid.editCount >= 2) {
            return res.status(400).json({
                message: "You can only edit a bid up to 2 times",
            });
        }

        const project = await Project.findById(bid.projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (bidAmount !== undefined) bid.bidAmount = bidAmount;
        if (proposal !== undefined) bid.proposal = proposal;
        if (deliveryTime !== undefined) {
            const numericDeliveryTime = Number(deliveryTime);
            if (Number.isNaN(numericDeliveryTime) || numericDeliveryTime <= 0) {
                return res.status(400).json({
                    message: "Delivery time must be greater than 0",
                });
            }

            const remainingDays = getRemainingDaysToDeadline(project.deadline);
            if (numericDeliveryTime > remainingDays) {
                return res.status(400).json({
                    message: `Delivery time must be within the project deadline (${remainingDays} day(s) left)`,
                });
            }

            bid.deliveryTime = numericDeliveryTime;
        }

        bid.editCount += 1;

        await bid.save();

        res.status(200).json({
            message: "Bid updated successfully",
            bid,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating bid",
            error: err.message,
        });
    }
};

// 6. DELETE BID [DEVELOPER]
const deleteBid = async (req, res) => {
    try {
        const developerId = req.user._id;
        const { bidId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bidId)) {
            return res.status(400).json({
                message: "Invalid bid ID",
            });
        }

        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }

        if (bid.developerId.toString() !== developerId.toString()) {
            return res.status(403).json({
                message: "Not authorized to delete this bid",
            });
        }

        if (bid.status !== "pending") {
            return res.status(400).json({
                message: "Cannot delete bid after it is accepted/rejected",
            });
        }

        await bid.deleteOne();

        res.status(200).json({
            message: "Bid deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting bid",
            error: err.message,
        });
    }
};

// 7. ACCEPT BID [CLIENT]
const acceptBid = async (req, res) => {
    try {
        const clientId = req.user._id;
        const { bidId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bidId)) {
            return res.status(400).json({
                message: "Invalid bid ID",
            });
        }

        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }

        const project = await Project.findById(bid.projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        if (project.status !== "open") {
            return res.status(400).json({
                message: "Bid can only be accepted while the project is open",
            });
        }

        if (bid.status !== "pending") {
            return res.status(400).json({
                message: "Only pending bids can be accepted",
            });
        }

        const existingAcceptedBid = await Bid.findOne({
            projectId: bid.projectId,
            status: "accepted",
            _id: { $ne: bid._id },
        });

        if (existingAcceptedBid) {
            // Keep project state consistent for older records created before this rule.
            if (
                project.status !== "in-progress" ||
                !project.selectedDeveloper ||
                project.selectedDeveloper.toString() !== existingAcceptedBid.developerId.toString()
            ) {
                project.selectedDeveloper = existingAcceptedBid.developerId;
                project.status = "in-progress";
                await project.save();
            }

            return res.status(400).json({
                message: "A bid has already been accepted for this project",
            });
        }

        bid.status = "accepted";
        await bid.save();

        await Bid.updateMany(
            {
                projectId: bid.projectId,
                _id: { $ne: bid._id },
                status: "pending",
            },
            { $set: { status: "rejected" } }
        );

        project.selectedDeveloper = bid.developerId;
        project.status = "in-progress";
        await project.save();

        res.status(200).json({
            message: "Bid accepted successfully and other pending bids were rejected",
            bid,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error accepting bid",
            error: err.message,
        });
    }
};

// 8. REJECT BID [CLIENT]
const rejectBid = async (req, res) => {
    try {
        const clientId = req.user._id;
        const { bidId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bidId)) {
            return res.status(400).json({
                message: "Invalid bid ID",
            });
        }

        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }

        const project = await Project.findById(bid.projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        if (bid.status !== "pending") {
            return res.status(400).json({
                message: "Only pending bids can be rejected",
            });
        }

        bid.status = "rejected";
        await bid.save();

        res.status(200).json({
            message: "Bid rejected successfully",
            bid,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error rejecting bid",
            error: err.message,
        });
    }
};

// 2b. GET ALL BIDS FOR CLIENT'S PROJECTS [CLIENT]
const getClientBids = async (req, res) => {
    try {
        const clientId = req.user._id;
        const projects = await Project.find({ clientId }).select("_id");
        const projectIds = projects.map((project) => project._id);

        if (projectIds.length === 0) {
            return res.status(200).json({
                message: "Client bids fetched successfully",
                bids: [],
            });
        }

        const bids = await Bid.find({ projectId: { $in: projectIds } })
            .populate("developerId", "name email profilePicture")
            .populate("projectId", "title status budget deadline")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Client bids fetched successfully",
            bids,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching client bids",
            error: err.message,
        });
    }
};

export {
    placeBid,
    getMyBids,
    getClientBids,
    getSingleBid,
    getBidsForProject,
    updateBid,
    deleteBid,
    acceptBid,
    rejectBid,
};
