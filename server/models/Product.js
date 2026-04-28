const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  brandName: {
    type: String,
    required: true
  },
  manufacturingDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manufacturer',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  specifications: {
    weight: String,
    dimensions: String,
    color: String,
    size: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerified: {
    type: Date
  },
  journey: [{
    location: String,
    timestamp: Date,
    status: String,
    scannedBy: String
  }],
  fakeReports: [{
    reportedBy: String,
    reportedAt: Date,
    reason: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ qrCode: 1 });
productSchema.index({ manufacturer: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
