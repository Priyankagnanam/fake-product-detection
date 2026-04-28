import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import API_URL from '../config/api';

const ManufacturerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
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
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/manufacturer/login`,
        {
          email: formData.email,
          password: formData.password
        }
      );

      // ✅ safer check
      if (response.data && response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Login successful!');
        navigate('/manufacturer/dashboard');
      } else {
        toast.error(response.data?.message || 'Login failed');
      }

    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || 'Invalid credentials or server error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >

        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manufacturer Login
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/manufacturer/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>

        </form>

      </motion.div>
    </div>
  );
};

export default ManufacturerLogin;
