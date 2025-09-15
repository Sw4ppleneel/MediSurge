# Surge Planner - Vercel Deployment Guide

## 🚀 Deploy Your API to Vercel

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **Environment Variables**: OpenAI API key and JWT secret

### Step 1: Install Vercel CLI and Login
```bash
npm i -g vercel
vercel login
```

### Step 2: Set Environment Variables
Before deploying, set your environment variables in Vercel:

```bash
# Set your JWT secret key (generate a secure random string)
vercel env add SECRET_KEY production

# Set your OpenAI API key
vercel env add OPENAI_API_KEY production

# Optional: Set environment type
vercel env add ENVIRONMENT production
```

When prompted, enter your actual values:
- **SECRET_KEY**: Generate a secure random string (e.g., use `openssl rand -hex 32`)
- **OPENAI_API_KEY**: Your OpenAI API key from OpenAI dashboard
- **ENVIRONMENT**: `production`

### Step 3: Deploy to Vercel
From your project root directory:

```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Y
- **Which scope**: Choose your account
- **Link to existing project**: N (for first deployment)
- **Project name**: surge-planner (or your preferred name)
- **Directory**: ./ (current directory)
- **Override settings**: N

### Step 4: Your API is Live! 🎉
After deployment, Vercel will provide you with:
- **Deployment URL**: `https://your-project-name.vercel.app`
- **API Endpoints**:
  - `https://your-project-name.vercel.app/` (health check)
  - `https://your-project-name.vercel.app/auth/signup`
  - `https://your-project-name.vercel.app/auth/login`
  - `https://your-project-name.vercel.app/auth/me`
  - `https://your-project-name.vercel.app/plan`
  - `https://your-project-name.vercel.app/plans`

### Step 5: Update Frontend API URL
Update your React app's API configuration:

1. **Edit** `surge/src/components/Dashboard.jsx` and `surge/src/components/AuthModal.jsx`
2. **Replace** `const API_BASE_URL = 'http://localhost:8000';`
3. **With** `const API_BASE_URL = 'https://your-project-name.vercel.app';`

Or better yet, use environment variables in your React app:

1. **Create** `surge/.env.production`:
```bash
REACT_APP_API_URL=https://your-project-name.vercel.app
```

2. **Update components** to use:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### Step 6: Deploy Frontend to Vercel (Optional)
You can also deploy your React frontend to Vercel:

```bash
cd surge
vercel --prod
```

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | JWT secret key | `abc123...` (32+ char random string) |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `ENVIRONMENT` | Environment type | `production` |

## 🧪 Testing Your Deployment

Test your API endpoints:

```bash
# Health check
curl https://your-project-name.vercel.app/

# Signup
curl -X POST https://your-project-name.vercel.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","hospitalName":"Test Hospital"}'

# Login
curl -X POST https://your-project-name.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🔄 Updating Your Deployment

To update your deployment:
```bash
vercel --prod
```

## 📝 Notes

- **Database**: SQLite is used and will be reset on each deployment. For production, consider upgrading to PostgreSQL using Vercel's database add-ons.
- **CORS**: Currently set to allow all origins. Update `allow_origins` in `vercel_app.py` for production security.
- **Logs**: View deployment logs in the Vercel dashboard.

## 🎯 Next Steps

1. **Deploy API** using steps above
2. **Update frontend** with new API URL
3. **Test authentication** and plan creation
4. **Deploy frontend** to Vercel (optional)
5. **Set up custom domain** (optional)

Your Surge Planner API is now production-ready! 🚀
