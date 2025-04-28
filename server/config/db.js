import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

// Function to connect to MongoDB
export const connectDB = async () => {
    // Check if already connected to MongoDB
    if (isConnected) return;

    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process with a failure code
    }
};

// Function to disconnect from MongoDB
export const disconnectDB = async () => {
    // Check if already disconnected
    if (!isConnected) return;

    try {
        // Attempt to disconnect from MongoDB
        await mongoose.disconnect();
        isConnected = false;
        console.log("MongoDB disconnected successfully");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
    }
};
