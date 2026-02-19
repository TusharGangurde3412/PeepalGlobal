#!/bin/bash

# Development startup script for Peepal Export
# This script starts both backend and frontend servers

echo ""
echo "========================================"
echo "Peepal Export - Development Mode"
echo "========================================"
echo ""

echo "Make sure MongoDB is running!"
echo ""

# Start Backend
echo "Starting backend server..."
cd backend || exit 1
npm start &
BACKEND_PID=$!
cd ..

sleep 2

# Start Frontend
echo "Starting frontend server..."
cd frontend || exit 1
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:4200"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait
