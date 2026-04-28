import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Camera, CheckCircle, XCircle, AlertTriangle, Package, MapPin, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import QrScanner from 'qr-scanner';

const CustomerVerification = () => {
  const [qrCode, setQrCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showFakeReport, setShowFakeReport] = useState(false);
  const [reportData, setReportData] = useState({
    reason: '',
    description: '',
    reporterInfo: ''
  });
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const handleVerify = async () => {
    if (!qrCode.trim()) {
      toast.error('Please enter or scan a QR code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/verification/verify', {
        qrCode: qrCode.trim(),
        location: 'Customer Location',
        customerInfo: 'Anonymous Customer'
      });

      setVerificationResult(response.data);
      
      if (response.data.isGenuine) {
        toast.success('Product is genuine! ✅');
      } else {
        toast.error(response.data.message || 'Product verification failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      setVerificationResult({
        success: false,
        isGenuine: false,
        message: 'Product not found in database'
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setShowScanner(true);
      const videoElement = videoRef.current;
      
      qrScannerRef.current = new QrScanner(
        videoElement,
        result => {
          setQrCode(result.data);
          setShowScanner(false);
          qrScannerRef.current.stop();
          toast.success('QR code scanned successfully!');
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      await qrScannerRef.current.start();
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Failed to access camera');
      setShowScanner(false);
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setShowScanner(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      setQrCode(result);
      toast.success('QR code extracted from image!');
    } catch (error) {
      toast.error('No QR code found in the image');
    }
  };

  const handleFakeReport = async () => {
    if (!reportData.reason || !reportData.description || !reportData.reporterInfo) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/verification/report-fake', {
        qrCode: qrCode.trim(),
        ...reportData
      });

      toast.success('Fake product report submitted successfully!');
      setShowFakeReport(false);
      setReportData({ reason: '', description: '', reporterInfo: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Shield className="mx-auto h-16 w-16 text-primary-600 dark:text-primary-400 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Product Verification
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Scan or enter QR code to verify product authenticity
          </p>
        </motion.div>

        {/* Verification Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="space-y-6">
            {/* QR Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter QR Code
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Enter product QR code..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {/* Scan Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
              >
                <Camera className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-700 dark:text-gray-300">Scan with Camera</span>
              </button>

              <label className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-700 dark:text-gray-300">Upload QR Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </motion.div>

        {/* Camera Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scan QR Code</h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <video ref={videoRef} className="w-full rounded-lg" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                Position QR code within the frame
              </p>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              {verificationResult.isGenuine ? (
                <>
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Genuine Product ✅
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    This product is authentic and verified
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {verificationResult.message.includes('expired') ? 'Product Expired' : 'Fake Product'} ❌
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {verificationResult.message}
                  </p>
                </>
              )}
            </div>

            {/* Product Details */}
            {verificationResult.product && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Product Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {verificationResult.product.productName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Brand</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {verificationResult.product.brandName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manufacturing Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(verificationResult.product.manufacturingDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expiry Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(verificationResult.product.expiryDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {verificationResult.product.manufacturer && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Manufacturer Information</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {verificationResult.product.manufacturer.companyName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {verificationResult.product.manufacturer.email}
                    </p>
                  </div>
                )}

                <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4">
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    <strong>Verification Count:</strong> {verificationResult.product.verificationCount || 0} times verified
                  </p>
                </div>
              </div>
            )}

            {/* Report Fake Product Button */}
            {!verificationResult.isGenuine && !verificationResult.message.includes('expired') && (
              <div className="text-center">
                <button
                  onClick={() => setShowFakeReport(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Report Fake Product</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Fake Report Modal */}
        {showFakeReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Report Fake Product
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason
                  </label>
                  <select
                    value={reportData.reason}
                    onChange={(e) => setReportData({...reportData, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select reason</option>
                    <option value="packaging">Suspicious Packaging</option>
                    <option value="quality">Poor Quality</option>
                    <option value="price">Unusual Price</option>
                    <option value="seller">Unauthorized Seller</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={reportData.description}
                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                    rows={3}
                    placeholder="Describe why you believe this is a fake product..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Information
                  </label>
                  <input
                    type="text"
                    value={reportData.reporterInfo}
                    onChange={(e) => setReportData({...reportData, reporterInfo: e.target.value})}
                    placeholder="Name or contact information"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowFakeReport(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFakeReport}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerVerification;
