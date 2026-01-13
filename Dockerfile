# ---------- Build stage ----------
FROM node:24-alpine AS builder
WORKDIR /app

# Only package.json since you have no lockfile
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
