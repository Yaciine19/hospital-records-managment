import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './config/db.js';
import authRoute from "./routes/authRoute.js";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1/auth', authRoute);

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
