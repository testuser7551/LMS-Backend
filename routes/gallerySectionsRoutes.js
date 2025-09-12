// import express from "express";
// import { updateGallerySection } from "../controllers/gallerySectionController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: GallerySection
//  *   description: Manage Gallery Section in Digital Card
//  */

// /**
//  * @swagger
//  * /api/gallerySection:
//  *   put:
//  *     summary: Update existing GallerySection
//  *     tags: [GallerySection]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.use(authMiddleware);
// router.put("/", updateGallerySection);

// export default router;


import express from "express";
import galleryUpload from "../middleware/galleryUpload.js";
import { saveGallerySection, deleteGalleryImage } from "../controllers/gallerySectionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GallerySection
 *   description: Manage Gallery Section in Digital Card
 */

/**
 * @swagger
 * /api/gallerySection:
 *   post:
 *     summary: Upload or update Gallery Section image
 *     tags: [GallerySection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Gallery image uploaded successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.use(authMiddleware);
router.post("/", galleryUpload.single("image"), saveGallerySection);

/**
 * @swagger
 * /api/gallerySection/{imageId}:
 *   delete:
 *     summary: Delete an image from Gallery Section
 *     tags: [GallerySection]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:imageId", authMiddleware, deleteGalleryImage);

export default router;
