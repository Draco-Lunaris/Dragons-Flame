docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile \
  -t ghcr.io/draco-lunaris/dragons-flame:multiarch \
  -t "ghcr.io/draco-lunaris/dragons-flame:multiarch$1" \
  --push .