#!/bin/bash

# Setup script for Peepal Export project
# This script installs all dependencies for both backend and frontend

echo ""
echo "========================================"
echo "Peepal Export - Project Setup"
echo "========================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 20.x from https://nodejs.org/"
    exit 1
fi

echo "Node version:"
node --version
echo ""

# Setup Backend
echo "========================================"
echo "Setting up Backend..."
echo "========================================"
cd backend || exit 1
echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
echo "Backend dependencies installed successfully!"
cd ..
echo ""

# Setup Frontend
echo "========================================"
echo "Setting up Frontend..."
echo "========================================"
cd frontend || exit 1
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
echo "Frontend dependencies installed successfully!"
cd ..
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is running (mongod)"
echo "2. Run './start-dev.sh' to start both backend and frontend"
echo "3. Visit http://localhost:4200 in your browser"
echo ""
