import { Thought } from "../models/Thought.js";
import { validationResult } from "express-validator";

// Get all thoughts with optional filters and pagination
export const getThoughts = async (req, res) => {
  const { message, minHearts, sort, page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (message) {
      query.message = { $regex: new RegExp(message, "i") };
    }
    if (minHearts) {
      query.hearts = { $gte: Number(minHearts) };
    }

    let thoughtsQuery = Thought.find(query);
    if (sort === "most-liked") {
      thoughtsQuery = thoughtsQuery.sort({ hearts: -1 });
    } else if (sort === "least-liked") {
      thoughtsQuery = thoughtsQuery.sort({ hearts: 1 });
    }

    const total = await Thought.countDocuments(query);
    const results = await thoughtsQuery
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (results.length === 0) {
      return res.status(404).json({ message: "No thoughts found." });
    }

    res.json({ page: Number(page), limit: Number(limit), total, results });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error });
  }
};

// Get a single thought by ID
export const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID", details: error });
  }
};

// Create a new thought
export const createThought = async (req, res) => {
  // Valideringssteg
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { message, category } = req.body;
    const newThought = new Thought({ message, category });
    await newThought.save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ error: "Could not create thought", details: error });
  }
};

// Update an existing thought
export const updateThought = async (req, res) => {
  // Valideringssteg
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { message, hearts, category } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { message, hearts, category },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ error: "Invalid update", details: error });
  }
};

// Delete a thought
export const deleteThought = async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json({ message: "Thought deleted successfully", deletedThought });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID", details: error });
  }
};

// Like a thought
export const likeThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ error: "Failed to like thought", details: error });
  }
};

// Unlike a thought
export const unlikeThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    thought.hearts = Math.max(thought.hearts - 1, 0);
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: "Failed to unlike", details: error });
  }
};
