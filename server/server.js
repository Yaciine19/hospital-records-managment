import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import EmployeeRoute from './routes/EmployeeRoute.js';
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/', EmployeeRoute);



app.listen(PORT, async () => {
  try {
    console.log(`server running ${PORT}`);
    await connectDB();
  }
  catch (err) {
    console.log(err.message);
  }
});
