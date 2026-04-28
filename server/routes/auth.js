const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Manufacturer = require('../models/Manufacturer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ================= JWT =================
const generateToken = (id) => {
  return jwt.sign(
    { id, role: 'manufacturer' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// ================= SIGNUP =================
router.post(
  '/manufacturer/signup',
  [
    body('companyName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').notEmpty(),
    body('address').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { companyName, email, password, phone, address } = req.body;

      const existing = await Manufacturer.findOne({ where: { email } });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const manufacturer = await Manufacturer.create({
        companyName,
        email,
        password: hashedPassword,
        phone,
        address
      });

      const token = generateToken(manufacturer.id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: manufacturer.id,
          companyName,
          email,
          role: 'manufacturer'
        }
      });

    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during signup'
      });
    }
  }
);

// ================= LOGIN =================
router.post('/manufacturer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Manufacturer.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // IMPORTANT: safe password check
    const isMatch = await bcrypt.compare(password, user.password || '');

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        companyName: user.companyName,
        email: user.email,
        role: 'manufacturer'
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;
