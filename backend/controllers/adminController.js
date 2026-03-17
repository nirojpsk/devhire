import User from "../models/User";
import Project from "../models/Project";

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

        user.isBanned = true; // make sure this field exists in User model

        await user.save();

        res.status(200).json({
            message: "User banned successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: "Error banning user",
            error: err.message,
        });
    }
};

export { getAllUsers, getAllProjectsAdmin, deleteUser, deleteProjectAdmin, banUser };