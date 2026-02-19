@echo off
REM Development startup script for Peepal Export
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo Peepal Export - Development Mode
echo ========================================
echo.

echo Make sure MongoDB is running!
echo.

REM Start Backend
echo Starting backend server...
cd backend
start cmd /k npm start
cd ..

timeout /t 3 /nobreak

REM Start Frontend
echo Starting frontend server...
cd frontend
start cmd /k npm start
cd ..

echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:4200
echo ========================================
echo.
