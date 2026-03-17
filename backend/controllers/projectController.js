import Project from "../models/Project.js";
import User from "../models/User.js";
import Developer from "../models/DeveloperProfile.js";
import mongoose from "mongoose";

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
        if (deadline) project.deadline = deadline;

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
        const projects = await Project.find().populate("clientId", "name email");
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
            .populate("selectedDeveloper");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
        res.status(200).json({
            message: "Project fetched successfully",
            project,
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
        const projects = await Project.find({ clientId });
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




export { createProject, getAllProjects, getSingleProject, getClientProjects, updateProject, deleteProject, selectDeveloper, updateProjectStatus };