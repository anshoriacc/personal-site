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

RUN apk add --no-cache dumb-init

COPY --from=builder /app/package.json ./

COPY --from=builder /app/.output ./.output

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
