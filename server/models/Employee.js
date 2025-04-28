import mongoose from "mongoose"

const EmployeeSchema = new mongoose.Schema({
    PhoneNumber: {
        type: Number,
        required: true,
    },
    Organization: {
        type: String,
        enum: ["Hospital", "DSP", "Municipal (ASP) levels"],
        required: true,
    },
    FullName: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        enum: ["Admin", "SuperAdmin", "Employee"],
        required: true,
        default: "Employee",
    }
})
module.exports = mongoose.model('Employee', EmployeeSchema)