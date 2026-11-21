@echo off
title CarePlus Clinic Demo Server
echo ======================================================
echo   Starting CarePlus Clinic Demo Local Server...
echo ======================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
