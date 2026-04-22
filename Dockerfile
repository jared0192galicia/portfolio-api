# 1. Build
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bunx prisma generate

# 2. Runtime
FROM oven/bun:latest-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
# Copiamos todo lo que pueda ser necesario para la configuración
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3002

# Debug y Ejecución
# Imprimimos variables para verificar que llegan y forzamos la variable estándar
CMD ["sh", "-c", "echo 'Checking variables...'; env | grep POSTGRES_URL; DATABASE_URL=$POSTGRES_URL bunx prisma migrate deploy && bun run start"]