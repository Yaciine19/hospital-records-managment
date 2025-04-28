import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import RecordRoute from './routes/RecordRoute.js';
import UserRoute from './routes/UserRoute.js';
import bodyParser from "body-parser";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// app.use('/', RecordRoute);
app.use('/', UserRoute);



app.listen(PORT, async () => {
  try {
    console.log(`server running ${PORT}`);
  }
  catch (err) {
    console.log(err.message);
  }
});
