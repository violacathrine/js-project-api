import express from "express";
import { body } from "express-validator";
import { verifyToken, optionalAuth } from "../middleware/auth.js";
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

// Create thought (public - anyone can post, but we check for optional auth)
router.post(
  "/",
  optionalAuth,
  [
    body("message")
      .isString()
      .isLength({ min: 5, max: 140 })
      .withMessage("Message must be 5–140 characters."),
  ],
  createThought
);

// Like/Unlike a thought (public - anyone can like)
router.patch("/:id/like", optionalAuth, likeThought);
router.patch("/:id/unlike", optionalAuth, unlikeThought);

// --- SECURED ROUTES ---

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

export default router;
