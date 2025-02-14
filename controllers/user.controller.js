import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import { sendEmail } from "../utils/email.js";
import { Grievance } from "../models/grievance.model.js";

const signToken = (id) => {
    // Generate JWT with role
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const sendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //only secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
    };

    res.cookie("token", token, cookieOptions);
    user.otp = undefined;

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user
    });
};

export const verifyAccount = async (req, res, next) => {
    try {
        const { otp } = req.body.user;

        if (!otp) {
            return res.status(400).json({
                error: "OTP IS MISSING",
                success: false
            });
        }

        const user = req.body.user;

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                error: "Invalid OTP OR OTP HAS EXPIRED",
                success: false
            });
        }

        user.isverified = true;
        user.otp = null;
        user.otpExpires = null;

        await user.save({ validateBeforeSave: false });

        sendToken(user, 200, res, "Verification successfull");
    } catch (error) {
        res.status(500).json({ error: "Account verification failed" });
    }
};

// Register user (admin-only)
export const registerUser = async (req, res) => {
    try {
        const { name, email, typedpassword, password, role } = req.body;

        if (!name || !email || !typedpassword || !password || !role) {
            return res.status(400).json({
                error,
                message: "Something is missing",
                success: false
            });
        }

        if (typedpassword != password) {
            return res.status(400).json({
                error,
                message: "Passwords are not matching",
                success: false
            });
        }

        // Check if admin
        if (req.body.role != "admin") {
            return res.status(403).json({
                error,
                message: "Admin access required",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error,
                message: "User already exists",
                success: false
            });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 900000); // 15 minutes

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            typedpassword: hashedPassword,
            password: hashedPassword,
            otp,
            otpExpires,
            role
        });

        // Send OTP to user email
        try {
            console.log("Sending OTP email to:", user.email);

            const sendmail = await sendEmail({
                email: user.email,
                subject: "OTP for Email Verification",
                html: `<h3>Your OTP is ${user.otp}. It expires in 15 minutes.</h3>`
            });

            sendToken(user, 201, res, "Please verify your otp sent to your email");

        } catch (error) {
            await User.findByIdAndDelete(user.id);  // Delete user if email fails
            return res.status(500).json({
                error,
                message: "Error sending email verification OTP",
                success: false
            });
        }

    } catch (error) {
        res.status(400).json({
            error,
            message: "User registration failed",
            success: false
        });
    }
};

// Register a new govt. official
export const registerOfficial = async (req, res) => {
    try {

        const { name, email, typedpassword, password, role, department, district } = req.body;

        if (!name || !email || !typedpassword || !role || !password || !department || !district) {
            return res.status(400).json({
                error,
                message: "Somthing is missing",
                success: false
            });
        }

        if (typedpassword != password) {
            return res.status(400).json({
                error,
                message: "Passwords are not matching",
                success: false
            });
        }

        // Check if official already exists
        const existingOfficial = await User.findOne({ email });

        if (existingOfficial) {
            return res.status(400).json({
                error,
                message: "Official already exists",
                success: false
            });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 900000); // 15 minutes

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const official = await User.create({
            name,
            email,
            typedpassword: hashedPassword,
            password: hashedPassword,
            otp,
            otpExpires,
            role: "official",
            department,
            district
        });

        // Send OTP to user email
        try {
            console.log("Sending OTP email to:", official.email);

            const sendmail = await sendEmail({
                email: official.email,
                subject: "OTP for official registration",
                html: `<h3>Your OTP is ${official.otp}. It expires in 15 minutes.</h3>`
            });

            console.log("Email send function response:", sendmail);
        } catch (error) {
            console.error("Error sending email:", error);
            await User.findByIdAndDelete(official.id);  // Delete user if email fails
            return res.status(500).json({
                error,
                message: "Error sending email verification OTP",
                success: false
            });
        }

        sendToken(official, 201, res, "Please verify your otp sent to your email");

    } catch (error) {
        res.status(400).json({
            error,
            message: "User registration failed",
            success: false
        });
    }
};

