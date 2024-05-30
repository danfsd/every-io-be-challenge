# Development/Base stage
FROM node:18-alpine AS base

WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .

# Build stage
FROM base as builder

WORKDIR /usr/src/app
# RUN npx prisma migrate deploy
RUN npm run build

# Production
FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usrc/src/app
COPY package*.json .
RUN npm ci
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
ENTRYPOINT ["node", "./dist/index.js"]
