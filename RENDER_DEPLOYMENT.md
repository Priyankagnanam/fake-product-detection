# 🚀 Render Deployment Guide (PostgreSQL Version)

This guide will help you deploy the Fake Product Detection System to Render using PostgreSQL for free deployment.

## 📋 Prerequisites

- GitHub account with the repository: https://github.com/Priyankagnanam/fake-product-detection
- Render account (free tier available at https://render.com)

## 🗄️ Step 1: Set Up PostgreSQL on Render

Render provides free PostgreSQL databases. You don't need to set up an external database.

### Create PostgreSQL Database

1. Go to https://render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:

**Name:** `fake-product-detection-db`

**Database:** `fake_product_detection`

**User:** `fakeguard` (or your preferred username)

**Region:** Choose a region (e.g., Oregon)

**Plan:** Select **Free** tier

4. Click **"Create Database"**
5. Wait for database creation (1-2 minutes)

### Get Database Connection String

1. Once created, click on your database
2. Go to **"Connect"** → **"External Connection"**
3. Copy the **Internal Database URL** (it looks like: `postgres://fakeguard:password@dpg-xxxxx.oregon-postgres.render.com/fake_product_detection`)
4. Save this connection string for backend setup

**Note:** Render will automatically provide the `DATABASE_URL` environment variable to your backend service when they're in the same region.

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
3. **DATABASE_URL:** (Paste your PostgreSQL connection string from Step 1, or leave empty if using Render's automatic database linking)
4. **JWT_SECRET:** (Generate a strong random string, e.g., using: `openssl rand -base64 32`)

**Important:** If your PostgreSQL database and backend service are in the same region on Render, you can leave `DATABASE_URL` empty and Render will automatically link them. Otherwise, use the connection string from Step 1.

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

## 🔗 Step 4: Link Backend to PostgreSQL Database

If you created the PostgreSQL database and backend service in the same region:

1. Go to your backend service on Render
2. Click **"Environment"**
3. Scroll down to **"Databases"** section
4. Click **"Connect Database"**
5. Select your PostgreSQL database (`fake-product-detection-db`)
6. Render will automatically add the `DATABASE_URL` environment variable

If they're in different regions, manually add the `DATABASE_URL` from Step 1.

## 🔗 Step 5: Update Frontend API URL

After deploying the backend, you may need to update the frontend's API URL:

1. Go to your frontend service on Render
2. Click **"Environment"**
3. Update **REACT_APP_API_URL** to your backend URL
4. Click **"Save Changes"**
5. Render will automatically redeploy the frontend

## ✅ Step 6: Test Your Live Application

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
- Verify Sequelize and pg packages are installed

**Issue:** Database connection error
- Verify PostgreSQL connection string is correct
- Check if database and backend are in the same region
- Ensure database user has correct permissions
- Check if `DATABASE_URL` environment variable is set

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
- Ensure PostgreSQL database is linked to backend

**Issue:** Database not syncing
- Check Sequelize sync is working
- Verify database tables are created
- Check database logs in Render dashboard

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
  - PostgreSQL Database: Free (90 days, then $7/month after free credits)
  - Total: $0/month for first 90 days, then $7/month

**Note:** Render provides $7 in free credits every month, which covers the PostgreSQL database cost. So effectively, the entire deployment can remain free.

**Note:** Free tiers have limitations. For production use, consider upgrading.

## 📝 Notes

- Free tier services spin down after inactivity (15 minutes)
- First request after spin down may take 30-60 seconds
- Database connection strings contain sensitive data - keep them secure
- Regularly update dependencies for security
- Monitor logs in Render dashboard for issues

## 🎉 Success!

Your Fake Product Detection System is now live on Render! Share the frontend URL with users and start protecting products from counterfeiting.
