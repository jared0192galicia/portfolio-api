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

# Copiamos todo lo necesario para que Prisma y Bun funcionen
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
# IMPORTANTE: Copiamos los archivos de configuración de la raíz
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3002

# Usamos la variable de entorno directamente del sistema
# Nota: Asegúrate de que el nombre coincida exactamente con lo que tienes en Dokploy
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]