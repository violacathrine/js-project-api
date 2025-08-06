import express from "express";
import { body } from "express-validator";
import { verifyToken } from "../middleware/auth.js";
import {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  likeThought,
  unlikeThought,
} from "../controllers/thoughtsController.js";

const router = express.Router();

// --- PUBLIKA ROUTES ---
router.get("/", getThoughts);
router.get("/:id", getThoughtById);

// --- SKYDDADE ROUTES ---
// Skapa tanke
router.post(
  "/",
  verifyToken,
  [
    body("message")
      .isString()
      .isLength({ min: 5, max: 140 })
      .withMessage("Meddelandet måste vara mellan 5 och 140 tecken."),
    // Ta bort kategori om du inte vill ha det:
    body("category")
      .optional()
      .isIn(["Food", "Work", "Life", "Other"])
      .withMessage("Ogiltig kategori."),
  ],
  createThought
);

// Uppdatera tanke
router.patch(
  "/:id",
  verifyToken,
  [
    body("message")
      .optional()
      .isString()
      .isLength({ min: 5, max: 140 })
      .withMessage("Meddelandet (om satt) måste vara 5–140 tecken."),
    body("hearts")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Hearts måste vara ett heltal ≥ 0."),
    body("category")
      .optional()
      .isIn(["Food", "Work", "Life", "Other"])
      .withMessage("Ogiltig kategori."),
  ],
  updateThought
);

// Radera tanke
router.delete("/:id", verifyToken, deleteThought);

// Gilla/ogilla tanke
router.patch("/:id/like", verifyToken, likeThought);
router.patch("/:id/unlike", verifyToken, unlikeThought);

export default router;
