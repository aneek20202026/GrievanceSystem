import mongoose from "mongoose";
import validator from "validator";

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Invalid email"]
    },
    typedpassword: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }, // Hashed with bcrypt
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v===this.typedpassword;
            },
            message: "Password mismatch"
        },
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
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "official"],
        default: "official"
    },
    profile: {
        profilephoto: {
            type: String,
            default: ""
        }
    },
    department: {
        type: String,
        enum: ["NULL","SOLID_WASTE","ADMINISTRATIVE","SANITATION","SEWERAGE","ELECTRICITY","STRAY_ANIMALS","WATER","VIOLENCE","NOISE_POLLUTION","STREET_LIGHTING","INFRASTRUCTURE","HEALTH"],
        default: "NULL"
    },
    district: {
        type: String,
        enum: [
            "null",
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
        ],
        default: "null"
    },
    assignedGrievances: [
        {
            grievanceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Grievance"
            },
            status: {
                type: String,
                enum: ["in_progress", "resolved"]
            }
        }
    ]
},
    { timestamps: true }
);
export const User = mongoose.model('User', userSchema);
