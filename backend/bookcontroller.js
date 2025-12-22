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
// In your bookcontroller.js file
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByIdAndDelete(id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // Optionally delete from Cloudinary
    // if (book.image) {
    //   const imageId = book.image.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(`books/images/${imageId}`);
    // }
    // if (book.pdf) {
    //   const pdfId = book.pdf.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(`books/pdfs/${pdfId}`, { resource_type: 'raw' });
    // }
    
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteBookComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// bookcontroller.js - Add these update functions
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If there's a new image file in Base64 format
    if (updates.image && updates.image.startsWith('data:image')) {
      try {
        // Delete old image from Cloudinary if it exists
        const oldBook = await Book.findById(id);
        if (oldBook && oldBook.image) {
          // Extract public_id from URL
          const imageUrlParts = oldBook.image.split('/');
          const filename = imageUrlParts[imageUrlParts.length - 1];
          const publicId = `books/images/${filename.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        }
        
        // Upload new image
        const imageResult = await cloudinary.uploader.upload(updates.image, { 
          folder: "books/images" 
        });
        updates.image = imageResult.secure_url;
      } catch (error) {
        console.error("Error updating image:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }
    
    // If there's a new PDF file in Base64 format
    if (updates.pdf && updates.pdf.startsWith('data:application/pdf')) {
      try {
        // Delete old PDF from Cloudinary if it exists
        const oldBook = await Book.findById(id);
        if (oldBook && oldBook.pdf) {
          // Extract public_id from URL
          const pdfUrlParts = oldBook.pdf.split('/');
          const filename = pdfUrlParts[pdfUrlParts.length - 1];
          const publicId = `books/pdfs/${filename}`;
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
        
        // Upload new PDF
        const pdfResult = await cloudinary.uploader.upload(updates.pdf, {
          folder: "books/pdfs",
          resource_type: "raw",
        });
        updates.pdf = pdfResult.secure_url;
      } catch (error) {
        console.error("Error updating PDF:", error);
        return res.status(500).json({ message: "Error uploading PDF" });
      }
    }
    
    // Update book in database
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.status(200).json({ 
      message: "Book updated successfully", 
      book: updatedBook 
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const { text, user } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // Find and update the specific comment
    const comment = book.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    comment.text = text;
    if (user) comment.user = user;
    comment.timestamp = new Date();
    
    await book.save();
    
    res.status(200).json({ 
      message: "Comment updated successfully", 
      comment 
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { addBook, addLike, addComment };