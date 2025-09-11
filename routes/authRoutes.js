import express from "express";
import { registerUser, loginUser, getUsers,getUserById } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
export default router;