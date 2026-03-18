import User from "../models/User.js";
import Developer from "../models/DeveloperProfile.js";
import Client from "../models/ClientProfile.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

// 1. TO REGISTER A NEW USER    

const registerUser = async (req, res) => {
    try {

        const { name, email, password, profilePicture, address, role } = req.body;
        ///To check if the required fields are filled or not

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: "Please Fill All The Required Fields",
            });
        }

        //In order to validate the role of the user

        if (!["client", "developer"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role selected",
            });
        }

        //To validate the address field

        if (!address.country || !address.state || !address.city || !address.zipCode) {
            return res.status(400).json({
                message: "Please Provide complete address information",
            });
        }

        // To validate the user password

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        //To check whether there is a user with the same email or not

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists!!!",
            });
        }

        //Now the user is registered

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role,
            profilePicture,
            address,
        });

        //To create a profile based on the roles

        if (role == "developer") {
            await Developer.create({
                userId: user._id,
            });
        }

        if (role == "client") {
            await Client.create({
                userId: user._id,
            });
        }

        //To generate the cookies 

        generateToken(res, user);

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Error Registering User",
            error: err.message,
        });
    }
};


//2. TO LOGIN THE USER

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the required fields",
            });
        }
        //To check if the user exists or not

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: "Please provide valid credentials",
            });
        }

        //To check if the password is valid or not

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Please provide valid credentials",
            });
        }

        //In order to generate the token

        generateToken(res, user);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Error loggin in user",
            error: err.message,
        });
    }
};

//3. TO LOGOUT THE USER

const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        res.status(200).json({
            message: "Logout Success!!!"
        })

    }
    catch (err) {
        res.status(500).json({
            message: "Error logging out",
            error: err.message,
        });
    }
};

//4. TO GET CURRENT USER [CURRENTLY LOGGED IN USER]

const getCurrentUser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "User fetched successfully",
            profile: user,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error while getting Current User",
            error: err.message,
        });
    }
};


//5. To Change the Password

const changePassword = async (req, res) => {
    try {
        const id = req.user._id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Please fill all the required fields",
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters long",
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await user.comparePassword(oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Old password is incorrect",
            });
        }
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password cannot be same as old password",
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            message: "Password changed successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error while Changing the password",
            error: err.message,
        });
    }
};

export { registerUser, loginUser, logoutUser, getCurrentUser, changePassword };