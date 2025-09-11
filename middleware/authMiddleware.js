import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id; //  attach userId to request
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
