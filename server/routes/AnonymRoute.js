import { Router } from "express";
import {
  getAnonyms,
  getAnonymById,
  deleteAnonym,
  updateAnonym,
} from "../controllers/AnonymController.js";

const AnonymRoute = Router();

AnonymRoute.get("/api/anonym", getAnonyms);
AnonymRoute.get("/api/anonym/:id", getAnonymById);
AnonymRoute.delete("/api/anonym/:id", deleteAnonym);
AnonymRoute.put("/api/anonym/:id", updateAnonym);

export default AnonymRoute;
