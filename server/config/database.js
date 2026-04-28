const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/fake-product-detection',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
};

testConnection();

module.exports = sequelize;
