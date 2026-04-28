const express = require('express');
const Product = require('../models/Product');
const Manufacturer = require('../models/Manufacturer');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Admin middleware (simplified for demo)
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // For demo purposes, accept any valid token as admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalManufacturers = await Manufacturer.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalVerifications = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$verificationCount' } } }
    ]);
    
    const fakeReports = await Product.aggregate([
      { $match: { isActive: true } },
      { $project: { fakeReportCount: { $size: '$fakeReports' } } },
      { $group: { _id: null, total: { $sum: '$fakeReportCount' } } }
    ]);

    const recentProducts = await Product.find({ isActive: true })
      .populate('manufacturer', 'companyName')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('productName brandName createdAt verificationCount fakeReports');

    const topManufacturers = await Manufacturer.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'manufacturer',
          as: 'products'
        }
      },
      {
        $project: {
          companyName: 1,
          email: 1,
          productCount: { $size: '$products' },
          totalVerifications: { $sum: '$products.verificationCount' }
        }
      },
      { $sort: { productCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        totalManufacturers,
        totalProducts,
        totalVerifications: totalVerifications[0]?.total || 0,
        fakeReports: fakeReports[0]?.total || 0,
        recentProducts,
        topManufacturers
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// Get all manufacturers
router.get('/manufacturers', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const manufacturers = await Manufacturer.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await Manufacturer.countDocuments();

    // Get product counts for each manufacturer
    const manufacturersWithStats = await Promise.all(
      manufacturers.map(async (manufacturer) => {
        const productCount = await Product.countDocuments({
          manufacturer: manufacturer._id,
          isActive: true
        });
        
        const totalVerifications = await Product.aggregate([
          { $match: { manufacturer: manufacturer._id, isActive: true } },
          { $group: { _id: null, total: { $sum: '$verificationCount' } } }
        ]);

        return {
          ...manufacturer.toObject(),
          productCount,
          totalVerifications: totalVerifications[0]?.total || 0
        };
      })
    );

    res.json({
      success: true,
      manufacturers: manufacturersWithStats,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get manufacturers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching manufacturers'
    });
  }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isActive: true })
      .populate('manufacturer', 'companyName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ isActive: true });

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

// Get fake product reports
router.get('/fake-reports', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const productsWithFakeReports = await Product.find({
      isActive: true,
      'fakeReports.0': { $exists: true }
    })
    .populate('manufacturer', 'companyName email')
    .sort({ 'fakeReports.reportedAt': -1 })
    .skip(skip)
    .limit(limit);

    const total = await Product.countDocuments({
      isActive: true,
      'fakeReports.0': { $exists: true }
    });

    // Flatten fake reports for easier display
    const fakeReports = [];
    productsWithFakeReports.forEach(product => {
      product.fakeReports.forEach(report => {
        fakeReports.push({
          ...report.toObject(),
          product: {
            id: product._id,
            name: product.productName,
            brand: product.brandName,
            manufacturer: product.manufacturer
          }
        });
      });
    });

    res.json({
      success: true,
      fakeReports: fakeReports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get fake reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fake reports'
    });
  }
});

// Get verification analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // Daily verifications for last 30 days
    const dailyVerifications = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$journey' },
      { $match: { 'journey.status': 'verified' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$journey.timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      { $limit: 30 }
    ]);

    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Top verified products
    const topVerifiedProducts = await Product.find({ isActive: true })
      .populate('manufacturer', 'companyName')
      .sort({ verificationCount: -1 })
      .limit(10)
      .select('productName brandName verificationCount manufacturer');

    // Fake reports by reason
    const fakeReportsByReason = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$fakeReports' },
      {
        $group: {
          _id: '$fakeReports.reason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        dailyVerifications,
        productsByCategory,
        topVerifiedProducts,
        fakeReportsByReason
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

module.exports = router;
