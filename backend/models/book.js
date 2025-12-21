import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, default: "Guest" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  pdf: { type: String, required: true },   // Cloudinary URL
  description: { type: String },
  author: { type: String },
  category: { type: String },
  semester: { type: String },
  linkedin: { type: String },
  
  // New fields for Social Features
  likes: { 
    type: Number, 
    default: 0 
  },
  comments: [commentSchema] // Array of comment objects
  
}, { timestamps: true });

// Optional: Add an index for faster searching by category
bookSchema.index({ category: 1 });

export default mongoose.model("Book", bookSchema);