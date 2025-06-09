#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying Tips Hub to Render.com...${NC}"

# Pre-deployment checks
echo -e "${BLUE}🔍 Step 1: Pre-deployment checks...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo "Commit them first or they won't be deployed"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check required files
REQUIRED_FILES=("Dockerfile.render" "render.yaml" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"

# Build and test locally first (optional)
echo -e "${BLUE}🔍 Step 2: Quick local build test...${NC}"
docker build -f Dockerfile.render -t tips-hub-render-deploy-test . > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build test passed${NC}"
    docker rmi tips-hub-render-deploy-test > /dev/null 2>&1
else
    echo -e "${RED}❌ Local build test failed${NC}"
    exit 1
fi

# Commit current changes if any
echo -e "${BLUE}📝 Step 3: Preparing commit...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo "Adding current changes..."
    git add .
    git commit -m "Deploy: Update configuration for Render deployment"
fi

# Push to main branch (triggers Render deployment)
echo -e "${BLUE}🚀 Step 4: Triggering Render deployment...${NC}"
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  You're not on the main branch (current: $CURRENT_BRANCH)${NC}"
    read -p "Switch to main and deploy? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        git merge $CURRENT_BRANCH
    else
        echo "Deployment cancelled"
        exit 1
    fi
fi

echo "Pushing to main branch..."
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code pushed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to push code${NC}"
    exit 1
fi

# Provide post-deployment instructions
echo ""
echo -e "${GREEN}🎉 Deployment initiated successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Go to your Render Dashboard: https://dashboard.render.com"
echo "2. Find your 'tips-hub-backend' service"
echo "3. Check the deployment logs"
echo "4. Configure environment variables if not set:"
echo -e "   ${YELLOW}• MONGODB_URI${NC} (your Atlas connection string)"
echo -e "   ${YELLOW}• JWT_SECRET${NC} (auto-generated)"
echo -e "   ${YELLOW}• NODE_ENV${NC} = production"
echo -e "   ${YELLOW}• PORT${NC} = 4000"
echo ""
echo -e "${BLUE}🔗 Useful links:${NC}"
echo "• Render Dashboard: https://dashboard.render.com"
echo "• MongoDB Atlas: https://cloud.mongodb.com"
echo ""
echo -e "${YELLOW}⏳ The deployment will take 5-10 minutes to complete${NC}"
echo -e "${GREEN}✨ Your app will be available at: https://tips-hub-backend.onrender.com${NC}"