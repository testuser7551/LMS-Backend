import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import swaggerSetup from './swagger.js'
import cardDesignRoutes from "./routes/cardDesignRoutes.js"
import basicDetailsRoutes from "./routes/basicDetailsRoutes.js"
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import enrollRoutes from "./routes/enrollRoutes.js"
import mainButtonRoutes from "./routes/mainButtonRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import whatsappButtonRoutes from "./routes/whatsappButtonRoutes.js";
import textSectionRoutes from "./routes/textSectionRoutes.js";
import stylesRoutes from "./routes/stylesRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import linkSectionRoutes from "./routes/linkSectionRoutes.js";
import gallarySectionRoutes from "./routes/gallerySectionsRoutes.js"
import photoSectionRoutes from "./routes/photoSectionRoutes.js"
import youTubeSectionRoutes from "./routes/youTubeSectionRoutes.js"
import themeRoutes from "./routes/themeRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import fs from "fs";
//import cookieParser from "cookie-parser";
const HOST = "0.0.0.0";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || true); // reflect request origin or allow requests with no origin
  },
  credentials: true, // allow cookies/auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
//app.use(cookieParser());

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const galleryDir = path.join(__dirname, "uploads", "gallery");
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

const photoDir = path.join(__dirname, "uploads", "photos");
if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

// ✅ Serve static uploads, gallery, and photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/gallery", express.static(galleryDir));
app.use("/uploads/photos", express.static(photoDir));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);

app.use("/api/enrollment", enrollRoutes);
app.use("/api/basic",basicDetailsRoutes);
app.use("/api/mainbutton",mainButtonRoutes);
app.use("/api/whatsappButton",whatsappButtonRoutes);
app.use("/api/styles", stylesRoutes);
app.use("/api/themes", themeRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/api/textSection", textSectionRoutes);
app.use("/api", cardDesignRoutes);
app.use("/api/linkSection", linkSectionRoutes);
app.use("/api/youTubeSection",youTubeSectionRoutes);
app.use("/api/gallerySection",gallarySectionRoutes);
app.use("/api/photoSection",photoSectionRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT,HOST, () => console.log(` Server running on http://${HOST} port ${PORT}`));
