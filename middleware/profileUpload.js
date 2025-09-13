import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure profile uploads folder exists
const profileDir = path.join(process.cwd(), "uploads/profile");
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// Storage config (Profile only → images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `profile_${timestamp}_${baseName}${ext}`);
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only image files are allowed in Profile Section"));
};

const profileUpload = multer({ storage, fileFilter });

export default profileUpload;
