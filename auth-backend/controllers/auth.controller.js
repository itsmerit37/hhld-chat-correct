import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";
const signup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(409).json({ message: "Username already exists" });
    } else {
      const user = new User({ username: username, password: hashedPassword });
      console.log(user);
      await user.save();
      console.log("User created:", user);

      generateJWTTokenAndSetCookie(user._id, res);
      res.status(201).json({ message: "User signed up successfully" });
    }
  } catch (error) {
    console.log("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    console.error("Signup error:", error);

    res.status(500).json({
      message: "User registration failed",
      error: error.message,
    });
  }
};
export default signup;
