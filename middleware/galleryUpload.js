import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure gallery uploads folder exists
const galleryDir = path.join(process.cwd(), "uploads/gallery");
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Storage config (Gallery only → images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, galleryDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `gallery_${timestamp}_${baseName}${ext}`);
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed in Gallery Section"));
};

const galleryUpload = multer({ storage, fileFilter });

export default galleryUpload;
