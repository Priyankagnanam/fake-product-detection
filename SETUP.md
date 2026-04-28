# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (installed locally or cloud instance)
- npm or yarn

## Step 1: Install Dependencies

```bash
# From the root directory
npm run install-deps
```

This will install dependencies for:
- Root project
- Client (React frontend)
- Server (Node.js backend)

## Step 2: Setup Environment Variables

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fake-product-detection
JWT_SECRET=your_super_secret_jwt_key_here
```

## Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## Step 4: Run the Application

```bash
# From the root directory
npm run dev
```

This will start both frontend and backend concurrently:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Alternative: Run Separately

**Frontend only:**
```bash
cd client
npm start
```

**Backend only:**
```bash
cd server
npm run dev
```

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Register as Manufacturer"
3. Create an account
4. Add a product
5. Go to "Verify Product" to test QR scanning

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify firewall settings

### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm run install-deps
```

### Camera Access Issues
- Use HTTPS in production for camera access
- Ensure browser permissions are granted
- Test with Chrome/Edge for best compatibility

## Default Credentials for Testing

After setup, you can:
1. Create a new manufacturer account
2. Use the customer verification page without login
3. Access admin features (simplified for demo)

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in `.env`
2. Use a proper JWT secret
3. Configure HTTPS
4. Set up a production database
5. Build the frontend: `cd client && npm run build`
