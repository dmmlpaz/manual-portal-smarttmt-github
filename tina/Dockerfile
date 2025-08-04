# Etapa base
FROM node:22.15.0 AS base
WORKDIR /app
RUN npm install -g pnpm

# Etapa de dependencias
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# Etapa de construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN rm -rf ./content

# 3. Crear estructura de contenido mínima
RUN mkdir -p ./content/posts && \
    echo '{"posts":[]}' > ./content/index.json && \
    echo '{"title":"Sample","body":"Content"}' > ./content/posts/sample.md

# Variables de entorno para el build (ajusta según necesites)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV TINA_PUBLIC_IS_LOCAL=false

RUN pnpm run build

# Etapa de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV GITHUB_PERSONAL_ACCESS_TOKEN=''
ENV GITHUB_OWNER=dmmlpaz
ENV GITHUB_REPO=manual-portal-smarttmt-github
ENV MONGODB_URI=mongodb://root:tina-startlight@172.17.0.1:27017
ENV NEXTAUTH_SECRET=''
ENV TINA_PUBLIC_IS_LOCAL=true

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar lo necesario desde el builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar permisos después de copiar
RUN chown -R nextjs:nodejs /app/public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]