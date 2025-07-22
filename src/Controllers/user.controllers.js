import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
const randomPasswordChars = "1234567890!@#$%^&*ASDFGHJKL";

const generateRefershToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESHTOKEN, {
    expiresIn: "7d",
  });
};
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESSTOKEN, {
    expiresIn: "1d",
  });
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Random password generator
const generatePassword = (chars, length = 8) => {
  let password = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    password += chars.charAt(index);
  }
  return password;
};

// Sign-up handler
const signIn = async (req, res) => {
  const { userName, email, cnic } = req.body;

  // Validations
  if (!userName)
    return res.status(400).json({ message: "Username is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!cnic) return res.status(400).json({ message: "CNIC is required" });

  const isValidCNIC = (cnic) => /^\d{13}$/.test(cnic);
  if (!isValidCNIC(cnic)) {
    return res.status(400).json({ message: "CNIC must be exactly 13 digits" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    const existingCNIC = await User.findOne({ cnic });
    if (existingCNIC) {
      return res.status(409).json({ message: "CNIC is already registered" });
    }

    const generatedPassword = generatePassword(randomPasswordChars);
    const newUser = await User.create({
      userName,
      email,
      cnic,
      password: generatedPassword,
    });
    const mailInfo = await transporter.sendMail({
      from: `"Microfinance App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Microfinance App Password",
      text: `Hi ${userName},\n\nYour account has been created.\nYour password is: ${generatedPassword}`,
      html: `
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your Microfinance account has been created.</p>
        <p><strong>Password:</strong> ${generatedPassword}</p>
        <p>Please keep it safe and do not share it with anyone.</p>
      `,
    });
    return res.status(201).json({
      message: "User registered successfully. Password has been sent to email.",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        cnic: newUser.cnic,
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// login handler
const login = async (req, res) => {
  const { cnic, password } = req.body;
  console.log(password);
  if (!cnic) {
    return res.status(400).json({ message: "CNIC is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  try {
    const existingUser = await User.findOne({ cnic });
    console.log(existingUser, "user");
    if (!existingUser) {
      return res.status(400).json({
        message: "CNIC not found. Try using a different CNIC.",
      });
    }
    console.log(existingUser.password, "pass");
    const isPasswordValid = await bcrpyt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const refreshToken = generateRefershToken(existingUser);
    const accessToken = generateAccessToken(existingUser);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        cnic: existingUser.cnic,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { signIn, login };
