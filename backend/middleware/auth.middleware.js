import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


export const protectRoute = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
            }
            throw error;
        }
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}