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

// --- PUBLIC ROUTES ---
router.get("/", getThoughts);
router.get("/:id", getThoughtById);

// --- SECURED ROUTES ---
// Create thought
router.post(
  "/",
  verifyToken,
  [
    body("message")
      .isString()
      .isLength({ min: 5, max: 140 })
      .withMessage("Message must be 5–140 characters."),
  ],
  createThought
);

// Update a thought
router.patch(
  "/:id",
  verifyToken,
  [
    body("message")
      .optional()
      .isString()
      .isLength({ min: 5, max: 140 })
      .withMessage("Message (if set) must be 5–140 characters."),
    body("hearts")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Hearts must be a whole number ≥ 0."),
  ],
  updateThought
);

// Delete a thought
router.delete("/:id", verifyToken, deleteThought);

// Like/Unlike a thought
router.patch("/:id/like", verifyToken, likeThought);
router.patch("/:id/unlike", verifyToken, unlikeThought);

export default router;
