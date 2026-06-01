docker buildx build \
  --platform linux/arm/v7,linux/arm64,linux/amd64 \
  -f .docker/Dockerfile.multiarch \
  -t ghcr.io/draco-lunaris/dragons-flame:multiarch \
  -t "ghcr.io/draco-lunaris/dragons-flame:multiarch$1" \
  --push .