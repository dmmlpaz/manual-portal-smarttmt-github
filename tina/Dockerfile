# Stage 1: Builder - Aquí compilamos la aplicación
FROM node:22.15.0-alpine AS builder
WORKDIR /app

# 1. Instalar pnpm y dependencias
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --shamefully-hoist

# 2. Copiar el resto del código y hacer build
COPY . .

RUN rm -rf ./content

# 3. Crear estructura de contenido mínima
RUN mkdir -p ./content/posts && \
    echo '{"posts":[]}' > ./content/index.json && \
    echo '{"title":"Sample","body":"Content"}' > ./content/posts/sample.md

RUN pnpm run build

# Stage 2: Runtime - Solo llevamos lo necesario para producción
FROM node:22.15.0-alpine
WORKDIR /app

# 1. Instalar pnpm en la imagen final
RUN npm install -g pnpm

# Configurar usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar artefactos del build desde la etapa builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Configuración de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Ejecución
USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]