// Login for Admins
export const loginAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                error,
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error,
                message: "Incorrect email or password",
                success: false
            });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 900000); // 15 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        user.isverified = false;

        console.log(user);

        try {
            await user.save({ validateBeforeSave: false });
        } catch (error) {
            console.log(error);
        }

        // Send OTP to user email
        try {
            console.log("Sending OTP email to:", user.email);

            const sendmail = await sendEmail({
                email: user.email,
                subject: "OTP for admin login",
                html: `<h1>Your OTP is ${user.otp}. It expires in 15 minutes.</h1>`
            });
            console.log("Email send function response:", sendmail);

            sendToken(user, 201, res, "Please Verify your otp");
        } catch (error) {
            console.error("Error sending email:", error);

            return res.status(500).json({
                error,
                message: "Error sending email verification OTP",
                success: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Login failed",
            success: false
        });
    }
};

// Login for officials
export const loginOfficial = async (req, res) => {
    try {
        const { email, password, role, district } = req.body;

        if (!email || !password || !role || !district) {
            return res.status(400).json({
                error,
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error,
                message: "Incorrect email or password",
                success: false
            });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 900000); // 15 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        user.isverified = false;

        console.log(user);

        try {
            await user.save({ validateBeforeSave: false });
        } catch (error) {
            console.log(error);
        }

        // Send OTP to user email
        try {
            console.log("Sending OTP email to:", user.email);

            const sendmail = await sendEmail({
                email: user.email,
                subject: "OTP for official login",
                html: `<h3>Your OTP is ${user.otp}. It expires in 15 minutes.</h3>`
            });
            console.log("Email send function response:", sendmail);

            sendToken(user, 201, res, "Please Verify your otp");
        } catch (error) {

            console.error("Error sending email:", error);
            return res.status(500).json({
                error,
                message: "Error sending email verification OTP",
                success: false
            });
        }

    } catch (error) {
        res.status(500).json({
            error,
            message: "Login failed",
            success: false
        });
    }
};

// Logout
export const Logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: "Logout failed",
            success: false
        });
    }
};

// Update profile
// export const updateProfile = async (req, res) => {
//     try {
//         const { name, email, password, department, district } = req.body;

//         if (!name || !email || !password || !department || !district) {
//             return res.status(400).json({
//                 error: "SOMETHING IS MISSING",
//                 success: false
//             });
//         }
//         const userid = req.id; //middleware to get user id
//         let user = await User.findById(userid);

//         if (!user) {
//             return res.status(404).json({ error: "User not found", success: false });
//         }

//         user.name = name;
//         user.email = email;
//         user.department = department;
//         user.district = district;

//         if (newPassword) {
//             user.password = await bcrypt.hash(newPassword, 12);
//         }

//         await official.save();

//         user = {
//             userId: user._id,
//             role: user.role,
//             department: user.department,
//             district: user.district
//         };

//         return res.status(200).json({
//             message: "Profile updated",
//             user,
//             success: true
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Profile update failed" });
//     }
// };

export const grievanceforofficial = async (req, res) => {
    try {

        const { district, department } = req.user;
        if (!district || !department) {
            return res.status(400).json({
                message: "Error in fetching grievance district or department",
                success: false
            });
        }

        // Query the database for grievances that match the district and department
        const grievances = await Grievance.find({
            district: district,
        })

  
        const token = signToken(req.user._id);

        const cookieOptions = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
        };

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message:"Here is your grievances",
            token,
            grievances
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            error,
            success: false
        })
    }
};

export const getAllGrievances = async (req, res) => {
    try {
        const { role } = req.user;
        if (!role) {
            return res.status(400).json({
                message: "Error in fetching grievance",
                success: false
            });
        }

        // Query the database for grievances that match the district and department
        const grievances = await Grievance.find({ })

  
        const token = signToken(req.user._id);

        const cookieOptions = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
        };

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message:"Here is your grievances",
            token,
            grievances
        });

    } catch (error) {
      console.log("Error fetching all grievances:", error);
      res.status(500).json({
        error: "Failed to fetch grievances",
        success: false
      });
    }
  };
  