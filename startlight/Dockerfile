# Etapa 1: Build
FROM node:20-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar solo los archivos necesarios primero para aprovechar la caché
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instalar dependencias necesarias para el build (sin dev)
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Build de la app (ajusta si tu comando es distinto)
RUN pnpm run build

# Etapa 2: Runtime
FROM node:20-alpine AS runtime

# Instalar pnpm en el entorno final si lo necesitas (opcional)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Solo copiar lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Variables de entorno
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

# Comando de inicio
CMD ["node", "./dist/server/entry.mjs"]
