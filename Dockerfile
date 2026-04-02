FROM node:20-alpine

WORKDIR /app

# Ensure node is in PATH
ENV PATH="/usr/local/bin:$PATH"

# Copy package files and install dependencies first for layer caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . ./

EXPOSE 5173

# Vite development server, bind to all interfaces for container use
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]