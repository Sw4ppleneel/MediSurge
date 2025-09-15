# 🚀 Surge Planner - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Backend Setup (Already Complete!)
- [x] FastAPI app (`vercel_app.py`) created
- [x] Vercel configuration (`vercel.json`) added
- [x] API entry point (`api/index.py`) created
- [x] Dependencies (`requirements.txt`) updated
- [x] Authentication system implemented
- [x] Database models created
- [x] CORS configured

### 2. Frontend Setup (Already Complete!)
- [x] React components use environment variables
- [x] API integration implemented
- [x] Environment files created

### 3. Environment Variables Needed

**For Vercel (Backend):**
- `SECRET_KEY` - JWT secret key (generate with `openssl rand -hex 32`)
- `OPENAI_API_KEY` - Your OpenAI API key
- `ENVIRONMENT` - Set to "production"

**For React (Frontend):**
- `REACT_APP_API_URL` - Your Vercel deployment URL

## 🚀 Deployment Steps

### Deploy Backend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add SECRET_KEY production
   vercel env add OPENAI_API_KEY production
   vercel env add ENVIRONMENT production
   ```

4. **Deploy:**
   ```bash
   ./deploy_vercel.sh
   # OR manually:
   vercel --prod
   ```

5. **Get Your API URL:**
   - After deployment, note your Vercel URL (e.g., `https://surge-planner-xyz.vercel.app`)

### Update Frontend Configuration

1. **Update React Environment:**
   ```bash
   # Edit surge/.env.production
   REACT_APP_API_URL=https://your-actual-vercel-url.vercel.app
   ```

2. **Test Your API:**
   ```bash
   curl https://your-vercel-url.vercel.app/
   ```

### Deploy Frontend (Optional)

1. **Deploy React App to Vercel:**
   ```bash
   cd surge
   vercel --prod
   ```

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

- **Health Check:** `GET https://your-url.vercel.app/`
- **Signup:** `POST https://your-url.vercel.app/auth/signup`
- **Login:** `POST https://your-url.vercel.app/auth/login`
- **Create Plan:** `POST https://your-url.vercel.app/plan` (with auth)

## 🔥 Quick Start Commands

```bash
# 1. Deploy backend
./deploy_vercel.sh

# 2. Update frontend config (replace with your actual URL)
echo "REACT_APP_API_URL=https://your-vercel-url.vercel.app" > surge/.env.production

# 3. Test your API
curl https://your-vercel-url.vercel.app/

# 4. Deploy frontend (optional)
cd surge && vercel --prod
```

## 📱 Your App is Ready!

After following these steps:
- ✅ Backend API is live on Vercel
- ✅ Frontend can connect to your API
- ✅ Authentication works
- ✅ Plan generation works
- ✅ Database stores user data

## 🎯 Next Steps

1. **Custom Domain:** Add a custom domain in Vercel dashboard
2. **Production Database:** Consider PostgreSQL for production
3. **Monitoring:** Set up error tracking and monitoring
4. **Security:** Review CORS settings for production

Your Surge Planner is now production-ready! 🎉
