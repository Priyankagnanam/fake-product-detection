const express = require('express');
const Product = require('../models/Product');
const Manufacturer = require('../models/Manufacturer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Verify product by QR code
router.post('/verify', [
  body('qrCode').notEmpty().withMessage('QR code is required'),
  body('location').optional().trim(),
  body('customerInfo').optional().trim()
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

    const { qrCode, location, customerInfo } = req.body;

    // Find product by QR code
    const product = await Product.findOne({
      where: {
        qrCode: qrCode.trim(),
        isActive: true
      },
      include: [{
        model: Manufacturer,
        attributes: ['companyName', 'email', 'phone', 'address']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        isGenuine: false,
        reason: 'QR code not found in our database'
      });
    }

    // Check if product is expired
    if (product.expiryDate && new Date(product.expiryDate) < new Date()) {
      return res.status(200).json({
        success: true,
        isGenuine: false,
        message: 'Product has expired',
        product: {
          productName: product.productName,
          brandName: product.brandName,
          expiryDate: product.expiryDate,
          manufacturer: product.manufacturer
        }
      });
    }

    // Update verification count and last verified date
    const newJourney = location || customerInfo ? [{
      location: location || 'Unknown',
      timestamp: new Date(),
      status: 'verified',
      scannedBy: customerInfo || 'Anonymous Customer'
    }] : [];

    await product.update({
      verificationCount: product.verificationCount + 1,
      lastVerified: new Date(),
      journey: [...product.journey, ...newJourney]
    });

    res.json({
      success: true,
      isGenuine: true,
      message: 'Product is genuine',
      product: {
        id: product.id,
        productName: product.productName,
        brandName: product.brandName,
        manufacturingDate: product.manufacturingDate,
        expiryDate: product.expiryDate,
        batchNumber: product.batchNumber,
        category: product.category,
        description: product.description,
        specifications: product.specifications,
        manufacturer: product.manufacturer,
        verificationCount: product.verificationCount + 1,
        lastVerified: new Date()
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// Report fake product
router.post('/report-fake', [
  body('qrCode').notEmpty().withMessage('QR code is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('reporterInfo').trim().notEmpty().withMessage('Reporter information is required')
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

    const { qrCode, reason, description, reporterInfo } = req.body;

    // Find product by QR code
    const product = await Product.findOne({
      where: {
        qrCode: qrCode.trim(),
        isActive: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in database'
      });
    }

    // Add fake report
    const newFakeReport = {
      reportedBy: reporterInfo,
      reportedAt: new Date(),
      reason,
      description
    };

    // Add to journey
    const newJourneyEntry = {
      location: 'Unknown',
      timestamp: new Date(),
      status: 'reported_as_fake',
      scannedBy: reporterInfo
    };

    await product.update({
      fakeReports: [...product.fakeReports, newFakeReport],
      journey: [...product.journey, newJourneyEntry]
    });

    res.json({
      success: true,
      message: 'Fake product report submitted successfully',
      reportId: newFakeReport.reportedAt.getTime()
    });
  } catch (error) {
    console.error('Report fake error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reporting fake product'
    });
  }
});

// Get product journey
router.get('/journey/:productId', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [{
        model: Manufacturer,
        attributes: ['companyName']
      }],
      attributes: ['productName', 'brandName', 'journey', 'createdAt']
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: {
        id: product.id,
        productName: product.productName,
        brandName: product.brandName,
        manufacturer: product.manufacturer,
        createdAt: product.createdAt,
        journey: product.journey.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }
    });
  } catch (error) {
    console.error('Get journey error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product journey'
    });
  }
});

// Public product verification (no auth required)
router.get('/public/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;

    const product = await Product.findOne({
      where: {
        qrCode: qrCode.trim(),
        isActive: true
      },
      include: [{
        model: Manufacturer,
        attributes: ['companyName']
      }],
      attributes: ['productName', 'brandName', 'manufacturingDate', 'expiryDate', 'batchNumber', 'category', 'verificationCount', 'lastVerified']
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        isGenuine: false
      });
    }

    // Check if product is expired
    if (product.expiryDate && new Date(product.expiryDate) < new Date()) {
      return res.status(200).json({
        success: true,
        isGenuine: false,
        message: 'Product has expired',
        product: {
          productName: product.productName,
          brandName: product.brandName,
          expiryDate: product.expiryDate
        }
      });
    }

    res.json({
      success: true,
      isGenuine: true,
      product
    });
  } catch (error) {
    console.error('Public verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

module.exports = router;
