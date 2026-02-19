@echo off
REM Setup script for Peepal Export project
REM This script installs all dependencies for both backend and frontend

echo.
echo ========================================
echo Peepal Export - Project Setup
echo ========================================
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 20.x from https://nodejs.org/
    pause
    exit /b 1
)

echo Node version:
node --version
echo.

REM Setup Backend
echo ========================================
echo Setting up Backend...
echo ========================================
cd backend
echo Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
cd ..
echo.

REM Setup Frontend
echo ========================================
echo Setting up Frontend...
echo ========================================
cd frontend
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure MongoDB is running (mongod)
echo 2. Run 'start-dev.bat' to start both backend and frontend
echo 3. Visit http://localhost:4200 in your browser
echo.
pause
