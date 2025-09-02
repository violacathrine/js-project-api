import { Thought } from "../models/Thought.js";
import { validationResult } from "express-validator";

// GET /thoughts
export const getThoughts = async (req, res) => {
  const { message, minHearts, sort, page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (message) query.message = { $regex: new RegExp(message, "i") };
    if (minHearts) query.hearts = { $gte: Number(minHearts) };

    // inkludera user‐fältet så frontend ser ägaren
    let thoughtsQuery = Thought.find(query).select(
      "message hearts createdAt user"
    );
    if (sort === "most-liked")
      thoughtsQuery = thoughtsQuery.sort({ hearts: -1 });
    else if (sort === "least-liked")
      thoughtsQuery = thoughtsQuery.sort({ hearts: 1 });

    const total = await Thought.countDocuments(query);
    const results = await thoughtsQuery
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ page: Number(page), limit: Number(limit), total, results });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error });
  }
};

// GET /thoughts/:id
export const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).select(
      "message hearts createdAt user"
    );
    if (!thought) return res.status(404).json({ error: "Thought not found" });
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID", details: error });
  }
};

// POST /thoughts
export const createThought = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { message } = req.body;
    const newThought = new Thought({
      message,
      // If user is logged in (req.user exists), save their ID, otherwise null for anonymous
      user: req.user?.id || null,
    });
    await newThought.save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ error: "Could not create thought", details: error });
  }
};

// PATCH /thoughts/:id
export const updateThought = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const { message } = req.body;
    const thought = await Thought.findById(id);
    if (!thought) return res.status(404).json({ error: "Thought not found" });

    // ägarskapskontroll
    if (!thought.user.equals(req.user.id)) {
      return res
        .status(403)
        .json({ error: "You can only update your own thoughts" });
    }

    thought.message = message;
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: "Invalid update", details: error });
  }
};

// DELETE /thoughts/:id
export const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ error: "Thought not found" });

    // ägarskapskontroll
    if (!thought.user.equals(req.user.id)) {
      return res
        .status(403)
        .json({ error: "You can only delete your own thoughts" });
    }

    await thought.deleteOne();
    res.json({ message: "Thought deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID", details: error });
  }
};

// PATCH /thoughts/:id/like
export const likeThought = async (req, res) => {
  try {
    const updated = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Thought not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to like thought", details: error });
  }
};

// PATCH /thoughts/:id/unlike
export const unlikeThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ error: "Thought not found" });
    thought.hearts = Math.max(thought.hearts - 1, 0);
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: "Failed to unlike thought", details: error });
  }
};
