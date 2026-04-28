import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, QrCode, Eye, Edit, Trash2, BarChart3, TrendingUp, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import QRCode from 'qrcode';

const ManufacturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    brandName: '',
    manufacturingDate: '',
    expiryDate: '',
    category: '',
    price: '',
    batchNumber: '',
    description: '',
    specifications: {
      weight: '',
      dimensions: '',
      color: '',
      size: ''
    }
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Product added successfully!');
        setShowAddProduct(false);
        setFormData({
          productName: '',
          brandName: '',
          manufacturingDate: '',
          expiryDate: '',
          category: '',
          price: '',
          batchNumber: '',
          description: '',
          specifications: {
            weight: '',
            dimensions: '',
            color: '',
            size: ''
          }
        });
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodeImage = async (qrData) => {
    try {
      return await QRCode.toDataURL(qrData);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.companyName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your products and monitor their authenticity
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'products', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Package className="h-6 w-6 text-blue-600" />}
                title="Total Products"
                value={stats.totalProducts || 0}
                color="bg-blue-100 dark:bg-blue-900"
              />
              <StatCard
                icon={<Shield className="h-6 w-6 text-green-600" />}
                title="Verified Products"
                value={stats.verifiedProducts || 0}
                color="bg-green-100 dark:bg-green-900"
              />
              <StatCard
                icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                title="Total Verifications"
                value={stats.totalVerifications || 0}
                color="bg-purple-100 dark:bg-purple-900"
              />
              <StatCard
                icon={<Users className="h-6 w-6 text-orange-600" />}
                title="Active Scans"
                value={stats.recentProducts?.length || 0}
                color="bg-orange-100 dark:bg-orange-900"
              />
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Products
              </h2>
              <div className="space-y-3">
                {stats.recentProducts?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{product.brandName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Verifications</p>
                      <p className="font-semibold text-primary-600 dark:text-primary-400">{product.verificationCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Products</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.brandName}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="text-gray-900 dark:text-white">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="text-gray-900 dark:text-white">${product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Verifications:</span>
                        <span className="text-primary-600 dark:text-primary-400 font-semibold">
                          {product.verificationCount}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>QR Code</span>
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="text-gray-600 dark:text-gray-300">
                Detailed analytics and insights coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.manufacturingDate}
                      onChange={(e) => setFormData({...formData, manufacturingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedProduct.productName}
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="text-gray-900 dark:text-white">{selectedProduct.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">{selectedProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="text-gray-900 dark:text-white">${selectedProduct.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Batch:</span>
                  <span className="text-gray-900 dark:text-white">{selectedProduct.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Verifications:</span>
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {selectedProduct.verificationCount}
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">QR Code:</p>
                <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                  {selectedProduct.qrCode}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
