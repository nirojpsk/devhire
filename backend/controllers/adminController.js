import User from "../models/User.js";
import Project from "../models/Project.js";
import Developer from "../models/DeveloperProfile.js";
import Client from "../models/ClientProfile.js";

// 1. Get all Users

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            message: "User fetched successfully",
            users,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching users",
            error: err.message,
        });
    }
};
// 2. Get all projects
const getAllProjectsAdmin = async (req, res) => {
    try {
        const projects = await Project.find().populate("clientId", "name email");
        res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching projects",
            error: err.message,
        });
    }
};

// 3. Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await user.deleteOne();

        res.status(200).json({
            message: "User deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: "Error deleting user",
            error: err.message,
        });
    }
};
// 4. Delete project
const deleteProjectAdmin = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        await project.deleteOne();

        res.status(200).json({
            message: "Project deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: "Error deleting project",
            error: err.message,
        });
    }
};
// 5. Ban user
const banUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "Cannot ban an admin user",
            });
        }

        const newBanStatus = !user.isBanned;
        await User.findByIdAndUpdate(userId, { isBanned: newBanStatus });

        res.status(200).json({
            message: newBanStatus ? "User banned successfully" : "User unbanned successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: "Error banning user",
            error: err.message,
        });
    }
};

// 6. Get a user's profile by role (admin-only)
const getUserProfileAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "Admin profiles are not supported here",
            });
        }

        let profile = null;

        if (user.role === "developer") {
            profile = await Developer.findOne({ userId: user._id });
        } else if (user.role === "client") {
            profile = await Client.findOne({ userId: user._id });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user,
            profile,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching user profile",
            error: err.message,
        });
    }
};

export { getAllUsers, getAllProjectsAdmin, deleteUser, deleteProjectAdmin, banUser, getUserProfileAdmin };
