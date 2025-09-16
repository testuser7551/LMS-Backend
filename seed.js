import mongoose from "mongoose";
import ThemeSchema from "./models/ThemeSchema.js"; 

import dotenv from "dotenv";


// Load .env file
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
// Predefined themes JSON
const themes = {
  Simple: {
    primaryColor: "#6B7280",
    secondaryColor: "#9CA3AF",
    territoryColor: "#4B5563",
    backgroundColor: "#F9FAFB",
    textColor: "#111827",
  },
  Modern: {
    primaryColor: "#2563EB",
    secondaryColor: "#3B82F6",
    territoryColor: "#1E40AF",
    backgroundColor: "#EFF6FF",
    textColor: "#1E3A8A",
  },
  Nature: {
    primaryColor: "#16A34A",
    secondaryColor: "#22C55E",
    territoryColor: "#14532D",
    backgroundColor: "#ECFDF5",
    textColor: "#064E3B",
  },
  Bold: {
    primaryColor: "#DC2626",
    secondaryColor: "#F87171",
    territoryColor: "#7F1D1D",
    backgroundColor: "#FEF2F2",
    textColor: "#7F1D1D",
  },
  Luxury: {
    primaryColor: "#B8860B",
    secondaryColor: "#FFD700",
    territoryColor: "#1C1917",
    backgroundColor: "#FDF6E3",
    textColor: "#1C1917",
  },
  Playful: {
    primaryColor: "#F97316",
    secondaryColor: "#FB923C",
    territoryColor: "#BE123C",
    backgroundColor: "#FFF7ED",
    textColor: "#7C2D12",
  },
  Professional: {
    primaryColor: "#0F172A",
    secondaryColor: "#1E293B",
    territoryColor: "#334155",
    backgroundColor: "#F8FAFC",
    textColor: "#0F172A",
  },
  Pastel: {
    primaryColor: "#A78BFA",
    secondaryColor: "#F9A8D4",
    territoryColor: "#FBCFE8",
    backgroundColor: "#FDF4FF",
    textColor: "#4A044E",
  },
  Dark: {
    primaryColor: "#111827",
    secondaryColor: "#1F2937",
    territoryColor: "#374151",
    backgroundColor: "#000000",
    textColor: "#F9FAFB",
  },
};

async function seedThemes() {
  try {
    await ThemeSchema.deleteMany(); // clear old data

    const themeDocs = Object.entries(themes).map(([name, data]) => ({
      themeName: name,
      ...data,
    }));

    await ThemeSchema.insertMany(themeDocs);
    // console.log("✅ Themes seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding themes:", error);
    mongoose.connection.close();
  }
}

seedThemes();
