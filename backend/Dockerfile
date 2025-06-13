# Build stage
FROM node:20-alpine AS builder

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    build-base \
    linux-headers

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

RUN pnpm rebuild bcrypt

COPY . .

RUN pnpm run build
RUN pnpm run swagger

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

RUN pnpm rebuild bcrypt

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/swagger.json ./swagger.json

RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 -G nodejs

RUN chown -R backend:nodejs /app
USER backend

EXPOSE $PORT

CMD ["node", "dist/server.js"]