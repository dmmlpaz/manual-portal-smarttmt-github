FROM node:20-alpine AS runtime
WORKDIR /app

# Upgrade system packages to fix vulnerabilities
RUN apk update && apk upgrade

COPY . .

RUN npm install --package-lock-only
RUN npm audit fix --force
RUN npm install --production
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs