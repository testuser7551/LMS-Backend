import mongoose from "mongoose";


const ThemeSchema = new mongoose.Schema([
  {
    themeName: {
      type: String,
      enum: [
        "Simple",
        "Modern",
        "Nature",
        "Bold",
        "Luxury",
        "Playful",
        "Professional",
        "Pastel",
        "Dark",
      ],
    },
    primaryColor: { type: String, default: null },
    secondaryColor: { type: String, default: null },
    territoryColor: { type: String, default: null },
    backgroundColor: { type: String, default: null },
    textColor: { type: String, default: null },
  },
]);
export default mongoose.model("Theme", ThemeSchema);
