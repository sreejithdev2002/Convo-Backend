const userModel = require("../Models/userModel");
const messageModel = require("../Models/messageModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const maxAge = 30 * 24 * 60 * 60;

const createToken = (userId) => {
  const token = jwt.sign({ userId }, "JWT", { expiresIn: maxAge });
  return token;
};

module.exports.Register = async (req, res, next) => {
  const { username, phone, password } = req.body;
  try {
    const phoneExists = await userModel.findOne({ phone });
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "Phone number already exists", status: false });
    }

    const newUser = new userModel({
      username: username,
      phone: phone,
      password: password,
    });

    const userDetails = await newUser.save();
    const token = createToken(userDetails._id);
    return res.json({
      message: "Account created successfully",
      status: true,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
};

module.exports.Login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ phone });
    if (!existingUser) {
      return res.json({
        status: false,
        message: "User does not exist",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.json({
        status: false,
        message: "Wrong password",
      });
    }

    const token = createToken(existingUser._id);
    res.json({
      status: true,
      user: existingUser,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports.userStatus = async (req, res) => {
  try {
    const user = req.user;
    if(!user){
      console.log("No user found at controller")
    }
    if (user) {
      console.log("User found : ", user);
      res.json({
        message: "User fetched",
        user,
      });
    } else {
      console.log("User not found");
      res.json({
        message: "No user found",
        user: null,
      });
    }
  } catch (error) {
    console.error("User status error", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
