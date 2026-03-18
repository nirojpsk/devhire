import Client from "../models/ClientProfile.js";
import mongoose from "mongoose";

//1.CREATE CLIENT PROFILE

const createClientProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const existingProfile = await Client.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({
                message: "Client Profile already exists",
            });
        }
        const { companyName, bio, website } = req.body;
        if (!companyName || !bio) {
            return res.status(400).json({
                message: "Please fill all the required fields",
            });
        }
        const clientProfile = await Client.create({
            userId,
            companyName,
            bio,
            website,
            totalProjectsPosted: 0,
        });

        res.status(201).json({
            message: "Client profile created successfully",
            profile: clientProfile,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error creating client profile",
            error: err.message,
        });
    }
};

//2.GET CLIENT PROFILE
const getClientProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const client = await Client.findOne({ userId }).populate(
            "userId",
            "name email profilePicture"
        );

        if (!client) {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        res.status(200).json({
            message: "Client profile fetched successfully",
            profile: client,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching client profile",
            error: err.message,
        });
    }
};


//3.UPDATE CLIENT PROFILE

const updateClientProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const client = await Client.findOne({ userId });

        if (!client) {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        const { companyName, bio, website } = req.body;

        if (companyName) client.companyName = companyName;
        if (bio) client.bio = bio;
        if (website) client.website = website;

        await client.save();

        res.status(200).json({
            message: "Client profile updated successfully",
            profile: client,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating client profile",
            error: err.message,
        });
    }
};

export { createClientProfile, getClientProfile, updateClientProfile };