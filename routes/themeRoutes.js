import express from "express";
import Theme from "../models/ThemeSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;