const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Token Access
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

// Token Refresh
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// New user registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "invalid user credentials" });
    }

    // Compare hashed password with the one entered by the user
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
  

    if (isPasswordCorrect) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token in user document
      user.refreshToken = refreshToken;
      await user.save();

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


// Get all users with task count (for admin)
const getUsersWithTaskCount = async (req, res) => {
  try {
    
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied, Admin only" });
    }
  
    const users = await User.find();

    const usersWithTaskCount = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ userId: user._id });
        return { ...user.toObject(), taskCount };
      })
    );

    res.status(200).json(usersWithTaskCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get user details
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};

// Update user details
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.id !== req.user.id) {
    return res.status(404).json({ message: "User not found or not authorized" });
  }

  const { name, email, password } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  if (password) {
    // Encrypt the password if provided
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
};

// Delete user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.id !== req.user.id) {
    return res.status(404).json({ message: "User not found or not authorized" });
  }

  await user.remove();
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUsersWithTaskCount,
  getUser,
  updateUser,
  deleteUser,
  refreshToken,
};
