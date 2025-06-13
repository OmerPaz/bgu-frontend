import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const mongoUrl = process.env.MONGODB_CONNECTION_URL;
if (!mongoUrl) {
  throw new Error("MONGODB_CONNECTION_URL not defined");
}

export const connectMongo = async () => {
  try {
    await mongoose.connect(mongoUrl); // No options needed in modern Mongoose
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};