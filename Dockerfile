# 1. Build
FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bunx prisma generate

# 2. Runtime
FROM oven/bun:1.1-slim
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3002

# Deploy
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]