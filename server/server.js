import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './config/db.js';

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log('database connected');
    console.log(`server running ${PORT}`);
  }
  catch (err) {
    console.log(err.message);
  }
});
