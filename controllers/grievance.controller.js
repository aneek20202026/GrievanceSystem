//grievance.controller.js
import { Grievance } from "../models/grievance.model.js";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import axios from "axios";
import twilio from 'twilio';
const accountSid = "ACaf5f1eff73cc8d2956afe7d0eeba320c";
const authToken = "feffa0a482f3342cc48570db02ac44b9";
const client = new twilio(accountSid, authToken);
// if (!accountSid || !authToken) {
//     throw new Error('Twilio credentials not found in environment variables');
// }

const signToken = (id) => {
  // Generate JWT with role
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

const sendToken = (grievance, statusCode, res, message) => {
  const token = signToken(grievance._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
  };

  res.cookie("token", token, cookieOptions);
  grievance.otp = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    grievance,
  });
};

const sendCitizenToken = (grievance, grievances, statusCode, res, message) => {
  const token = signToken(grievance._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
  };

  res.cookie("token", token, cookieOptions);
  grievance.otp = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    grievance,
    grievances
  });
};


// Verify OTP for grievance tracking
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        error,
        success: false
      });
    }

    const grievance = req.body.grievance;

    if (grievance.otp !== otp || grievance.otpExpires < Date.now()) {
      return res.status(400).json({
        error: "Invalid OTP OR OTP HAS EXPIRED",
        success: false
      });
    }

    grievance.isverified = true;
    grievance.otp = null;
    grievance.otpExpires = null;
    grievance.expireAt = null; // Remove expiration so it is not deleted.

    await grievance.save({ validateBeforeSave: false });
    const io = req.app.get("io");

    io.emit("newGrievance", grievance);
    sendToken(grievance, 200, res, "Grievance verified successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false
    });
  }

};

// Verify OTP for grievance tracking
export const verifyCitizenOTP = async (req, res) => {
  try {
    const { otp } = req.body.grievance;
    if (!otp) {
      return res.status(400).json({
        error: "OTP IS MISSING",
        success: false
      });
    }

    const grievance = req.body.grievance;
    const grievances = req.body.grievances;

    if (grievance.otp !== otp || grievance.otpExpires < Date.now()) {
      return res.status(400).json({
        error: "Invalid OTP OR OTP HAS EXPIRED",
        success: false
      });
    }

    grievance.isverified = true;
    grievance.otp = null;
    grievance.otpExpires = null;

    await grievance.save({ validateBeforeSave: false });

    sendCitizenToken(grievance, grievances, 200, res, "Grievance verified successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false
    });
  }

};

// Submit grievance (public endpoint)
export const submitGrievance = async (req, res) => {

  try {
    const { title, description, district, contact } = req.body;
    let aires;
    try {
      // Step 1: Call AI service for analysis
      aires = await axios.post("http://localhost:8000/api/v1/airesponse/urgent", {
        description: description
      });

    } catch (error) {
      console.log(error)
    }
    console.log(aires.data);

    const category = (aires?.data?.data?.categories && aires.data.data.categories.length > 0)
      ? aires.data.data.categories[0]
      : "NULL";


    const OTP = generateOTP();
    const otpExpires = new Date(Date.now() + 900000); // 15 minutes

    const grievance = await Grievance.create({
      title: title,
      description: description,
      category: category,
      district: district,
      contact: contact,
      otp: OTP,
      otpExpires,
      aiAnalysis: {
        urgency: aires.data.data.urgency
      }
    });
    // Set expireAt only if isverified is false.
    if (!grievance.isverified) {
      // Set expiration for 24 hours from now.
      grievance.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    try {
      await client.messages.create({
        body: `Your OTP for grievance tracking is ${OTP}`,
        messagingServiceSid: "MG29ab38ce7bd1d08ab1135f35f03b02f1",
        to: `+91${contact}`,
      });

      sendToken(grievance, 201, res, "Please verify otp");

    } catch (error) {
      await Grievance.findByIdAndDelete(grievance.id);
      console.log(error);
      res.status(500).json({
        error,
        success: false
      });
    }

  } catch (error) {
    res.status(500).json({
      error,
      success: false
    });
  }
};

export const getCitizenContact = async (req, res) => {

  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({
        error: "Contact number is missing",
        success: false
      });
    }

    const OTP = generateOTP();
    const otpExpires = new Date(Date.now() + 900000); // 15 minutes


    const grievance = await Grievance.findOne({
      contact: contact,
      otpExpires: null
    }).sort({ createdAt: -1 });
    const grievances = [];

    grievance.otp = OTP;
    grievance.otpExpires = otpExpires;
    grievance.isverified = false;
    await grievance.save({ validateBeforeSave: false });

    console.log(grievance);
    console.log(grievances);

    if (!grievance) {
      return res.status(404).json({
        error: "No grievance found for this contact number",
        success: false
      });
    }

    try {
      await client.messages.create({
        body: `Your OTP for grievance tracking is ${OTP}`,
        messagingServiceSid: "MG29ab38ce7bd1d08ab1135f35f03b02f1",
        to: `+91${contact}`,
      });

      sendCitizenToken(grievance, grievances, 201, res, "Please verify otp");

    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
        success: false
      });
    }

  } catch (error) {
    res.status(500).json({
      error,
      success: false
    });
  }
};


// // Get grievance by tracking ID (public)
// export const getGrievanceByTrackingId = async (req, res) => {
//   try {
//     const grievance = await Grievance.findOne({
//       trackingId: req.params.trackingId
//     });
//     res.status(200).json(grievance);
//   } catch (error) {
//     res.status(404).json({ error: "Grievance not found" });
//   }
// };


// Get all grievances assigned to the logged-in official

export const getAssignedGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({
      assignedTo: req.body.userId, // JWT contains userId
      status: { $in: ["pending", "in_progress"] }
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
};

// Update grievance status (official only + must be assigned)
export const updateGrievanceStatus = async (req, res) => {
  console.log("updateGrievanceStatus called:", req.params.id, req.body);
  try {
    const { status } = req.body;
    const grievance = await Grievance.findOne({
      _id: req.params.id,
    });
    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: "Grievance not found or unauthorized"
      });
    }
    grievance.status = status;
    if (status === "resolved") {
      grievance.resolutionDate = Date.now();
    }
    await grievance.save();
    const io = req.app.get("io");
    if (io) {
      io.emit("updateGrievance", grievance);
    }
    res.status(200).json({
      success: true,
      message: "Grievance status updated successfully",
      grievance
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: "Update failed"
    });
  }
};

