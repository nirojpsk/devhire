import Project from "../models/Project.js";
import User from "../models/User.js";
import Developer from "../models/DeveloperProfile.js";
import Bid from "../models/Bid.js";
import mongoose from "mongoose";

const isFutureDate = (dateValue) => {
    const selectedDate = new Date(dateValue);
    if (Number.isNaN(selectedDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today;
};

//1.CREATE A PROJECT [CLIENT]

const createProject = async (req, res) => {
    try {
        const clientId = req.user._id;
        const { title, description, budget, skillsRequired, deadline } = req.body;
        if (!title || !description || !budget || !skillsRequired || !deadline) {
            return res.status(400).json({
                message: "Pleae fill all required fields",
            });
        }
        if (!isFutureDate(deadline)) {
            return res.status(400).json({
                message: "Deadline must be a future date",
            });
        }
        const project = await Project.create({
            title,
            description,
            budget,
            clientId,
            skillsRequired,
            deadline,
            status: "open",
        });
        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error creating project",
            error: err.message,
        });
    }
};
//2.UPDATE A PROJECT [CLIENT]

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
        //Owner le matra update garnu milxa
        if (project.clientId.toString() !== clientId.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }
        //Project start vae sake paxi update garnu na milna lai
        if (project.status !== "open") {
            return res.status(400).json({
                message: "Cannot update the project after it has started",
            });
        }
        const { title, description, budget, skillsRequired, deadline } = req.body;
        if (title) project.title = title;
        if (description) project.description = description;
        if (budget) project.budget = budget;
        if (skillsRequired) project.skillsRequired = skillsRequired;
        if (deadline) {
            if (!isFutureDate(deadline)) {
                return res.status(400).json({
                    message: "Deadline must be a future date",
                });
            }
            project.deadline = deadline;
        }

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating project",
            error: err.message,
        });
    }
};
//3.DELETE A PROJECT [CLIENT]

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientId = req.user._id;

        const project = await Project.findById(projectId);
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

        const hasAcceptedBid = await Bid.exists({
            projectId: project._id,
            status: "accepted",
        });

        if (hasAcceptedBid || project.selectedDeveloper || project.status === "in-progress") {
            return res.status(400).json({
                message: "Cannot delete project after a bid has been accepted",
            });
        }

        await project.deleteOne();

        res.status(200).json({
            message: "Project deleted successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error deleting project",
            error: err.message,
        });
    }
};
//4.GET ALL PROJECTS [PUBLIC/DEVELOPERS]

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .select("-submission")
            .populate("clientId", "name email")
            .populate("selectedDeveloper", "name email");
        res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching all projects",
            error: err.message,
        });
    }
};
//5.GET SINGLE PROJECT

const getSingleProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const project = await Project.findById(projectId)
            .populate("clientId", "name email")
            .populate("selectedDeveloper", "name email")
            .populate("submission.submittedBy", "name email")
            .populate("submission.clientDecision.decidedBy", "name email")
            .populate("submission.clientReview.reviewedBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const requesterId = req.user?._id ? String(req.user._id) : null;
        const clientId = project.clientId?._id
            ? String(project.clientId._id)
            : String(project.clientId);
        const selectedDeveloperId = project.selectedDeveloper?._id
            ? String(project.selectedDeveloper._id)
            : project.selectedDeveloper
                ? String(project.selectedDeveloper)
                : null;
        const canViewSubmission =
            requesterId &&
            (requesterId === clientId || requesterId === selectedDeveloperId);

        const projectData = project.toObject();
        if (!canViewSubmission) {
            delete projectData.submission;
        }

        res.status(200).json({
            message: "Project fetched successfully",
            project: projectData,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching the project",
            error: err.message,
        });
    }
};
//6.GET CLIENT PROJECTS [CLIENT]
const getClientProjects = async (req, res) => {
    try {
        const clientId = req.user._id;
        const projects = await Project.find({ clientId })
            .populate("selectedDeveloper", "name email")
            .populate("submission.submittedBy", "name email")
            .populate("submission.clientDecision.decidedBy", "name email")
            .populate("submission.clientReview.reviewedBy", "name email");
        res.status(200).json({
            message: "Client projects fetched successfully",
            projects,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching client's project",
            error: err.message,
        });
    }
};
//7.SELECT DEVELOPER [CLIENT]

const selectDeveloper = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { developerId } = req.body;
        const clientId = req.user._id;

        const project = await Project.findById(projectId);

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
                message: "Developer already selected or Project started",
            });
        }
        project.selectedDeveloper = developerId;
        project.status = "in-progress";

        await project.save();

        res.status(200).json({
            message: "Developer selected successfully",
            project,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error Selecting Developer",
            error: err.message,
        });
    }
};
//8.UPDATE PROJECT STATUS

const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;
        const clientId = req.user._id;

        const validStatus = ["open", "in-progress", "completed", "cancelled"];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Value",
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
                message: "Not authorized",
            });
        }
        project.status = status;
        await project.save();

        res.status(200).json({
            message: "Project status updated successfully",
            project,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating project status",
            error: err.message,
        });
    }
};

