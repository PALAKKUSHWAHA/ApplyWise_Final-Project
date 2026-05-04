@echo off
REM Quick Setup Script for ResuMatch AI Assistant
REM Windows Batch Script

echo.
echo ==========================================
echo ResuMatch AI Assistant - Setup Script
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8+ first
    echo Download from: https://www.python.org/downloads/
    exit /b 1
)

REM Check if Ollama is installed
where ollama >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Ollama not found in PATH
    echo.
    echo Please install Ollama from: https://ollama.ai
    echo After installation, restart your terminal
    pause
    exit /b 1
)

echo ✓ Python found
echo ✓ Ollama found

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo.
    echo Creating backend\.env file...
    copy backend\.env.example backend\.env
    echo ✓ .env file created
)

REM Install Python dependencies
echo.
echo Installing Python dependencies...
cd backend
call .venv\Scripts\pip install -r requirements.txt

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Open a new terminal and run: ollama pull mistral
echo 2. Then run: ollama serve
echo 3. In another terminal: cd backend && python main.py
echo 4. In another terminal: cd frontend && npm run dev
echo.
echo Visit: http://localhost:3000/ai-assistant
echo.
pause
