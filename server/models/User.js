import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    PhoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
        unique: true
    },
    Organization: {
        type: String,
        enum: ["Hospital", "DSP", "Municipal"],
        required: true,
    },
    FullName: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        enum: ["Admin", "SuperAdmin", "User"],
        required: true,
        default: "User",
    }
});

export const User = mongoose.model('User', UserSchema);
