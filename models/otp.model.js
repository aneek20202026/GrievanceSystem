import mongoose from "mongoose";

// Define the OTP schema
const otpSchema = new mongoose.Schema({
    contact: { type: String, required: true }, // Email/phone from grievance
    otp: { type: String, required: true }, // 6-digit code
    expiresAt: { type: Date, default: Date.now() + 5*60*1000 }, // 5-minute expiry
    used: { type: Boolean, default: false }
  });
  
  // Auto-delete expired OTPs
  otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    
  export const OTP = mongoose.model('OTP', otpSchema);