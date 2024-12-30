import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days to MS
        httpOnly: true, //prevent XXS attacks
        sameSite: "strict", //prevents CSRF attacks
        secure: process.env.NODE_ENV != "development", //only works in HTTPS
    })

    return token;
}