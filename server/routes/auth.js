const express = require('express');
const jwt = require('jsonwebtoken');
const Manufacturer = require('../models/Manufacturer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'manufacturer' }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// Manufacturer Signup
router.post('/manufacturer/signup', [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyName, email, password, phone, address } = req.body;

    // Check if manufacturer already exists
    const existingManufacturer = await Manufacturer.findOne({ email });
    if (existingManufacturer) {
      return res.status(400).json({
        success: false,
        message: 'Manufacturer with this email already exists'
      });
    }

    // Create new manufacturer
    const manufacturer = new Manufacturer({
      companyName,
      email,
      password,
      phone,
      address
    });

    await manufacturer.save();

    // Generate token
    const token = generateToken(manufacturer._id);

    res.status(201).json({
      success: true,
      message: 'Manufacturer registered successfully',
      token,
      user: {
        id: manufacturer._id,
        companyName: manufacturer.companyName,
        email: manufacturer.email,
        role: 'manufacturer'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Manufacturer Login
router.post('/manufacturer/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find manufacturer
    const manufacturer = await Manufacturer.findOne({ email });
    if (!manufacturer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await manufacturer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(manufacturer._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: manufacturer._id,
        companyName: manufacturer.companyName,
        email: manufacturer.email,
        role: 'manufacturer'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get manufacturer profile
router.get('/manufacturer/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const manufacturer = await Manufacturer.findById(decoded.id).select('-password');

    if (!manufacturer) {
      return res.status(404).json({
        success: false,
        message: 'Manufacturer not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: manufacturer._id,
        companyName: manufacturer.companyName,
        email: manufacturer.email,
        phone: manufacturer.phone,
        address: manufacturer.address,
        isVerified: manufacturer.isVerified,
        role: 'manufacturer'
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
