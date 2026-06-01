#!/bin/bash

# Build script for Dragons Flame with Import/Export functionality
# Usage: ./build-docker.sh [tag]

set -e

# Configuration
IMAGE_NAME="dragons-flame"
REGISTRY_NAME="ghcr.io/draco-lunaris"  # Change this to your GHCR org/owner (run `docker login ghcr.io` before push)
VERSION=$(node -p "require('./package.json').version")
TAG=${1:-$VERSION}

echo "🔥 Building Dragons Flame with Import/Export and Data Management functionality"
echo "📦 Version: $VERSION"
echo "🏷️  Tag: $TAG"
echo ""

# Build the Docker image
echo "🔨 Building Docker image..."
docker build \
  -t $IMAGE_NAME:latest \
  -t $IMAGE_NAME:$TAG \
  -f Dockerfile \
  .

echo ""
echo "✅ Docker image built successfully!"
echo "🏷️  Tagged as:"
echo "   - $IMAGE_NAME:latest"
echo "   - $IMAGE_NAME:$TAG"
echo ""

# Optional: Push to registry
read -p "📤 Do you want to push to Docker registry? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to Docker registry..."
    
    # Tag with registry name
    docker tag $IMAGE_NAME:latest $REGISTRY_NAME/$IMAGE_NAME:latest
    docker tag $IMAGE_NAME:$TAG $REGISTRY_NAME/$IMAGE_NAME:$TAG
    
    # Push to registry
    docker push $REGISTRY_NAME/$IMAGE_NAME:latest
    docker push $REGISTRY_NAME/$IMAGE_NAME:$TAG
    
    echo "✅ Successfully pushed to registry!"
    echo "🌐 Available at:"
    echo "   - $REGISTRY_NAME/$IMAGE_NAME:latest"
    echo "   - $REGISTRY_NAME/$IMAGE_NAME:$TAG"
else
    echo "ℹ️  Skipping registry push"
fi

echo ""
echo "🚀 Ready to deploy! Use one of these commands:"
echo ""
echo "📦 Using Docker Compose (recommended):"
echo "   docker-compose up -d"
echo ""
echo "🐳 Using Docker directly:"
echo "   docker run -d -p 5005:5005 -v dragons_flame_data:/app/data --name dragons-flame $IMAGE_NAME:$TAG"
echo ""
echo "🌐 Access your Dragons Flame instance at: http://localhost:5005"
echo "📊 Import/Export and Data Management available at: http://localhost:5005/settings"