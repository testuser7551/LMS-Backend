import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      name:user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "3d" }
  );
};

export const getUserDetails = async (mail) => {
  try {
    const user = await User.findOne({ email: mail });

    return user || null;
  } catch (err) {
    throw new Error(err.message);
  }
};




