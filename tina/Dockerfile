FROM node:22.15.0-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Create user and set permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/tina/__generated__ /app/public/admin && \
    chown -R nextjs:nodejs /app

# Copy package files
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --shamefully-hoist && \
    chown -R nextjs:nodejs /app/node_modules

# Copy app files
COPY --chown=nextjs:nodejs . .

USER nextjs

# Runtime config
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
EXPOSE 4001
CMD ["pnpm", "prod"]