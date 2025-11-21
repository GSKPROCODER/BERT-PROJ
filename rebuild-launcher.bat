@echo off
echo Compiling Sentiment Analysis Launcher...
echo.

REM Check if g++ is available
g++ --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ g++ compiler not found!
    echo Please install MinGW-w64 or Visual Studio Build Tools
    echo.
    echo Quick install options:
    echo 1. Install MinGW-w64: https://www.mingw-w64.org/downloads/
    echo 2. Or install Visual Studio Build Tools
    echo 3. Or use: winget install mingw
    pause
    exit /b 1
)

echo ✅ Compiler found
echo.

echo Compiling launcher.cpp...
g++ -std=c++17 -O2 -static-libgcc -static-libstdc++ launcher.cpp -o sentiment-launcher.exe

if %errorlevel% equ 0 (
    echo.
    echo ✅ Compilation successful!
    echo Created: sentiment-launcher.exe
    echo.
    echo You can now run: sentiment-launcher.exe
    echo.
) else (
    echo.
    echo ❌ Compilation failed!
    echo Please check the error messages above.
    echo.
)

pause