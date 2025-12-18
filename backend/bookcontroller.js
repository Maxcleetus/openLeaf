import Book from "./models/book.js";
import { cloudinary } from "./coludinary.js";

const addBook = async (req, res) => {
  try {
    // 1. Destructure all fields directly from req.body (including Base64 strings)
    const { name, image, pdf, description, author, category } = req.body;
    
    // NOTE: The 'image' and 'pdf' variables now hold the Base64 strings 
    // (e.g., "data:image/jpeg;base64,...") sent from the frontend.

    console.log(`Adding book: ${name}, Author: ${author}, Category: ${category}`);

    // --- Cloudinary Uploads using Base64 Data ---

    let imageSecureUrl = null;
    if (image) {
      // 2. Upload image using the Base64 string data. Cloudinary handles the data URL format.
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: "books/images",
      });
      imageSecureUrl = imageResult.secure_url;
    }

    let pdfSecureUrl = null;
    if (pdf) {
      // 2. Upload PDF using the Base64 string data. 
      // resource_type: "raw" is correct for PDFs.
      const pdfResult = await cloudinary.uploader.upload(pdf, {
        folder: "books/pdfs",
        resource_type: "raw", // Use 'raw' for non-image/non-video files like PDF
      });
      pdfSecureUrl = pdfResult.secure_url;
    }

    // --- Save to MongoDB ---
    const newBook = new Book({
      name,
      // Use the secure URLs obtained from Cloudinary
      image: imageSecureUrl,
      pdf: pdfSecureUrl,
      description,
      author,
      category,
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully", book: newBook });
  } catch (error) {
    console.error("❌ Error adding book:", error.message);
    res.status(500).json({ message: "Server Error: Failed to process book upload." });
  }
};

export { addBook };