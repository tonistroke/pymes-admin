# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the application's port
EXPOSE 8085

# Start the application
CMD ["node", "index.js"]
