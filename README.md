# Fake Product Detection System

A modern web application for detecting counterfeit products using QR code authentication technology. Built with React.js, Node.js, Express.js, MongoDB, and Tailwind CSS.

## 🎯 Features

### Core Features
- **Manufacturer Authentication**: Secure login/signup system for manufacturers
- **Product Management**: Add products with automatic QR code generation
- **Customer Verification**: Scan or upload QR codes to verify product authenticity
- **Admin Dashboard**: Monitor fake product reports and system analytics
- **Dark Mode**: Beautiful dark/light theme toggle
- **Responsive Design**: Mobile-friendly interface with animations

### Advanced Features
- **Real-time Analytics**: Dashboard with charts and insights
- **Product Journey Tracking**: Complete supply chain visibility
- **Fake Product Reporting**: Customers can report suspicious products
- **Manufacturer Statistics**: Track product performance and verification counts
- **QR Code Scanner**: Built-in camera scanner for mobile devices

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **QR Scanner** - QR code scanning library
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation
- **Helmet** - Security middleware

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fake-product-detection-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Setup environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # From root directory
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🚀 Usage

### For Manufacturers
1. Register as a manufacturer
2. Add products with details (name, brand, dates, etc.)
3. Each product gets a unique QR code automatically
4. Monitor product verification statistics
5. Track product journey through the supply chain

### For Customers
1. Visit the verification page
2. Scan QR code using camera or upload image
3. Get instant authenticity verification
4. View product details and manufacturer information
5. Report suspicious products if needed

### For Administrators
1. Access admin dashboard with authentication
2. Monitor system statistics and analytics
3. View fake product reports
4. Manage manufacturers and products
5. Analyze verification trends

## 📊 Project Structure

```
fake-product-detection-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── .env.example
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/manufacturer/signup` - Register manufacturer
- `POST /api/auth/manufacturer/login` - Manufacturer login
- `GET /api/auth/manufacturer/profile` - Get manufacturer profile

### Products
- `POST /api/products/add` - Add new product
- `GET /api/products/my-products` - Get manufacturer's products
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Verification
- `POST /api/verification/verify` - Verify product by QR code
- `POST /api/verification/report-fake` - Report fake product
- `GET /api/verification/journey/:productId` - Get product journey

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/manufacturers` - Get all manufacturers
- `GET /api/admin/products` - Get all products
- `GET /api/admin/fake-reports` - Get fake product reports
- `GET /api/admin/analytics` - Get analytics data

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: Semantic HTML and ARIA labels
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Security Headers**: Helmet middleware for security

## 📈 Analytics & Monitoring

- **Real-time Statistics**: Live verification counts
- **Dashboard Charts**: Visual data representation
- **Product Analytics**: Track verification trends
- **Manufacturer Insights**: Performance metrics
- **Fake Report Analysis**: Identify counterfeit patterns

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
# Deploy the build/ folder to your hosting service
```

### Backend (Node.js)
```bash
cd server
npm start
# Deploy to your preferred cloud platform
```

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (development/production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Ready

This project is fully prepared for hackathon presentations:

- ✅ Complete working application
- ✅ Professional UI/UX design
- ✅ Comprehensive feature set
- ✅ Real-world problem solving
- ✅ Scalable architecture
- ✅ Well-documented code
- ✅ Easy deployment setup

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Fake Product Detection Challenge**
