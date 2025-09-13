import mongoose from "mongoose";

export default async function connectDB() {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {});
    console.log("MongoDB Connected");
}