import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
};

export default generateToken;