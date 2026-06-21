# docker/frontend.Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy manifests
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install build dependencies
RUN npm install --workspace=frontend

# Copy frontend source
COPY frontend/ ./frontend/

# Setup environmental variable for static compile phase
ENV NEXT_PUBLIC_API_URL=http://localhost:3001

# Build application
RUN npm run build --workspace=frontend

# Runner phase
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install only production dependencies
RUN npm install --workspace=frontend --omit=dev

# Copy compiled resources and source files
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.mjs ./frontend/next.config.mjs
COPY frontend/package.json ./frontend/package.json

WORKDIR /app/frontend

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
