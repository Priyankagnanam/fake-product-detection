import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Building, Eye, EyeOff, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import API_URL from '../config/api';

const ManufacturerSignup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/manufacturer/signup`,
        {
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        }
      );

      if (response.data?.success) {
        toast.success('Registration successful! Please login.');
        navigate('/manufacturer/login');
      } else {
        toast.error(response.data?.message || 'Registration failed');
      }

    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
        'Server error. Please check backend route.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >

        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Manufacturer Registration
          </h2>
          <p className="text-sm text-gray-500">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">

          <input
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/manufacturer/login" className="text-blue-500">
              Login
            </Link>
          </p>

        </form>

      </motion.div>
    </div>
  );
};

export default ManufacturerSignup;
