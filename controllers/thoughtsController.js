import { Thought } from "../models/Thought.js";

export const getThoughts = async (req, res) => {
  const { message, minHearts, sort, page = 1, limit = 10 } = req.query;
  try {
    let query = {};

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
  const { id } = req.params;
  const { message, hearts, category } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { message, hearts, category },
      { new: true, runValidators: true } // returnera det uppdaterade dokumentet
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
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(id);

    if (!deletedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.json({ message: "Thought deleted successfully", deletedThought });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID", details: error });
  }
};
