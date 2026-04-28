const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  qrCode: {
    type: DataTypes.STRING,
    unique: true
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brandName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Manufacturers',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastVerified: {
    type: DataTypes.DATE
  },
  journey: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  fakeReports: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['qrCode'] },
    { fields: ['manufacturerId'] },
    { fields: ['isActive'] }
  ]
});

module.exports = Product;
