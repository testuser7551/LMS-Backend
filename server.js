import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import swaggerSetup from './swagger.js'

import connectDB from "./config/db.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import {getCardDesignById} from "./controllers/carddesign/cardDesignController.js";

import indexRoutes from "./routes/index.route.js";

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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use project root (where server.js is located)
const rootDir = path.resolve(__dirname);

// Ensure uploads folders exist
const uploadRoot = path.join(rootDir, "uploads");
["gallery", "photos", "profile", "banner", "courses", "completed"].forEach((folder) => {
  const dir = path.join(uploadRoot, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to LMS Backend");
});

// Serve static uploads
app.use("/uploads", express.static(uploadRoot));

// public Routes
app.use("/api/auth", authRoutes);
//app.use(cookieParser());

app.get("/card-design/:id", getCardDesignById);

app.use(authMiddleware);

app.use("/api", indexRoutes);

swaggerSetup(app);

const PORT = process.env.PORT;
app.listen(PORT,HOST, () => console.log(` Server running on http://${HOST} port ${PORT}`));
