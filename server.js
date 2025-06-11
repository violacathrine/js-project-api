import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import { connectToDatabase } from "./db.js"; // import connection
import thoughtsRoutes from "./routes/thoughtsRoutes.js";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints,
  });
});

app.use("/thoughts", thoughtsRoutes);

//  connect to mongoDB then start server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
