import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  pdf: { type: String, required: true },   // Cloudinary URL
  description: String,
  author: String,
  category: String,
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
