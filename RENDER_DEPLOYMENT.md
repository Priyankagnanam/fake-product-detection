# 🚀 Render Deployment Guide

This guide will help you deploy the Fake Product Detection System to Render.

## 📋 Prerequisites

- GitHub account with the repository: https://github.com/Priyankagnanam/fake-product-detection
- Render account (free tier available at https://render.com)
- MongoDB Atlas account (free tier available)

## 🗄️ Step 1: Set Up MongoDB Atlas

### Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Click **"Build a Database"**
4. Choose **"Free"** plan (M0 Sandbox)
5. Select a cloud provider and region (choose one close to your users)
6. Name your cluster (e.g., `fake-product-detection`)
7. Click **"Create"**
8. Wait for cluster creation (2-5 minutes)

### Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Username: `fakeguard` (or your preferred username)
3. Password: Generate a strong password (save this!)
4. Database User Privileges: Read and write to any database
5. Click **"Add User"**

### Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

### Get Connection String

1. Go to **Database** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **Node.js** and version **4.1 or later**
4. Copy the connection string (it looks like: `mongodb+srv://fakeguard:password@cluster.mongodb.net/fake-product-detection`)
5. Replace `<password>` with your actual password
6. Save this connection string for Render setup

## 🌐 Step 2: Deploy Backend to Render

### Create Render Account

1. Go to https://render.com
2. Click **"Sign Up"** and sign up with GitHub
3. Authorize Render to access your GitHub repositories

### Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository: `Priyankagnanam/fake-product-detection`
3. Configure the service:

**Name:** `fake-product-detection-backend`

**Region:** Choose a region (e.g., Oregon)

**Branch:** `main`

**Root Directory:** `server`

**Runtime:** `Node`

**Build Command:** `npm install`

**Start Command:** `node index.js`

### Environment Variables

Add the following environment variables:

1. **PORT:** `5000`
2. **NODE_ENV:** `production`
3. **MONGODB_URI:** (Paste your MongoDB Atlas connection string from Step 1)
4. **JWT_SECRET:** (Generate a strong random string, e.g., using: `openssl rand -base64 32`)

### Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy the backend URL (e.g., `https://fake-product-detection-backend.onrender.com`)
4. Test the health endpoint: `https://fake-product-detection-backend.onrender.com/health`

## 🎨 Step 3: Deploy Frontend to Render

### Create Frontend Service

1. Click **"New +"** → **"Web Service"**
2. Select the same repository: `Priyankagnanam/fake-product-detection`
3. Configure the service:

**Name:** `fake-product-detection-frontend`

**Region:** Same as backend

**Branch:** `main`

**Root Directory:** `client`

**Runtime:** `Node`

**Build Command:** `npm install && npm run build`

**Start Command:** `npm start`

**Publish Directory:** `build`

### Environment Variables

Add the following environment variable:

1. **REACT_APP_API_URL:** (Paste your backend URL from Step 2, e.g., `https://fake-product-detection-backend.onrender.com`)

### Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, copy the frontend URL

## 🔗 Step 4: Update Frontend API URL

After deploying the backend, you may need to update the frontend's API URL:

1. Go to your frontend service on Render
2. Click **"Environment"**
3. Update **REACT_APP_API_URL** to your backend URL
4. Click **"Save Changes"**
5. Render will automatically redeploy the frontend

## ✅ Step 5: Test Your Live Application

1. Open your frontend URL in a browser
2. Test manufacturer registration
3. Test product creation
4. Test QR code verification
5. Verify all features work correctly

## 📊 Live URLs

After successful deployment, you'll have:

- **Frontend:** `https://fake-product-detection-frontend.onrender.com`
- **Backend:** `https://fake-product-detection-backend.onrender.com`
- **API Health:** `https://fake-product-detection-backend.onrender.com/health`

## 🔧 Troubleshooting

### Backend Deployment Issues

**Issue:** Build fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in `server/package.json`

**Issue:** Database connection error
- Verify MongoDB Atlas connection string is correct
- Check Network Access allows 0.0.0.0/0
- Ensure database user has correct permissions

**Issue:** Port already in use
- Render automatically assigns ports, don't hardcode port 5000
- Use `process.env.PORT` in your code (already configured)

### Frontend Deployment Issues

**Issue:** Build fails
- Check build logs
- Ensure `npm run build` works locally

**Issue:** API calls failing
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is deployed and running

### Common Issues

**Issue:** Services not connecting
- Check both services are in the same region
- Verify environment variables are correct
- Check Render logs for errors

**Issue:** Slow performance
- Consider upgrading to paid Render plan
- Optimize database queries
- Enable caching

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically detects changes
4. Services rebuild and redeploy
5. New version goes live

## 💰 Cost

- **Render Free Tier:** 
  - Backend: Free (with some limitations)
  - Frontend: Free (with some limitations)
  - Total: $0/month

- **MongoDB Atlas Free Tier:**
  - 512 MB storage
  - Shared RAM
  - Total: $0/month

**Note:** Free tiers have limitations. For production use, consider upgrading.

## 📝 Notes

- Free tier services spin down after inactivity (15 minutes)
- First request after spin down may take 30-60 seconds
- Database connection strings contain sensitive data - keep them secure
- Regularly update dependencies for security
- Monitor logs in Render dashboard for issues

## 🎉 Success!

Your Fake Product Detection System is now live on Render! Share the frontend URL with users and start protecting products from counterfeiting.
