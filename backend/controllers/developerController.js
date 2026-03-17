import Developer from "../models/DeveloperProfile.js";
import User from "../models/User.js";
import mongoose from "mongoose";

//1. To get the Developer Profile [logged-in developer]
const getDeveloperProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const developer = await Developer.findOne({ userId }).populate("userId", "name email profilePicture");

        if (!developer) {
            return res.status(404).json({
                message: "Developer profile not found",
            });
        }
        res.status(200).json({
            message: "Developer profile fetched successfully",
            profile: developer,
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Error while fetching Developer profile",
            error: err.message,
        });
    }
};

//2. TO UPDATE THE DEVELOPER PROFILE
const updateDeveloperProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const developer = await Developer.findOne({ userId });
        if (!developer) {
            return res.status(404).json({
                message: "Developer profile not found"
            });
        }
        const { bio, skills, experienceYears, availability, links, rate } = req.body;
        if (bio) developer.bio = bio;
        if (skills) developer.skills = skills;
        if (links) developer.links = links;
        developer.experienceYears = experienceYears ?? developer.experienceYears;
        developer.rate = rate ?? developer.rate;


        await developer.save();

        res.status(200).json({
            message: "Developer profile updated successfully",
            profile: developer,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error while updating Developer profile",
            error: err.message,
        });
    }
};

//3. ADD REVIEW TO DEVELOPER

const addReview = async (req, res) => {
    try {
        const clientId = req.user._id;
        const { developerId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "rating must be between 1 and 5",
            });
        }
        const developer = await Developer.findById(developerId);
        if (!developer) {
            return res.status(404).json({
                message: "Developer not found",
            });
        }
        const alreadyReviewed = developer.reviews.find((r) => r.userId.toString() === clientId.toString());

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this developer",
            });
        }
        const newReview = {
            userId: clientId,
            rating,
            comment,
        };
        developer.reviews.push(newReview);
        await developer.save();
        res.status(201).json({
            message: "Review added successfully",
            reviews: developer.reviews,
            averageRating: developer.averageRating,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error while adding the Review",
            error: err.message,
        });
    }
};

// 4.CREATE A DEVELOPER PROFILE 

const createDeveloperProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const existingProfile = await Developer.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({
                message: "Developer Profile already exists ",
            });
        }
        const { bio, skills, experienceYears, availability, links, rate } = req.body;
        if (!bio || !skills || !rate) {
            return res.status(400).json({
                message: "Pleae fill required fields"
            });
        }
        const developerProfile = await Developer.create({
            userId,
            bio,
            skills,
            availability,
            links,
            rate,
            experienceYears,
            reviews: [],
            averageRating: 0,
            totalReviews: 0,

        });
        res.status(201).json({
            message: "Developer profile created successfully",
            profile: developerProfile,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error while adding the Review",
            error: err.message,
        });
    }
};

export { createDeveloperProfile, getDeveloperProfile, updateDeveloperProfile, addReview };