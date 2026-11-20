@echo off
title SISTEM PENCATATAN KEUANGAN & STOK TBS - POOL TBS KARYA MAJU
color 0A

echo ===================================================================
echo   SISTEM PENCATATAN KEUANGAN & STOK TBS (SOP-TBS-2026/01)
echo   POOL TBS KARYA MAJU
echo ===================================================================
echo Memeriksa ketersediaan lingkungan sistem...

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js terdeteksi. Menjalankan server terintegrasi...
    start "" http://localhost:3000
    node server.js
) else (
    echo [INFO] Node.js tidak ditemukan, membuka aplikasi web interaktif langsung...
    start "" "%~dp0index.html"
)
pause