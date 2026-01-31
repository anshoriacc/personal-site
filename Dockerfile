# ---------- Build stage ----------
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:lts-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
