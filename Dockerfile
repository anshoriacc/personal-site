# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# Build app (this runs Vite + Nitro build)
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Only production deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; \
  fi

# Copy built output (including .output)
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
