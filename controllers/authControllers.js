const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const { validationResult } = require('express-validator');

const { prisma } = require("../db");

// Authenticate user and generate JWT token
const login = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await prisma.staff.findUnique({
        where: {
            email
        }
      });
    
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
    
      const isMatch = await bcrypt.compare(password, user.password);
    
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
    
      //console.log(user)
        const userPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
          }
      const token = await JWT.sign(
        userPayload,
        process.env.JSON_WEB_TOKEN_SECRET,
        {
          expiresIn: 3600000,
        }
      );
      return res.json({
        user: userPayload,
        token,
      });
    } catch (error) {
      console.log('error in auth',error)
    }
})

const changePassword = asyncHandler(async (req,res) => {
    const { password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
  
      //Hash the new password
      const saltRounds = 10; // You can adjust the number of salt rounds as needed
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // console.log('from cahnge apsswpowd',req.user)
      // res.send('change password')
      try {
        const updatedUser = await prisma.staff.update({
            where: {
                email: req.user.email
            },
            data: {
                password: hashedPassword
            }
        });
        
        // 4. Return a response indicating success
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle any potential errors
      console.error("Error updating password:", error);
      return res.status(500).json({ errors: [{ msg: "Internal server error" }] });
      }
  
  })

  //// create staff
const createStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newstaff = await prisma.staff.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  res.json({ created: "ok" });
});


module.exports = { login, changePassword, createStaff }









