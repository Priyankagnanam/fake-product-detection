import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, AlertTriangle, TrendingUp, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_URL from '../config/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [manufacturers, setManufacturers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fakeReports, setFakeReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setManufacturers(statsRes.data.stats.topManufacturers || []);
      }

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/manufacturers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setManufacturers(response.data.manufacturers);
      }
    } catch (error) {
      toast.error('Failed to fetch manufacturers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchFakeReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/fake-reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFakeReports(response.data.fakeReports);
      }
    } catch (error) {
      toast.error('Failed to fetch fake reports');
    }
  };

  useEffect(() => {
    if (activeTab === 'manufacturers') fetchManufacturers();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'reports') fetchFakeReports();
  }, [activeTab]);

  const StatCard = ({ icon, title, value, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Monitor system performance and manage fake product reports
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'manufacturers', 'products', 'reports', 'analytics'].map((tab) => (
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
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Total Manufacturers"
                value={stats.totalManufacturers || 0}
                color="bg-blue-100 dark:bg-blue-900"
                trend="+12% from last month"
              />
              <StatCard
                icon={<Package className="h-6 w-6 text-green-600" />}
                title="Total Products"
                value={stats.totalProducts || 0}
                color="bg-green-100 dark:bg-green-900"
                trend="+8% from last month"
              />
              <StatCard
                icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
                title="Total Verifications"
                value={stats.totalVerifications || 0}
                color="bg-purple-100 dark:bg-purple-900"
                trend="+25% from last month"
              />
              <StatCard
                icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
                title="Fake Reports"
                value={stats.fakeReports || 0}
                color="bg-red-100 dark:bg-red-900"
              />
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Products
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Verifications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fake Reports
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.recentProducts?.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.brandName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {product.manufacturer?.companyName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.verificationCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                          {product.fakeReports?.length || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Manufacturers Tab */}
        {activeTab === 'manufacturers' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Manufacturers
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Verifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {manufacturers.map((manufacturer, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {manufacturer.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {manufacturer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {manufacturer.productCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {manufacturer.totalVerifications}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          manufacturer.isVerified 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {manufacturer.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              All Products
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Verifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.productName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.brandName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.manufacturer?.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.verificationCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Fake Product Reports
            </h2>
            <div className="space-y-4">
              {fakeReports.map((report, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {report.product.name} - {report.product.brand}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Reported by: {report.reportedBy}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900 rounded p-2 mb-2">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Reason: {report.reason}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {report.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Manufacturer: {report.product.manufacturer?.companyName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Daily Verifications Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Daily Verifications (Last 30 Days)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyVerifications || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Products by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Products by Category
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.productsByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(analytics.productsByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Verified Products */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Top Verified Products
                </h2>
                <div className="space-y-3">
                  {analytics.topVerifiedProducts?.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.productName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {product.manufacturer?.companyName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {product.verificationCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">verifications</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fake Reports by Reason */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Fake Reports by Reason
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.fakeReportsByReason || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
