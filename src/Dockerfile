FROM node:20-alpine

WORKDIR /app

# Step 1: Fix line endings during the build (Optional but helpful)
RUN apk add --no-cache dos2unix

COPY package*.json ./
RUN npm install

COPY . .

# Step 2: Force the container to use Linux line endings for node_modules/.bin
RUN find node_modules/.bin -type f -exec dos2unix {} +

EXPOSE 5173

# Step 3: Use the host flag so Jenkins/Docker can route traffic to it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]