import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  PhoneNumber: {
    type: Number,
    unique: true,
    required: true,
  },

  Password: {
    type: String,
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
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;