FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies first for layer caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . ./

EXPOSE 5173

# Vite development server, bind to all interfaces for container use
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]