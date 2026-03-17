import Bid from "../models/Bid.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

//1.PLACE BID [DEVELOPER]

const placeBid = async (req, res) => {
    try {
        const developerId = req.user._id;
        const { projectId } = req.params;
        const { bidAmount, proposal, deliveryTime } = req.body;

        if (!bidAmount || !proposal || !deliveryTime) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        //Check garne yedi project open xa ki nai vanera

        if (project.status !== "open") {
            return res.status(400).json({
                message: "Bidding is closed for this project"
            });
        }

        //duplicate bid prevent garnu lai

        const existingBid = await Bid.findOne({ projectId, developerId });
        if (existingBid) {
            return res.status(400).json({
                message: "You have already placed a bid on this project",
            });
        }
        const bid = await Bid.create({
            projectId,
            developerId,
            bidAmount,
            proposal,
            deliveryTime,
        });

        res.status(201).json({
            message: "Bid placed successfully",
            bid,
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Error placing Bid",
            error: err.message,
        });
    }
};
//2.GET BIDS FOR A PROJECT [CLIENT]

const getBidsForProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientId = req.user._id;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                messge: "Project not found",
            });
        }

        //onlly owner can view bids

        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        const bids = await Bid.find({ projectId }).populate("developerId", "name email");

        res.status(200).json({
            message: "Bids fetched successfully",
            bids,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching bids",
            error: err.message,
        });
    }
};
//3.UPDATE BID [DEVELOPER]
const updateBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const developerId = req.user._id;
        const bid = await Bid.findById(bidId);
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
        if (bid.status !== "pending") {
            return res.status(400).json({
                message: "Cannot update bid after it is accepted/rejected",
            });
        }
        const { bidAmount, proposal, deliveryTime } = req.body;
        if (bidAmount) bid.bidAmount = bidAmount;
        if (proposal) bid.proposal = proposal;
        if (deliveryTime) bid.deliveryTime = deliveryTime;

        bid.editCount += 1;

        await bid.save();

        res.status(200).json({
            message: "Bid updated successfully",
            bid,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating the bid",
            error: err.message,
        });
    }
};

//4.DELETE BID [DEVELOPER]

const deleteBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const developerId = req.user._id;
        const bid = await Bid.findById(bidId);

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
        await bid.deleteOne();

        res.status(200).json({
            message: "Bid deleted successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error deleting the bid",
            error: err.message,
        });
    }
};
//5.ACCEPT BID [CLIENT]

const acceptBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const clientId = req.user._id;
        const bid = await Bid.findById(bidId).populate("projectId");
        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }
        const project = bid.projectId;
        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }
        if (project.status !== "open") {
            return res.status(400).json({
                message: "Project already in progress",
            });
        }
        bid.status = "accepted";

        //now we reject all other bids

        await Bid.updateMany(
            { projectId: project._id, _id: { $ne: bidId } },
            { status: "rejected" }
        );

        //we update the project now

        project.selectedDeveloper = bid.developerId;
        project.status = "in-progress";

        await bid.save();
        await project.save();

        res.status(200).json({
            message: "Bid accepted successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error accepting the bid",
            error: err.message,
        });
    }
};
//6.REJECT BID [CLIENT]

const rejectBid = async (req, res) => {
    try {
        const { bidId } = req.params;
        const clientId = req.user._id;

        const bid = await Bid.findById(bidId).populate("projectId");

        if (!bid) {
            return res.status(404).json({
                message: "Bid not found",
            });
        }
        const project = bid.projectId;

        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }
        bid.status = "rejected";
        await bid.save();

        res.status(200).json({
            message: "Bid rejected successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error rejecting the bid",
            error: err.message,
        });
    }
};

export { placeBid, getBidsForProject, updateBid, deleteBid, acceptBid, rejectBid };