import Book from "./models/book.js";
import { cloudinary } from "./coludinary.js";

// --- Original Add Book Logic ---
const addBook = async (req, res) => {
  try {
    const { name, image, pdf, description, author, category, semester,linkedin} = req.body;
    
    let imageSecureUrl = null;
    if (image) {
      const imageResult = await cloudinary.uploader.upload(image, { folder: "books/images" });
      imageSecureUrl = imageResult.secure_url;
    }

    let pdfSecureUrl = null;
    if (pdf) {
      const pdfResult = await cloudinary.uploader.upload(pdf, {
        folder: "books/pdfs",
        resource_type: "raw", 
      });
      pdfSecureUrl = pdfResult.secure_url;
    }

    const newBook = new Book({
      name,
      image: imageSecureUrl,
      pdf: pdfSecureUrl,
      description,
      author,
      category,
      semester,
      linkedin,
      likes: 0,    // Initialize social fields
      comments: []
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully", book: newBook });
  } catch (error) {
    console.error("❌ Error adding book:", error.message);
    res.status(500).json({ message: "Server Error: Failed to process book upload." });
  }
};

// --- New Like Logic ---
const addLike = async (req, res) => {
  try {
    const { bookid } = req.params;
    const { liked } = req.body; // Expects a boolean: true to like, false to unlike

    // Use $inc to atomically increment or decrement
    const increment = liked ? 1 : -1;

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      { $inc: { likes: increment } },
      { new: true } // returns the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ likes: updatedBook.likes });
  } catch (error) {
    res.status(500).json({ message: "Error updating likes", error: error.message });
  }
};

// --- New Comment Logic ---
const addComment = async (req, res) => {
  try {
    const { bookid } = req.params;
    const { text, user } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = {
      text,
      user: user || "Guest",
      timestamp: new Date()
    };

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      { $push: { comments: { $each: [newComment], $position: 0 } } }, // Adds new comment to the top
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Return the specific comment that was just added (usually the first one since we used $position: 0)
    res.status(201).json(updatedBook.comments[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

export { addBook, addLike, addComment };