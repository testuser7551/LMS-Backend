// controllers/authController.js
import User from "../models/User.js";
import Webcard from "../models/CardDesigner.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    const webcard = await Webcard.create({
      user_id: user._id,   // assuming Webcard has a user reference
      // you can initialize default fields here, like theme, about, etc.
      about: {
        basicdetails: {
          name: user.name,
          email: user.email,
        }
      }
    });

    // Step 3: Link the Webcard to the user
    user.webcard_id = webcard._id;
    await user.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get User By ID Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
