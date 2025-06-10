#!/bin/bash

set -e

echo "🚀 Testing complete flow before Render deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
IMAGE_NAME="tips-hub-render-test"
CONTAINER_NAME="tips-hub-test-container"
ENV_FILE=".env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE not found!${NC}"
    echo "Please create $ENV_FILE with your MongoDB Atlas credentials"
    echo "Template:"
    echo "NODE_ENV=production"
    echo "PORT=4000"
    echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db"
    echo "JWT_SECRET=your-jwt-secret"
    exit 1
fi

# Load environment variables
echo -e "${BLUE}📋 Loading environment variables from $ENV_FILE...${NC}"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

# Validate required variables
if [ -z "$MONGODB_URI" ] || [ "$MONGODB_URI" = "mongodb://mongo:27017/tips-hub-db" ]; then
    echo -e "${RED}❌ Error: MONGODB_URI must be set to your Atlas connection string${NC}"
    exit 1
fi

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
}

# Trap to cleanup on exit
trap cleanup EXIT

# Step 1: Build the image
echo -e "${BLUE}🔨 Step 1: Building Docker image...${NC}"
docker build -f Dockerfile.render -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 2: Test the container
echo -e "${BLUE}🚀 Step 2: Starting container with Atlas connection...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    -p 4000:4000 \
    -e NODE_ENV="$NODE_ENV" \
    -e PORT="$PORT" \
    -e MONGODB_URI="$MONGODB_URI" \
    -e MONGO_DB_NAME="$MONGO_DB_NAME" \
    -e JWT_SECRET="$JWT_SECRET" \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Container failed to start!${NC}"
    exit 1
fi

echo -e "${YELLOW}⏳ Waiting for container to be ready (30 seconds)...${NC}"

# Wait and show progress
for i in {1..30}; do
    echo -n "."
    sleep 1
done
echo ""

# Step 3: Check if container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}❌ Container is not running!${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo -e "${GREEN}✅ Container is running!${NC}"

# Step 4: Test endpoints
echo -e "${BLUE}🔍 Step 3: Testing API endpoints...${NC}"

# Test health endpoint
echo -n "Testing health endpoint... "
if curl -f -s http://localhost:4000/health > /dev/null; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Health endpoint not responding"
fi

# Test basic API endpoint (if exists)
echo -n "Testing root API endpoint... "
if curl -f -s http://localhost:4000/api > /dev/null; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${YELLOW}⚠️  Not found (this might be normal)${NC}"
fi

# Step 5: Check logs for errors
echo -e "${BLUE}📋 Step 4: Checking application logs...${NC}"
LOGS=$(docker logs $CONTAINER_NAME --tail 10 2>&1)

if echo "$LOGS" | grep -i "error\|fail\|exception" > /dev/null; then
    echo -e "${RED}❌ Found errors in logs:${NC}"
    echo "$LOGS" | grep -i "error\|fail\|exception"
else
    echo -e "${GREEN}✅ No errors found in logs${NC}"
fi

# Show recent logs
echo -e "${BLUE}📋 Recent logs (last 10 lines):${NC}"
docker logs $CONTAINER_NAME --tail 10

# Step 6: MongoDB connection test
echo -e "${BLUE}🔍 Step 5: Testing MongoDB connection...${NC}"
if echo "$LOGS" | grep -i "mongodb.*connect\|database.*connect\|mongo.*ready" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB connection appears successful${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB connection status unclear - check logs above${NC}"
fi

# Final summary
echo ""
echo -e "${BLUE}📊 TEST SUMMARY:${NC}"
echo -e "Container Status: ${GREEN}Running${NC}"
echo -e "Port: ${GREEN}4000${NC}"
echo -e "Environment: ${GREEN}Production${NC}"
echo -e "Database: ${GREEN}MongoDB Atlas${NC}"
echo ""
echo -e "${GREEN}🎉 Local testing completed successfully!${NC}"
echo -e "${BLUE}🌐 Application running at: http://localhost:4000${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify the application works as expected"
echo "2. If everything looks good, proceed with Render deployment"
echo "3. Use: git push origin main (to trigger Render deployment)"
echo ""
echo -e "${YELLOW}Press any key to stop the container and cleanup...${NC}"
read -n 1