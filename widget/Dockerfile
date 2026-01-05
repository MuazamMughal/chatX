# Stage 1: Builder (install deps + build)
FROM node:23-alpine AS builder

WORKDIR /app

# Copy package files first → better caching
COPY package*.json ./
RUN npm ci

# Copy source code & build
COPY . .
RUN npm run build

# Stage 2: Production runner (smaller image)
FROM node:23-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Production start
CMD ["npm", "start"]