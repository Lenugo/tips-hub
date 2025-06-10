#!/bin/bash

echo "🧪 Testing Render build locally..."

# Variables
IMAGE_NAME="tips-hub-render-test"
CONTAINER_NAME="tips-hub-render-container"

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
echo "🔨 Building Render image..."
docker build -f Dockerfile.render -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Test the image
echo "🚀 Testing the container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p 4000:4000 \
    -e NODE_ENV=production \
    -e PORT=4000 \
    -e MONGODB_URI="mongodb://host.docker.internal:27017/tips-hub-db" \
    -e JWT_SECRET="test-secret-key" \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "❌ Container failed to start!"
    exit 1
fi

echo "⏳ Waiting for container to be ready..."
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container is running!"
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    sleep 5
    
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
    else
        echo "⚠️  Health check failed (this might be normal if MongoDB is not running locally)"
    fi
    
    echo "📋 Container logs:"
    docker logs $CONTAINER_NAME --tail 10
else
    echo "❌ Container is not running!"
    echo "📋 Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎉 Local test completed!"
echo "Container is running on http://localhost:4000"
echo "Press any key to stop and cleanup..."
read -n 1