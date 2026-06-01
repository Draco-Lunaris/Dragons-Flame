#!/bin/bash

# Multi-architecture build script for Dragons Flame with Import/Export functionality
# Builds for AMD64, ARM64, and ARMv7 (Raspberry Pi compatible)
# Usage: ./build-multiarch.sh [tag]

set -e

# Configuration
IMAGE_NAME="dragons-flame"
REGISTRY_NAME="ghcr.io/draco-lunaris"  # Change this to your GHCR org/owner (run `docker login ghcr.io` before push)
VERSION=$(node -p "require('./package.json').version")
TAG=${1:-$VERSION}

echo "🔥 Building Multi-Architecture Dragons Flame with Import/Export and Data Management"
echo "📦 Version: $VERSION"
echo "🏷️  Tag: $TAG"
echo "🏗️  Architectures: linux/amd64, linux/arm64, linux/arm/v7"
echo ""

# Setup buildx if not already done
if ! docker buildx ls | grep -q multiarch-builder; then
    echo "🔧 Setting up Docker buildx..."
    docker buildx create --name multiarch-builder --use
    docker buildx inspect --bootstrap
fi

# Build multi-architecture image
echo "🔨 Building multi-architecture Docker image..."
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t $REGISTRY_NAME/$IMAGE_NAME:$TAG \
  -t $REGISTRY_NAME/$IMAGE_NAME:latest \
  -t $REGISTRY_NAME/$IMAGE_NAME:multiarch-$TAG \
  -f Dockerfile \
  --push \
  .

echo ""
echo "✅ Multi-architecture Docker image built and pushed successfully!"
echo "🏷️  Available tags:"
echo "   - $REGISTRY_NAME/$IMAGE_NAME:latest"
echo "   - $REGISTRY_NAME/$IMAGE_NAME:$TAG"
echo "   - $REGISTRY_NAME/$IMAGE_NAME:multiarch-$TAG"
echo ""
echo "🏗️  Supported architectures:"
echo "   - linux/amd64 (Intel/AMD 64-bit)"
echo "   - linux/arm64 (ARM 64-bit)"
echo "   - linux/arm/v7 (ARM 32-bit, Raspberry Pi)"
echo ""
echo "🚀 Deploy on any architecture using:"
echo "   docker run -d -p 5005:5005 -v dragons_flame_data:/app/data --name dragons-flame $REGISTRY_NAME/$IMAGE_NAME:$TAG"
echo ""
echo "🌐 Access your Dragons Flame instance at: http://localhost:5005"
echo "📊 Import/Export and Data Management available at: http://localhost:5005/settings"