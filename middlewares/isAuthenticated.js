import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token;

        if (!token) return res.status(401).json({ errorMessage: "USER NOT AUTHENTICATED", success: false });

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) return res.status(401).json({ errorMessage: "INVALID TOKEN", success: false });

        const currentuser = await User.findById(decode.id);

        if (!currentuser) return res.status(401).json({
            errorMessage: "USER BELONGING TO THIS TOKEN DOES NOT EXIST",
            success: false
        });

        req.body.user = currentuser;

        next();

    } catch (error) {
        console.error({
            error,
            success: false
        });
    }
};

export const isAuthenticatedForGrievance = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                errorMessage: "USER NOT AUTHENTICATED",
                success: false
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                errorMessage: "INVALID TOKEN",
                success: false
            });
        }

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                errorMessage: "USER BELONGING TO THIS TOKEN DOES NOT EXIST",
                success: false
            });
        }

        req.user = currentUser;
        next();

    } catch (error) {
        console.error("User not authenticated:", error);
        return res.status(500).json({
            errorMessage: "Internal Server Error",
            success: false
        });
    }
};
