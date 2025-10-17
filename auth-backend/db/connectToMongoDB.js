import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    throw error; // Re-throw the error so the server doesn't start if DB connection fails
  }
};
export default connectToMongoDB;
