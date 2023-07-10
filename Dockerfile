# Use the official Node.js runtime as the base image
FROM node:14-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application dependencies (ignoring optional dependencies)
RUN npm install --legacy-peer-deps

# Copy the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the application on port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
