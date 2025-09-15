import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { authorizeRoles } from "../middleware/roleMiddleWare.js";

const router = express.Router();

// Public routes
router.get("/",  getCategories);
router.post("/",authorizeRoles("admin"), createCategory);
router.put("/:id",authorizeRoles("admin"), updateCategory);
router.delete("/:id",authorizeRoles("admin"), deleteCategory);

export default router;
