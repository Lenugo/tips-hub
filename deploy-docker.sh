#!/bin/bash

IMAGE_NAME="tips-hub-backend"
DOCKER_USERNAME="lenugo97" 
VERSION="latest"
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"

echo "🚀 Building Docker Image..."
docker build -f Dockerfile.render -t $FULL_IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo "✅ Image built successfully: $FULL_IMAGE_NAME"
    
    echo "🔄 Uploading image to Docker Hub..."
    docker push $FULL_IMAGE_NAME
    
    if [ $? -eq 0 ]; then
        echo "✅ Image uploaded to Docker Hub"
        echo "📋 Image URL: $FULL_IMAGE_NAME"
        echo ""
        echo "🔧 To use on Render.com:"
        echo "   - Tipe: Web Service"
        echo "   - Source: Docker Image"
        echo "   - Image URL: $FULL_IMAGE_NAME"
        echo "   - Port: 4000"
    else
        echo "❌ Error uploading the image"
        exit 1
    fi
else
    echo "❌ Error building the image"
    exit 1
fi