import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import EmployeeRoute from './routes/EmployeeRoute.js';
import bodyParser from "body-parser";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/api/v1/auth', authRoute);
app.use('/', EmployeeRoute);

app.listen(PORT, async () => {
  try {
    console.log(`server running ${PORT}`);
  }
  catch (err) {
    console.log(err.message);
  }
});
