import User from "../models/User.js";
import jwt from "jsonwebtoken";
import ExpressError from "./expressError.js";

export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new ExpressError(401, "User not authenticated");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ExpressError(401, "User not authenticated");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ExpressError(401, "Invalid or expired token"));
    }
    next(err);
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ExpressError(401, "User not authenticated");
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new ExpressError(403, "User not authorized");
    }

    next();
  };
};
