#!/bin/bash
# deploy_vercel.sh - Deploy Surge Planner API to Vercel

echo "🚀 Deploying Surge Planner API to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo "📝 Make sure you have set your environment variables:"
echo "   - SECRET_KEY (JWT secret)"
echo "   - OPENAI_API_KEY (OpenAI API key)"
echo ""
echo "To set them, run:"
echo "   vercel env add SECRET_KEY production"
echo "   vercel env add OPENAI_API_KEY production"
echo ""

read -p "Have you set your environment variables? (y/n): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Please set your environment variables first."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📱 Your API is now live at your Vercel URL"
echo "🔗 Update your React app's .env.production with the new URL"
echo "📖 See VERCEL_DEPLOYMENT.md for complete instructions"
