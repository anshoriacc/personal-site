# ---------- Build stage ----------
FROM node:lts-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init curl

COPY --from=builder /app/package.json ./

COPY --from=builder /app/.output ./.output

COPY --from=builder /app/node_modules/@vercel/og/dist/ ./.output/server/_chunks/_libs/@vercel/

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
