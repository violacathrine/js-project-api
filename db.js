// db.js
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1); // Avsluta appen om anslutning misslyckas
  }
};
