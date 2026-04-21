# 1. Etapa de construcción (Build)
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Instalar dependencias
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copiar el código fuente y generar cliente de Prisma
COPY . .
RUN bunx prisma generate

# 2. Etapa de ejecución (Final)
FROM oven/bun:1.1-slim
WORKDIR /app

# Copiar archivos necesarios desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Exponer el puerto (ajusta según lo que use tu app)
EXPOSE 3000

# Comando para ejecutar migraciones y luego iniciar la app
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]