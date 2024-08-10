const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const authToken = authHeader && authHeader.split(" ")[1];

    if (!authToken) {
      return res.json({
        loginfail: true,
        status: false,
        message: "No auth token",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(authToken, "JWT");
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      console.error("Error verifying token:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    const user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.json({
        message: "Unauthorized access",
        status: false,
        loginfail: true,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
