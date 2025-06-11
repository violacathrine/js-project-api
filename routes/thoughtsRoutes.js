import express from "express";
import {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
} from "../controllers/thoughtsController.js";

const router = express.Router();

router.get("/", getThoughts);
router.get("/:id", getThoughtById);
router.post("/", createThought);
router.patch("/:id", updateThought);
router.delete("/:id", deleteThought);

export default router;
