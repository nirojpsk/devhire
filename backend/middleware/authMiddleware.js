//user logged-in xa ki xaina vanera check garnu ko lagi

import User from "../models/User.js";
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "You are not logged in!!!"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded?.userId) {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found!!!",
            });
        }
        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account has been banned"
            });
        }
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (err) {
        res.status(401).send({
            message: "Invalid or expired Token!!!",
        });
    }
};

export default checkAuth;