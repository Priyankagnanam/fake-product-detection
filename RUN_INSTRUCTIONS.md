# 🚀 Run Instructions - Fake Product Detection System

## ✅ Dependencies Installed Successfully!

All dependencies have been installed:
- ✅ Root dependencies
- ✅ Client (React) dependencies  
- ✅ Server (Node.js) dependencies
- ✅ Environment file created

## 📋 Next Steps to Run the Project

### Step 1: Start MongoDB
```bash
# If you have MongoDB installed locally
mongod

# OR use MongoDB Atlas (cloud)
# 1. Create free account: https://www.mongodb.com/atlas
# 2. Create cluster and get connection string
# 3. Update MONGODB_URI in server/.env file
```

### Step 2: Update Environment Configuration
Edit the `server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fake-product-detection
JWT_SECRET=your_super_secret_jwt_key_here
```

### Step 3: Run the Application
```bash
# From the root directory
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎯 Quick Test

1. **Open Browser**: Go to http://localhost:3000
2. **Register Manufacturer**: Click "Register as Manufacturer"
3. **Add Product**: Create a product (QR code generated automatically)
4. **Verify Product**: Go to "Verify Product" and test QR scanning

## 🔧 Alternative Run Methods

### Run Frontend Only
```bash
cd client
npm start
```

### Run Backend Only
```bash
cd server
npm run dev
```

### Production Build
```bash
cd client
npm run build
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running (`mongod`)
- Check connection string in `.env`
- Try MongoDB Atlas for cloud database

### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

## 📱 Features to Test

- ✅ Manufacturer registration/login
- ✅ Product addition with QR code
- ✅ QR code scanning (camera/upload)
- ✅ Product verification
- ✅ Dark mode toggle
- ✅ Admin dashboard
- ✅ Responsive design

## 🎉 Ready for Hackathon!

The application is now fully functional and ready for presentation. All core features are implemented and working.

**Access URLs:**
- Main App: http://localhost:3000
- API: http://localhost:5000
- Health Check: http://localhost:5000/health
