import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads/courses");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const Name = req.body.category || req.body.lessonName || req.body.title || "UnknownCategory";
        const timestamp = Date.now();

        // Sanitize the category name: replace spaces with underscores, remove unwanted characters
        const cleanCategory = Name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");

        // Extract the file extension from the original filename
        const originalExtension = file.originalname.split('.').pop();

        // Construct the new filename
        const fileName = `${cleanCategory}_${timestamp}.${originalExtension}`;

        // console.log(fileName);

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
