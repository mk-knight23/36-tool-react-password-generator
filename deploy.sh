#!/bin/bash

# VaultPass Secure Password Generator - Deployment Script
# Usage: ./deploy.sh [vercel|netlify]

set -e

PROJECT_NAME="36-tool-vaultpass-secure-password-generator"

case "${1:-vercel}" in
  vercel)
    echo "🚀 Deploying to Vercel..."
    npx vercel --prod
    ;;
  netlify)
    echo "🚀 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
    ;;
  *)
    echo "Usage: ./deploy.sh [vercel|netlify]"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"
echo "🌐 Live URL will be provided by the deployment platform."
