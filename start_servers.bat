@echo off
REM CarPedia AI Chatbot Startup Script
REM This script starts both the frontend and AI backend servers

echo.
echo ========================================
echo  CarPedia AI Chatbot - Quick Start
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)

echo ✓ Python found: 
python --version

REM Check if packages are installed
python -c "import flask, flask_cors, openai" >nul 2>&1
if errorlevel 1 (
    echo.
    echo Installing required packages...
    pip install flask flask-cors openai
)

echo.
echo ========================================
echo  IMPORTANT: Set Your OpenAI API Key
echo ========================================
echo.
echo You need an OpenAI API key for the AI to work.
echo.
echo 1. Go to: https://platform.openai.com/api-keys
echo 2. Create a new API key
echo 3. Copy and paste it below (it will be hidden)
echo.

set /p OPENAI_API_KEY="Enter your OpenAI API Key: "

if "%OPENAI_API_KEY%"=="" (
    echo ERROR: No API key provided
    echo Cannot start AI backend without API key
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting Servers...
echo ========================================
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C in either terminal to stop
echo.

REM Start frontend server in new window
echo Starting Frontend Server (Port 8000)...
start "CarPedia Frontend" cmd /k "cd /d %cd% && python -m http.server 8000"

REM Wait a second for frontend to start
timeout /t 2 /nobreak

REM Start backend server
echo Starting AI Backend Server (Port 5000)...
setlocal enabledelayedexpansion
set "OPENAI_API_KEY=!OPENAI_API_KEY!"
cmd /k "cd /d %cd% && python api_server.py"
