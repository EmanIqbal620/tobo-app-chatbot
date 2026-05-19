#!/bin/bash

# Build script for the frontend application
echo "Building the frontend application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"