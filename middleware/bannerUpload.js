import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const bannerDir = path.join(process.cwd(), "uploads/banner");
if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannerDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `banner_${timestamp}_${baseName}${ext}`);
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed for Banner Section"));
};

const bannerUpload = multer({ storage, fileFilter });

export default bannerUpload;
