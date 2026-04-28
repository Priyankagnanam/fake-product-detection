const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const sequelize = require('./config/database');
const Manufacturer = require('./models/Manufacturer');
const Product = require('./models/Product');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// ✅ FIX: Allow ALL frontend origins (important for Render)
app.use(cors({
  origin: '*',
  credentials: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// DB relations
Product.belongsTo(Manufacturer, {
  foreignKey: 'manufacturerId',
  as: 'manufacturer'
});

Manufacturer.hasMany(Product, {
  foreignKey: 'manufacturerId',
  as: 'products'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database sync error:', error);
  }
};

syncDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/admin', require('./routes/admin'));

// Root
app.get('/', (req, res) => {
  res.send('Fake Product Detection API is Live 🚀');
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
