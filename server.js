import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import data from "./data/data.json";

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// GET / -> API-documentation
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints: endpoints,
  });
});

// endpoint for getting all thoughts
app.get("/thoughts", (req, res) => {
  const { message, minHearts } = req.query;
  let filteredThoughts = data;

  if (message) {
    filteredThoughts = filteredThoughts.filter(
      (thought) => thought.message.toLowerCase().includes(message.toLowerCase())
    );
  }

  if (minHearts) {
    filteredThoughts = filteredThoughts.filter((thought) =>
      thought.hearts >= Number (minHearts)
    );
  }

  res.json(filteredThoughts);
});

// endpoint for gettin one thought
app.get("/thoughts/:id", (req, res) => {
  const thought = data.find((thought) => thought._id === req.params.id);

  // tiny error handling if we get an id that doesnt exist in our data
  if (!thought) {
    return res.status(404).json({ error: "Thought not found" });
  }

  res.json(thought);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
