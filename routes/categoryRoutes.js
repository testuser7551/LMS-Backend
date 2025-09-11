import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
