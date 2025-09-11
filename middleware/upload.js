import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const categoryName = req.body.category || req.body.lessonName || "UnknownCategory";
        const courseTitle = req.body.title || req.body.lessonDescription || "UnknownCourse";
        const originalName = file.originalname.replace(/\s+/g, "_");
        const timestamp = Date.now();
        // Sanitize names by replacing spaces and removing special characters if needed
        const cleanCategory = categoryName.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
        const cleanCourse = courseTitle.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");

        const fileName = `${cleanCategory}_${cleanCourse}_${timestamp}_${originalName}`;

        cb(null, fileName);
    },
});

// File filter (allow videos, audio, images, docs)
const fileFilter = (req, file, cb) => {
    const allowedExt = [
        ".mp4", ".mov", ".avi", ".mkv", ".webm", // videos
        ".mp3", ".wav", ".aac",          // audio
        ".jpg", ".jpeg", ".png", ".gif", // images
        ".pdf", ".docx", ".txt"          // documents
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) cb(null, true);
    else cb(new Error("File type not allowed"));
};

const upload = multer({ storage, fileFilter });

export default upload;
