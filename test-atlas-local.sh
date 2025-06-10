#!/bin/bash

echo "🧪 Testing with MongoDB Atlas locally..."

# Check if MongoDB URI is provided
if [ -z "$MONGODB_URI" ]; then
    echo "❌ Error: MONGODB_URI environment variable is required"
    echo "Usage: MONGODB_URI='your-atlas-uri' ./test-atlas-local.sh"
    exit 1
fi

# Variables
IMAGE_NAME="tips-hub-atlas-test"
CONTAINER_NAME="tips-hub-atlas-container"

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
}

# Trap to cleanup on exit
trap cleanup EXIT

# Build the image
echo "🔨 Building image with MongoDB Atlas support..."
docker build -f Dockerfile.render -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Test the image with Atlas
echo "🚀 Testing container with MongoDB Atlas..."
docker run -d \
    --name $CONTAINER_NAME \
    -p 4000:4000 \
    -e NODE_ENV=production \
    -e PORT=4000 \
    -e MONGODB_URI="$MONGODB_URI" \
    -e MONGO_DB_NAME="tips-hub-db" \
    -e JWT_SECRET="test-secret-key-for-local-testing" \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "❌ Container failed to start!"
    exit 1
fi

echo "⏳ Waiting for container to connect to Atlas..."
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container is running!"
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    sleep 5
    
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Health check passed! Atlas connection working!"
    else
        echo "⚠️  Health check failed - checking logs..."
    fi
    
    echo "📋 Container logs (last 20 lines):"
    docker logs $CONTAINER_NAME --tail 20
else
    echo "❌ Container is not running!"
    echo "📋 Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎉 Atlas test completed!"
echo "Container is running on http://localhost:4000"
echo "MongoDB Atlas connection: $(echo $MONGODB_URI | sed 's/\/\/.*@/\/\/***:***@/')"
echo ""
echo "Press any key to stop and cleanup..."
read -n 1