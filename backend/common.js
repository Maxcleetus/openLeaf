import express from "express";
import multer from "multer";
import { addBook } from "./bookcontroller.js";
import { adminLogin } from "./jwt.js";
import { verifyAdminToken } from "./auth.js";
import { getDetails } from "./details.js";


const router = express.Router();

// Multer storage (temporary local storage before uploading to Cloudinary)
const upload = multer({ dest: "uploads/" });

router.post(
  "/addBook",
  addBook
);

router.post("/login", adminLogin );
router.get("/details", getDetails );
router.get("/auth", verifyAdminToken, (req, res) => {
  res.json({ valid: true});
});

export default router;
