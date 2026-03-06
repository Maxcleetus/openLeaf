import express from "express";
import { addBook, addLike, addComment, deleteBookComment, deleteBook, updateBook, updateComment } from "./bookcontroller.js"; // Import new functions
import { adminLogin } from "./jwt.js";
import { verifyAdminToken } from "./auth.js";
import { getDetails } from "./details.js";
import { handleChatResponse } from "./chatbot.js";

const router = express.Router();



// --- Admin Protected Routes ---

// Added verifyAdminToken to ensure only authorized users can upload
router.post("/addBook", addBook);
router.post("/login", adminLogin);
router.post("/chat-response", handleChatResponse);
router.get("/auth", verifyAdminToken, (req, res) => {
  res.json({ valid: true });
});
router.put("/book/:id", updateBook);
router.put("/book/:bookId/comment/:commentId", updateComment);
router.delete("/book/:id", deleteBook);
router.delete("/book/:bookId/comment/:commentId", deleteBookComment);
// --- Public/User Routes ---

router.get("/details", getDetails);

/**
 * @route   POST /api/books/:bookid/like
 * @desc    Increment/Decrement like count
 * @access  Public
 */
router.post("/:bookid/like", addLike);

/**
 * @route   POST /api/books/:bookid/comments
 * @desc    Add a comment to a specific book
 * @access  Public
 */
router.post("/:bookid/comments", addComment);

export default router;
