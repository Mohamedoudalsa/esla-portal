@echo off
chcp 65001 >nul
echo ======================================================================
echo    Egyptian Society of Landscape Architects (ESLA) Portal
echo    مشاركة رابط الموقع لايف مع أي شخص (Cloudflare Live Tunnel)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [*] Starting Cloudflare Live Tunnel for http://localhost:8000 ...
echo [!] انسخ الرابط الذي سينتهي بـ trycloudflare.com وأرسله لأي شخص
echo.

cloudflared tunnel --url http://127.0.0.1:8000

pause
