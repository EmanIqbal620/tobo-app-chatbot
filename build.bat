@echo off
REM Build script for the frontend application on Windows

echo Building the frontend application...

REM Install dependencies
echo Installing dependencies...
npm install

REM Build the application
echo Building the application...
npm run build

echo Build completed successfully!
pause