//9.SUBMIT PROJECT [DEVELOPER]
const submitProjectByDeveloper = async (req, res) => {
    try {
        const { projectId } = req.params;
        const developerId = req.user._id;
        const { link, note } = req.body;

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

        if (!project.selectedDeveloper) {
            return res.status(400).json({
                message: "No developer has been selected for this project yet",
            });
        }

        if (project.selectedDeveloper.toString() !== developerId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to submit this project",
            });
        }

        const existingSubmission = project.submission?.submittedAt || project.submission?.link;
        const existingDecision = project.submission?.clientDecision?.status;

        if (existingSubmission) {
            if (existingDecision === "accepted") {
                return res.status(400).json({
                    message: "Project has already been accepted and cannot be submitted again",
                });
            }

            if (existingDecision === "pending" || !existingDecision) {
                return res.status(400).json({
                    message: "Project has already been submitted and is pending client review",
                });
            }
        }

        const trimmedLink = link?.trim();
        const trimmedNote = note?.trim() || "";

        if (!trimmedLink) {
            return res.status(400).json({
                message: "Please provide the project submission link",
            });
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(trimmedLink);
        } catch {
            return res.status(400).json({
                message: "Please provide a valid submission link",
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                message: "Submission link must start with http:// or https://",
            });
        }

        if (project.status === "cancelled") {
            return res.status(400).json({
                message: "Cancelled projects cannot be submitted",
            });
        }

        project.submission = {
            link: trimmedLink,
            note: trimmedNote,
            submittedAt: new Date(),
            submittedBy: developerId,
            clientDecision: {
                status: "pending",
                note: "",
                decidedAt: null,
                decidedBy: null,
            },
        };
        project.status = "in-progress";

        await project.save();

        res.status(200).json({
            message: "Project submitted successfully",
            project,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error submitting project",
            error: err.message,
        });
    }
};

//10.GET SUBMITTED PROJECTS [CLIENT]
const getSubmittedProjectsForClient = async (req, res) => {
    try {
        const clientId = req.user._id;

        const projects = await Project.find({
            clientId,
            "submission.submittedAt": { $exists: true, $ne: null },
        })
            .populate("selectedDeveloper", "name email")
            .populate("submission.submittedBy", "name email")
            .populate("submission.clientDecision.decidedBy", "name email")
            .populate("submission.clientReview.reviewedBy", "name email")
            .sort({ "submission.submittedAt": -1 });

        res.status(200).json({
            message: "Submitted projects fetched successfully",
            projects,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching submitted projects",
            error: err.message,
        });
    }
};

//11.REVIEW SUBMITTED PROJECT [CLIENT]
const reviewSubmittedProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientId = req.user._id;
        const { action, note } = req.body;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({
                message: "Action must be either accept or reject",
            });
        }

        const trimmedNote = note?.trim();
        if (!trimmedNote) {
            return res.status(400).json({
                message: "Please provide a note for this decision",
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
                message: "Not authorized",
            });
        }

        if (!project.submission?.submittedAt) {
            return res.status(400).json({
                message: "Project has not been submitted by developer yet",
            });
        }

        const existingDecision = project.submission?.clientDecision?.status;
        if (existingDecision === "accepted" || existingDecision === "rejected") {
            return res.status(400).json({
                message: "Project submission has already been reviewed",
            });
        }

        project.submission.clientDecision = {
            status: action === "accept" ? "accepted" : "rejected",
            note: trimmedNote,
            decidedAt: new Date(),
            decidedBy: clientId,
        };

        if (action === "accept") {
            project.status = "completed";
        } else {
            project.status = "in-progress";
        }

        await project.save();

        res.status(200).json({
            message:
                action === "accept"
                    ? "Project accepted successfully"
                    : "Project rejected successfully",
            project,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error reviewing submitted project",
            error: err.message,
        });
    }
};

//12.REVIEW DEVELOPER FOR SUBMITTED PROJECT [CLIENT]
const reviewDeveloperForProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientId = req.user._id;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "rating must be between 1 and 5",
            });
        }

        const trimmedComment = comment?.trim();
        if (!trimmedComment) {
            return res.status(400).json({
                message: "Please provide a review comment",
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
                message: "Not authorized",
            });
        }

        if (!project.selectedDeveloper) {
            return res.status(400).json({
                message: "No selected developer found for this project",
            });
        }

        const decisionStatus = project.submission?.clientDecision?.status;
        if (!["accepted", "rejected"].includes(decisionStatus)) {
            return res.status(400).json({
                message: "Review can be submitted only after accepting or rejecting the project",
            });
        }

        const existingProjectReview = project.submission?.clientReview?.reviewedAt;
        if (decisionStatus === "accepted" && existingProjectReview) {
            return res.status(400).json({
                message: "Review cannot be edited once the project is accepted",
            });
        }

        const developerProfile = await Developer.findOne({ userId: project.selectedDeveloper });
        if (!developerProfile) {
            return res.status(404).json({
                message: "Developer profile not found",
            });
        }

        const existingReviewIndex = developerProfile.reviews.findIndex(
            (r) =>
                r.userId.toString() === clientId.toString() &&
                r.projectId &&
                r.projectId.toString() === project._id.toString()
        );

        if (existingReviewIndex >= 0) {
            developerProfile.reviews[existingReviewIndex].rating = rating;
            developerProfile.reviews[existingReviewIndex].comment = trimmedComment;
            developerProfile.reviews[existingReviewIndex].createdAt = new Date();
        } else {
            developerProfile.reviews.push({
                userId: clientId,
                projectId: project._id,
                rating,
                comment: trimmedComment,
            });
        }

        project.submission.clientReview = {
            rating,
            comment: trimmedComment,
            reviewedAt: new Date(),
            reviewedBy: clientId,
        };

        await developerProfile.save();
        await project.save();

        res.status(200).json({
            message: "Developer review submitted successfully",
            project,
            averageRating: developerProfile.averageRating,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error while reviewing developer",
            error: err.message,
        });
    }
};



export {
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
};
