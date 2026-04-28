const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.manufacturerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Generate unique QR code
const generateQRCode = async (productId) => {
  const qrData = `FAKEGUARD-${productId}-${uuidv4()}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrData);
  return { qrData, qrCodeDataURL };
};

// Add new product
router.post('/add', authMiddleware, [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('brandName').trim().notEmpty().withMessage('Brand name is required'),
  body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('batchNumber').trim().notEmpty().withMessage('Batch number is required')
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

    const {
      productName,
      brandName,
      manufacturingDate,
      expiryDate,
      category,
      price,
      batchNumber,
      description,
      specifications
    } = req.body;

    // Create product without QR code first
    const product = new Product({
      productName,
      brandName,
      manufacturingDate: new Date(manufacturingDate),
      expiryDate: new Date(expiryDate),
      category,
      price: parseFloat(price),
      batchNumber,
      description,
      specifications: specifications || {},
      manufacturer: req.manufacturerId
    });

    await product.save();

    // Generate QR code for the product
    const { qrData, qrCodeDataURL } = await generateQRCode(product._id);
    
    // Update product with QR code
    product.qrCode = qrData;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: {
        id: product._id,
        productName: product.productName,
        brandName: product.brandName,
        qrCode: product.qrCode,
        qrCodeImage: qrCodeDataURL,
        manufacturingDate: product.manufacturingDate,
        expiryDate: product.expiryDate,
        batchNumber: product.batchNumber,
        category: product.category,
        price: product.price,
        description: product.description,
        specifications: product.specifications
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding product'
    });
  }
});

// Get all products for a manufacturer
router.get('/my-products', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      manufacturer: req.manufacturerId,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-journey -fakeReports');

    const total = await Product.countDocuments({ 
      manufacturer: req.manufacturerId,
      isActive: true 
    });

    res.json({
      success: true,
      products,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// Get single product details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      manufacturer: req.manufacturerId
    }).populate('manufacturer', 'companyName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// Update product
router.put('/:id', authMiddleware, [
  body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('brandName').optional().trim().notEmpty().withMessage('Brand name cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number')
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

    const product = await Product.findOne({
      _id: req.params.id,
      manufacturer: req.manufacturerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['productName', 'brandName', 'description', 'specifications', 'price'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// Delete product (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      manufacturer: req.manufacturerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// Get product statistics
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({
      manufacturer: req.manufacturerId,
      isActive: true
    });

    const verifiedProducts = await Product.countDocuments({
      manufacturer: req.manufacturerId,
      isActive: true,
      isVerified: true
    });

    const totalVerifications = await Product.aggregate([
      { $match: { manufacturer: req.manufacturerId, isActive: true } },
      { $group: { _id: null, total: { $sum: '$verificationCount' } } }
    ]);

    const recentProducts = await Product.find({
      manufacturer: req.manufacturerId,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('productName brandName createdAt verificationCount');

    res.json({
      success: true,
      stats: {
        totalProducts,
        verifiedProducts,
        totalVerifications: totalVerifications[0]?.total || 0,
        recentProducts
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;
