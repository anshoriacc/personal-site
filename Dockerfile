# ---------- Build stage ----------
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN rm -rf node_modules/.vite && npm run build

# ---------- Runtime stage ----------
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install dumb-init for signal handling and curl for Coolify health checks
RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/.output ./.output

# Copy @vercel/og assets (required for OG image generation)
COPY --from=builder /app/node_modules/@vercel/og/dist/ ./.output/server/_chunks/_libs/@vercel/

USER nodejs

EXPOSE 3000

# Use dumb-init to handle signals properly, run node directly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]
