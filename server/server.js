import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const PORT = 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});
