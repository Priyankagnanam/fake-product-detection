import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, QrCode, Users, BarChart3, Lock, CheckCircle, AlertTriangle, Package } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "QR Code Authentication",
      description: "Unique QR codes for each product to ensure authenticity"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Anti-Counterfeiting",
      description: "Advanced technology to detect and prevent fake products"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer Verification",
      description: "Easy-to-use interface for customers to verify products"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-time Analytics",
      description: "Monitor product authenticity and track fake reports"
    }
  ];

  const stats = [
    { number: "10M+", label: "Products Protected" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "500+", label: "Manufacturers" },
    { number: "24/7", label: "Monitoring" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="h-20 w-20 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Fake Product Detection System
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Protect consumers and manufacturers with advanced QR-based authentication technology. 
                Ensure product authenticity throughout the supply chain.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/manufacturer/signup"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
              >
                Register as Manufacturer
              </Link>
              <Link
                to="/customer/verify"
                className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors transform hover:scale-105"
              >
                Verify Product
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive solution for product authentication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple 3-step process for product verification
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-primary-100 dark:bg-primary-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Manufacturer Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manufacturers register and add products with unique QR codes
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 dark:bg-primary-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                2. QR Code Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Each product gets a unique QR code linked to the database
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-primary-100 dark:bg-primary-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Customer Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customers scan QR codes to verify product authenticity
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Products?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of manufacturers in the fight against counterfeit products
          </p>
          <Link
            to="/manufacturer/signup"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
