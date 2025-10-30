@echo off
title AgriZone Backend Server
color 0A

echo ============================================================
echo          AGRIZONE BACKEND SERVER
echo ============================================================
echo.
echo Starting backend server...
echo.

cd /d "%~dp0"

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" > nul 2>&1
if errorlevel 1 (
    echo [WARNING] MongoDB might not be running
    echo.
    echo To start MongoDB on Windows, run:
    echo   net start MongoDB
    echo.
    pause
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the server
echo ============================================================
echo Starting server on http://0.0.0.0:3000
echo ============================================================
echo.
call node server.js

pause
