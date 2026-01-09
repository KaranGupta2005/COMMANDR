import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthTokens,
} from "../utils/generateTokens.js";
import ExpressError from "../middlewares/expressError.js";

export const signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });
  if (existingUser) {
    throw new ExpressError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role, 
  });

  const accessToken = generateAccessToken(newUser._id, newUser.role);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshTokens = [
    { token: refreshToken },
  ];
  await newUser.save();

  setAuthTokens(res, accessToken, refreshToken);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ExpressError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(400, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // keep only last 5 refresh tokens
  user.refreshTokens = user.refreshTokens.slice(-4);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  setAuthTokens(res, accessToken, refreshToken);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== refreshToken
      );
      await user.save();
    }
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ExpressError(401, "Unauthorized");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
  } catch {
    throw new ExpressError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ExpressError(401, "Unauthorized");
  }

  const tokenExists = user.refreshTokens.find(
    (rt) => rt.token === token
  );
  if (!tokenExists) {
    throw new ExpressError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  // rotate refresh token
  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.token !== token
  );
  user.refreshTokens.push({ token: newRefreshToken });
  await user.save();

  setAuthTokens(res, newAccessToken, newRefreshToken);

  res.status(200).json({ message: "Access token refreshed" });
};
