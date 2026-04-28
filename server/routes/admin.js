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
    const totalManufacturers = await Manufacturer.count();
    const totalProducts = await Product.count({ where: { isActive: true } });
    
    const products = await Product.findAll({
      where: { isActive: true },
      attributes: ['verificationCount', 'fakeReports']
    });
    
    const totalVerifications = products.reduce((sum, p) => sum + (p.verificationCount || 0), 0);
    const fakeReports = products.reduce((sum, p) => sum + (p.fakeReports?.length || 0), 0);

    const recentProducts = await Product.findAll({
      where: { isActive: true },
      include: [{
        model: Manufacturer,
        attributes: ['companyName']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['productName', 'brandName', 'createdAt', 'verificationCount', 'fakeReports']
    });

    const manufacturers = await Manufacturer.findAll({
      include: [{
        model: Product,
        where: { isActive: true },
        required: false
      }]
    });

    const topManufacturers = manufacturers
      .map(m => ({
        ...m.toJSON(),
        productCount: m.products?.length || 0
      }))
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalManufacturers,
        totalProducts,
        totalVerifications,
        fakeReports,
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
    const offset = (page - 1) * limit;

    const manufacturers = await Manufacturer.findAll({
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit,
      attributes: { exclude: ['password'] }
    });

    const total = await Manufacturer.count();

    // Get product counts for each manufacturer
    const manufacturersWithStats = await Promise.all(
      manufacturers.map(async (manufacturer) => {
        const products = await Product.findAll({
          where: {
            manufacturerId: manufacturer.id,
            isActive: true
          },
          attributes: ['verificationCount']
        });

        const productCount = products.length;
        const totalVerifications = products.reduce((sum, p) => sum + (p.verificationCount || 0), 0);

        return {
          ...manufacturer.toJSON(),
          productCount,
          totalVerifications
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
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      where: { isActive: true },
      include: [{
        model: Manufacturer,
        attributes: ['companyName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit
    });

    const total = await Product.count({ where: { isActive: true } });

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
    const offset = (page - 1) * limit;

    const productsWithFakeReports = await Product.findAll({
      where: { isActive: true },
      include: [{
        model: Manufacturer,
        attributes: ['companyName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit
    });

    // Filter products with fake reports and flatten
    const fakeReports = [];
    productsWithFakeReports.forEach(product => {
      if (product.fakeReports && product.fakeReports.length > 0) {
        product.fakeReports.forEach(report => {
          fakeReports.push({
            ...report,
            product: {
              id: product.id,
              name: product.productName,
              brand: product.brandName,
              manufacturer: product.manufacturer
            }
          });
        });
      }
    });

    // Sort by reported date
    fakeReports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

    // Paginate the flattened reports
    const paginatedReports = fakeReports.slice(offset, offset + limit);
    const total = fakeReports.length;

    res.json({
      success: true,
      fakeReports: paginatedReports,
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
    const products = await Product.findAll({
      where: { isActive: true },
      attributes: ['journey']
    });

    const dailyVerifications = {};
    products.forEach(product => {
      if (product.journey) {
        product.journey.forEach(entry => {
          if (entry.status === 'verified') {
            const date = new Date(entry.timestamp).toISOString().split('T')[0];
            dailyVerifications[date] = (dailyVerifications[date] || 0) + 1;
          }
        });
      }
    });

    const dailyVerificationsArray = Object.entries(dailyVerifications)
      .map(([date, count]) => ({ _id: date, count }))
      .sort((a, b) => a._id.localeCompare(b._id))
      .slice(-30);

    // Products by category
    const allProducts = await Product.findAll({
      where: { isActive: true },
      attributes: ['category']
    });

    const productsByCategory = {};
    allProducts.forEach(product => {
      productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
    });

    const productsByCategoryArray = Object.entries(productsByCategory)
      .map(([category, count]) => ({ _id: category, count }))
      .sort((a, b) => b.count - a.count);

    // Top verified products
    const topVerifiedProducts = await Product.findAll({
      where: { isActive: true },
      order: [['verificationCount', 'DESC']],
      limit: 10,
      attributes: ['productName', 'brandName', 'verificationCount']
    });

    // Fake reports by reason
    const fakeReportsByReason = {};
    products.forEach(product => {
      if (product.fakeReports) {
        product.fakeReports.forEach(report => {
          fakeReportsByReason[report.reason] = (fakeReportsByReason[report.reason] || 0) + 1;
        });
      }
    });

    const fakeReportsByReasonArray = Object.entries(fakeReportsByReason)
      .map(([reason, count]) => ({ _id: reason, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      analytics: {
        dailyVerifications: dailyVerificationsArray,
        productsByCategory: productsByCategoryArray,
        topVerifiedProducts,
        fakeReportsByReason: fakeReportsByReasonArray
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
