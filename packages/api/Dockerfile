# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY packages/api/package*.json packages/api/tsconfig.json ./
RUN npm install
COPY packages/api/src ./src
COPY packages/api/scripts ./scripts
COPY shared ./shared
RUN ln -s /app/shared /shared
RUN npm run build

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY packages/api/package*.json packages/api/tsconfig.json ./
RUN npm install
COPY packages/api/src ./src
COPY packages/api/scripts ./scripts
COPY shared ./shared
RUN ln -s /app/shared /shared
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=1
ENV TS_NODE_TRANSPILE_ONLY=true
ENV TS_NODE_TYPE_CHECK=false
ENV NODE_PATH=/app
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
RUN ln -s /app/shared /shared
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start"]
