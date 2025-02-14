import jwt from "jsonwebtoken";
import { Grievance } from "../models/grievance.model.js";

export const isAuthenticatePhone = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token;

        if (!token) return res.status(401).json({ errorMessage: "USER NOT AUTHENTICATED", success: false });

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) return res.status(401).json({ errorMessage: "INVALID TOKEN", success: false });

        const currentgrievance = await Grievance.findById(decode.id);

        if (!currentgrievance) return res.status(401).json({
            errorMessage: "USER BELONGING TO THIS TOKEN DOES NOT EXIST",
            success: false
        });

        req.body.grievance = currentgrievance;

        next();

    } catch (error) {
        console.error({
            error,
            success: false
        });
    }
}



export const isAuthenticateCitizen = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token;

        if (!token) return res.status(401).json({ errorMessage: "USER NOT AUTHENTICATED", success: false });

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) return res.status(401).json({ errorMessage: "INVALID TOKEN", success: false });

        const currentgrievance = await Grievance.findById(decode.id);

        if (!currentgrievance) return res.status(401).json({
            errorMessage: "USER BELONGING TO THIS TOKEN DOES NOT EXIST",
            success: false
        });
        const grievances = await Grievance.find({
            "contact": currentgrievance.contact // From OTP-verified token
        }).sort({ createdAt: -1 });

        console.log(grievances);

        if (grievances.length === 0) {
            return res.status(404).json({
                error: "No grievances found",
                success: false
            });
        }
        req.body.grievance = currentgrievance;
        req.body.grievances = grievances;
        console.log(currentgrievance);
        next();

    } catch (error) {
        console.error({
            error,
            success: false
        });
    }
};