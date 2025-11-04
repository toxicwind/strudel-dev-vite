# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder
WORKDIR /app

# Workspace manifests
COPY package.json package-lock.json tsconfig.json playwright.config.ts ./
COPY packages ./packages
COPY apps ./apps

RUN npm ci
RUN npm run build
RUN npm run sampler:build

FROM node:20-alpine AS runner
WORKDIR /srv/app

RUN npm install -g serve@14

COPY --from=builder /app/dist ./dist
# Keep sampler output for reference/debug (optional volume mount)
COPY --from=builder /app/apps/sampler/dist ./sampler-dist

EXPOSE 8088
CMD ["serve", "-s", "dist", "-l", "8088"]
