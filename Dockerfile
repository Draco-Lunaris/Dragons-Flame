FROM node:24-bookworm AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install server dependencies
RUN npm ci --omit=dev

# Copy all source files
COPY . .

# Build client application
RUN mkdir -p ./public ./data     && cd ./client     && npm ci --legacy-peer-deps     && npm run build     && cd ..     && mv ./client/build/* ./public     && rm -rf ./client

# Production stage
FROM node:24-alpine

# Copy built application
COPY --from=builder /app /app

WORKDIR /app

# Rebuild native modules (sqlite3) for musl libc (alpine uses musl, not glibc).
# The builder stage compiles on glibc (bookworm) which produces an incompatible
# .node binary for the alpine runtime. Rebuilding in-place links against musl.
# Use NPM_CONFIG_BUILD_FROM_SOURCE env var instead of --build-from-source CLI flag
# (npm 11 treats the CLI flag as an unknown config and falls through to prebuild-install).
RUN apk add --no-cache --virtual .build-deps python3 make g++     && NPM_CONFIG_BUILD_FROM_SOURCE=true npm rebuild sqlite3     && apk del .build-deps

# Create non-root user
RUN addgroup -g 1001 -S nodejs     && adduser -S flame -u 1001

# Set permissions
RUN chown -R flame:nodejs /app/data /app/public     && chmod -R 755 /app/data /app/public

# Expose port
EXPOSE 5005

# Environment variables
ENV NODE_ENV=production
ENV PASSWORD=flame_password

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3     CMD node -e "require('http').get('http://localhost:5005/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Switch to non-root user
USER flame

# Start the application
CMD ["node", "server.js"]
