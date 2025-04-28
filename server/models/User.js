import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    PhoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
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

const User = mongoose.model('User', UserSchema);
export default User;
