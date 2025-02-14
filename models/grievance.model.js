import mongoose from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js"; // Import the library

//define the grievance schema
const grievanceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 4,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 4,
            maxlength: 200,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved", "rejected", "escalated"],
            default: "pending"
        },
        category: {
            type: String,
            enum: ["NULL","SOLID_WASTE","ADMINISTRATIVE","SANITATION","SEWERAGE","ELECTRICITY","STRAY_ANIMALS","WATER","VIOLENCE","NOISE_POLLUTION","STREET_LIGHTING","INFRASTRUCTURE","HEALTH"],
            trim: true,

            
        }, // Auto-classified by AI (e.g., "Healthcare")
        subCategory: {
            type: String,
            trim: true,
        }, // Auto-classified (e.g., "Water Supply")
        district: {
            type: String,
            required: true,
            enum: [
                "Agra",
                "Aligarh",
                "Ambedkar Nagar",
                "Amethi",
                "Amroha",
                "Auraiya",
                "Azamgarh",
                "Baghpat",
                "Bahraich",
                "Ballia",
                "Balrampur",
                "Banda",
                "Barabanki",
                "Bareilly",
                "Budaun",
                "Basti",
                "Bhadohi",
                "Bijnor",
                "Bulandshahr",
                "Chandauli",
                "Chitrakoot",
                "Deoria",
                "Etah",
                "Etawah",
                "Faizabad",
                "Farrukhabad",
                "Fatehpur",
                "Prayagraj",
                "Gautam Buddha Nagar",
                "Ghaziabad",
                "Ghazipur",
                "Gonda",
                "Gorakhpur",
                "Hamirpur",
                "Hapur",
                "Hardoi",
                "Hathras",
                "Jalaun",
                "Jaunpur",
                "Jhansi",
                "Kannauj",
                "Kanpur Dehat",
                "Kanpur Nagar",
                "Kasganj",
                "Kaushambi",
                "Kushinagar",
                "Kheri",
                "Lalitpur",
                "Lucknow",
                "Maharajganj",
                "Mahoba",
                "Mainpuri",
                "Mathura",
                "Mau",
                "Meerut",
                "Mirzapur",
                "Moradabad",
                "Muzaffarnagar",
                "Pilibhit",
                "Pratapgarh",
                "Raebareli",
                "Rampur",
                "Saharanpur",
                "Samastipur",
                "Sant Kabir Nagar",
                "Shahjahanpur",
                "Shamli",
                "Shravasti",
                "Siddharthnagar",
                "Sitapur",
                "Sonbhadra",
                "Sultanpur",
                "Unnao",
                "Varanasi",
                "Ayodhya",
                "Maha kumbh area of Prayagraj",
            ] // UP districts
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Govt. officer responsible
            index: true // Add index for better performance
        },
        attachments: [String], // URLs to images/files (Cloudinary/Firebase)
        contact: {
            type: String,
            required: true, // Email/phone for tracking
            validate: {
                validator: (v) => isValidPhoneNumber(v,'IN'), // Validate format
                message: "Invalid email/phone"
            },
            index: false // Explicitly disable automatic indexing
        },
        isverified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },
        aiAnalysis: {
            sentiment: {
                type: String,
                enum: ["","positive", "neutral", "negative"],
                default: ""
            },
            urgency: {
                type: Number,
                default: 0
            },
            keywords: [String], // NLP-extracted (e.g., ["road repair", "electricity"])
            predictedResolutionTime: Date // From predictive analytics
        },
        resolutionSteps: [{
            step: String, // AI-suggested steps (e.g., "Inspect site")
            completed: { type: Boolean, default: false }
        }],
        resolutionDate: {
            type: Date
        }, // Set when resolved
        expireAt: { type: Date, default: null }
    },
    { timestamps: true } // Auto-generates "createdAt" and "updatedAt"
);

// Create a TTL index on the expireAt field.
// When expireAt is reached, the document will be deleted.
grievanceSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const Grievance = mongoose.model('Grievance', grievanceSchema);
