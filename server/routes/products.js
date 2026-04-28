const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Products API is working',
    availableRoutes: [
      'POST /api/products/add',
      'GET /api/products/my-products',
      'GET /api/products/:id',
      'PUT /api/products/:id',
      'DELETE /api/products/:id',
      'GET /api/products/stats/dashboard'
    ]
  });
});

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
    const product = await Product.create({
      productName,
      brandName,
      manufacturingDate: new Date(manufacturingDate),
      expiryDate: new Date(expiryDate),
      category,
      price: parseFloat(price),
      batchNumber,
      description,
      specifications: specifications || {},
      manufacturerId: req.manufacturerId
    });

    // Generate QR code for the product
    const { qrData, qrCodeDataURL } = await generateQRCode(product.id);
    
    // Update product with QR code
    await product.update({ qrCode: qrData });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: {
        id: product.id,
        productName: product.productName,
        brandName: product.brandName,
        qrCode: qrData,
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

    const products = await Product.findAll({ 
      where: { 
        manufacturerId: req.manufacturerId,
        isActive: true 
      },
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      attributes: { exclude: ['journey', 'fakeReports'] }
    });

    const total = await Product.count({ 
      where: { 
        manufacturerId: req.manufacturerId,
        isActive: true 
      }
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
      where: {
        id: req.params.id,
        manufacturerId: req.manufacturerId
      },
      include: [{
        model: Manufacturer,
        attributes: ['companyName', 'email']
      }]
    });

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
      where: {
        id: req.params.id,
        manufacturerId: req.manufacturerId
      }
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

    await product.update({ ...updates, updatedAt: new Date() });
    const updatedProduct = await Product.findOne({
      where: { id: req.params.id }
    });

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
      where: {
        id: req.params.id,
        manufacturerId: req.manufacturerId
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update({ isActive: false });

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
    const totalProducts = await Product.count({
      where: {
        manufacturerId: req.manufacturerId,
        isActive: true
      }
    });

    const verifiedProducts = await Product.count({
      where: {
        manufacturerId: req.manufacturerId,
        isActive: true,
        isVerified: true
      }
    });

    const products = await Product.findAll({
      where: {
        manufacturerId: req.manufacturerId,
        isActive: true
      },
      attributes: ['verificationCount']
    });

    const totalVerifications = products.reduce((sum, p) => sum + (p.verificationCount || 0), 0);

    const recentProducts = await Product.findAll({
      where: {
        manufacturerId: req.manufacturerId,
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['productName', 'brandName', 'createdAt', 'verificationCount']
    });

    res.json({
      success: true,
      stats: {
        totalProducts,
        verifiedProducts,
        totalVerifications,
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
