import Category from "../../models/courses/categoryModel.js";

/**
/**
 * Get all categories
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ categories });
    } catch (err) {
        // console.error("getCategories error:", err);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};

/**
 * Create a new category
 */
export const createCategory = async (req, res) => {
    try {
        const { categoryName, createdByName, createdByRole } = req.body;
        if (!categoryName || !createdByName || !createdByRole) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check duplicate
        const existing = await Category.findOne({
            categoryName: { $regex: `^${categoryName.trim()}$`, $options: "i" },
        });
        if (existing) return res.status(409).json({ message: "Category already exists" });

        const category = new Category({
            categoryName: categoryName.trim(),
            createdByName: createdByName.trim(),
            createdByRole: createdByRole.trim(),
        });

        await category.save();
        res.status(201).json({ category });
    } catch (err) {
        // console.error("createCategory error:", err);
        res.status(500).json({ message: "Failed to create category" });
    }
};

/**
 * Update a category
 */
export const updateCategory = async (req, res) => {
    try {
        const { categoryName, updatedByName, updatedByRole } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryName, updatedByName, updatedByRole },
            { new: true }
        );

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json({ category });
    } catch (err) {
        // console.error("updateCategory error:", err);
        res.status(500).json({ message: "Failed to update category" });
    }
};

/**
 * Delete a category
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        // console.error("deleteCategory error:", err);
        res.status(500).json({ message: "Failed to delete category" });
    }
};
