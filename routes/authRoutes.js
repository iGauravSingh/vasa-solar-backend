const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controllers/authControllers");
const { authenticateToken } = require("../middlewares/auth");

router.post("/login", [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password must be at least 5 characters long"),
  authController.login,
]);

router.put("/change-password", authenticateToken, [
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password must be at least 5 characters long"),
  authController.changePassword,
]);

router.post("/signup", [
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be at least 5 characters long"),
    authController.createStaff,
  ]);


module.exports = router