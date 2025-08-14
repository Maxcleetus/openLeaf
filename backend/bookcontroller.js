import Book from "./models/book.js";
import { cloudinary } from "./coludinary.js";

const addBook = async (req, res) => {
  try {
    const { name, description, author, category } = req.body;
    console.log("Adding book:", name, description, author, category);

    // Upload image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(req.files.image[0].path, {
      folder: "books/images",
    });

    // Upload PDF to Cloudinary
    const pdfResult = await cloudinary.uploader.upload(req.files.pdf[0].path, {
      folder: "books/pdfs",
      resource_type: "raw",
    });

    // Save book details in MongoDB
    const newBook = new Book({
      name,
      image: imageResult.secure_url,
      pdf: pdfResult.secure_url,
      description,
      author,
      category,
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully", book: newBook });
  } catch (error) {
    console.error("❌ Error adding book:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export { addBook };
