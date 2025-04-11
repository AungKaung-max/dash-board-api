import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import { findById } from "../database/queries/queries.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Valid token is required",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findById(decoded.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Token Invalid",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authMiddleware;
