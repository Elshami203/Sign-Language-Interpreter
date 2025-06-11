import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(); // Initialize the database object
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export { connectDB, client };
export default () => {
  if (!db) {
    console.error("Database not initialized. Call connectDB() first.");
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  console.log("Database object accessed successfully");
  return db;
};