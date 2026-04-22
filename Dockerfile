# 1. Build
FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN bunx prisma generate

COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./tsconfig.json

# 2. Runtime
FROM oven/bun:latest AS runtime
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3002

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]