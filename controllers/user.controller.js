import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
// import authenticateToken from "./utilities.js";

export const CreateAccount = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check if all fields are provided
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Create a new user
    const newUser = new User({ fullName, email, password });
    await newUser.save();

    // Generate JWT Token
    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600h" }
    );

    // Send response with message, user, and token
    return res.status(201).json({
      message: "User created successfully",
      newUser,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(401).json({ error: "User not found" });
  }

  if (userInfo.password !== password) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }

  // ✅ Fix: Store only `id` in token, not full user object
  const accessToken = jwt.sign({ id: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "600h",
  });

  return res.status(200).json({
    message: "Logged in successfully",
    accessToken,
  });
};


export const getUser = async (req, res) => {
  try {
    console.log("Decoded User:", req.user); // ✅ Debugging log

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: No user ID in token" });
    }

    const userId = req.user.id;
    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


