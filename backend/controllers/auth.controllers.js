import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import PasswordValidator from "password-validator";
import genToken from "../utils/token.js";

const passwordSchema = new PasswordValidator();

passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist!!",
      });
    }

    const isValid = passwordSchema.validate(password);

    if (!isValid) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.",
      });
    }

    if (mobile.length != 10) {
      return res.status(400).json({ message: "Invalid phone number!!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashPassword,
      mobile,
      role,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Signup error",
      error: err.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User dosen't exist!!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect Password!!" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "SignUp error",
      error: err.message,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "LogOut successful!!" });
  } catch (err) {
    return res.status(500).json({
      message: "SignOut error",
      error: err.message,
    });
  }
};
