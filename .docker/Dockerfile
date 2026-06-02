FROM node:24-bookworm AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p ./public ./data \
    && cd ./client \
    && npm ci --legacy-peer-deps \
    && npm run build \
    && cd .. \
    && mv ./client/build/* ./public \
    && rm -rf ./client

FROM node:24-alpine

COPY --from=builder /app /app

WORKDIR /app

EXPOSE 5005

ENV NODE_ENV=production
ENV PASSWORD=dragons_flame_password

CMD ["sh", "-c", "chown -R node /app/data && node server.js"]
