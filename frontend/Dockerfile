FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 3000

# Development mode with hot reload
CMD ["npm", "run", "dev"]
