import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
    buildEmailVerificationUrl,
    createEmailVerificationToken,
    hashEmailVerificationToken,
} from "../utils/emailVerification.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

const isProduction = process.env.NODE_ENV === "production";
const now = () => new Date();
const isUserEmailVerified = (user) => user?.isEmailVerified !== false;
const normalizeEmail = (email = "") => email.trim().toLowerCase();
const serializeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: isUserEmailVerified(user),
});

const queueVerificationEmail = async (user) => {
    const { token, tokenHash, expiresAt } = createEmailVerificationToken();

    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationExpiresAt = expiresAt;
    user.emailVerificationSentAt = now();

    await user.save();

    const verifyUrl = buildEmailVerificationUrl(token);
    return sendVerificationEmail({
        email: user.email,
        name: user.name,
        verifyUrl,
    });
};

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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, and a special character",
            });
        }
        
        if (!/^\d+$/.test(address.zipCode)) {
            return res.status(400).json({
                message: "Zip code must contain only numbers",
            });
        }
        //To check whether there is a user with the same email or not

        const normalizedEmail = normalizeEmail(email);
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            if (!isUserEmailVerified(existingUser)) {
                let emailDeliveryFailed = false;
                let message = "This account already exists but is not verified. We sent a new verification email.";

                try {
                    await queueVerificationEmail(existingUser);
                } catch (emailErr) {
                    emailDeliveryFailed = true;
                    message = "This account already exists but is not verified. We could not send a new verification email right now.";
                    console.error("Failed to resend verification email during registration:", emailErr.message);
                }

                return res.status(409).json({
                    message,
                    email: existingUser.email,
                    verificationRequired: true,
                    emailDeliveryFailed,
                });
            }

            return res.status(400).json({
                message: "User already exists!!!",
            });
        }

        //Now the user is registered

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role,
            profilePicture,
            address,
            isEmailVerified: false,
        });

        let emailDeliveryFailed = false;
        let message = "User registered successfully. Please verify your email before logging in.";

        try {
            await queueVerificationEmail(user);
        } catch (emailErr) {
            emailDeliveryFailed = true;
            message = "User registered successfully, but we could not send the verification email right now. Please request a new link.";
            console.error("Failed to send verification email during registration:", emailErr.message);
        }

        res.status(201).json({
            message,
            email: user.email,
            verificationRequired: true,
            emailDeliveryFailed,
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

        const user = await User.findOne({ email: normalizeEmail(email) });
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

        if (!isUserEmailVerified(user)) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
                email: user.email,
                verificationRequired: true,
            });
        }

        //In order to generate the token

        generateToken(res, user);

        res.status(200).json({
            message: "User logged in successfully",
            user: serializeUser(user),
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
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
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
        const { oldPassword, currentPassword, newPassword } = req.body;
        const existingPassword = oldPassword || currentPassword;
        if (!existingPassword || !newPassword) {
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

        const isPasswordValid = await user.comparePassword(existingPassword);
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

//6. To Verify Email

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Verification token is required",
            });
        }

        const tokenHash = hashEmailVerificationToken(token);
        const user = await User.findOne({ emailVerificationTokenHash: tokenHash });

        if (!user) {
            return res.status(400).json({
                message: "This verification link is invalid or has already been used",
            });
        }

        if (
            user.emailVerificationExpiresAt &&
            user.emailVerificationExpiresAt.getTime() < now().getTime()
        ) {
            return res.status(400).json({
                message: "This verification link has expired. Please request a new one.",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationTokenHash = null;
        user.emailVerificationExpiresAt = null;
        user.emailVerificationSentAt = null;
        await user.save();

        res.status(200).json({
            message: "Email verified successfully. You can now log in.",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error verifying email",
            error: err.message,
        });
    }
};

//7. To Resend Verification Email

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email: normalizeEmail(email) });
        if (!user) {
            return res.status(404).json({
                message: "No account was found for that email address",
            });
        }

        if (isUserEmailVerified(user)) {
            return res.status(400).json({
                message: "This email is already verified. Please log in.",
            });
        }

        await queueVerificationEmail(user);

        res.status(200).json({
            message: "Verification email sent successfully. Please check your inbox.",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error sending verification email",
            error: err.message,
        });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
};
