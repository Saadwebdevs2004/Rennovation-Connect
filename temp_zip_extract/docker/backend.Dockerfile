# docker/backend.Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root monorepo manifest and backend manifest
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies for backend
RUN npm install --workspace=backend --omit=dev

# Copy backend files
COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]
