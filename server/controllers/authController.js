import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Employee from "../models/Employee.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/v1/auth/register
// @access Private (Admin only)
export const registerUser = async (req, res) => {
    try {
      const { PhoneNumber, Password, Organization, FullName, Role } = req.body;
  
      const userExists = await Employee.findOne({ PhoneNumber });
  
      if (userExists) {
        return res.status(400).json({ message: "User already exsits" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);
  
      const newUser = await Employee.create({
        PhoneNumber,
        Password: hashedPassword,
        Organization,
        FullName,
        Role,
      });
  
      res.status(201).json({
        success: true,
        user: newUser,
        token: generateToken(newUser._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
      console.log(error)
    }
  };
  
  // @desc Login user
  // @route POST /api/v1/auth/login
  // @access Public
  export const loginUser = async (req, res) => {
    try {
      const { PhoneNumber, Password } = req.body;
  
      const user = await Employee.findOne({ PhoneNumber });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      res.status(200).json({
        _id: user._id,
        FullName: user.FullName,
        PhoneNumber: user.PhoneNumber,
        Role: user.Role,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };