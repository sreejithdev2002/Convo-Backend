const express = require("express");
const { Register, Login, userStatus } = require("../Controllers/controllers");
const userAuth = require("../Middleware/userAuth");
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);

router.get("/", userAuth, userStatus);

module.exports = router;
