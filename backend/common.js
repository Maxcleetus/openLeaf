import express from "express";
import multer from "multer";
import { addBook } from "./bookcontroller.js";
import { adminLogin } from "./jwt.js";
import { verifyAdminToken } from "./auth.js";

const router = express.Router();

// Multer storage (temporary local storage before uploading to Cloudinary)
const upload = multer({ dest: "uploads/" });

router.post(
  "/addBook",
  verifyAdminToken,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "pdf", maxCount: 1 }]),
  addBook
);

router.post("/login", adminLogin );
router.get("/auth", verifyAdminToken, (req, res) => {
  res.json({ valid: true});
});

export default router;
