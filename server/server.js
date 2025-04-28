import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import RecordRoute from './routes/RecordRoute.js';
import UserRoute from './routes/UserRoute.js'
import Events from './routes/eventStream.js'
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import AnonymRoute from "./routes/AnonymRoute.js";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use(authRoute);
app.use(Events)
app.use(RecordRoute);
app.use(UserRoute);
app.use(AnonymRoute)

app.listen(PORT, async () => {
  try {
    await connectDB()
      console.log(`server running ${PORT}`);
  }
  catch (err) {
    console.log(err.message);
  }
});
