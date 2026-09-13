@echo off
chcp 65001 >nul
echo ======================================================================
echo    Egyptian Society of Landscape Architects (ESLA) Portal
echo    بوابة تسجيل العضوية واعتماد المستندات - الجمعية المصرية لمعماريي تنسيق الموقع
echo ======================================================================
echo.

cd /d "%~dp0backend"

set PYTHON_EXE=venv\Scripts\python.exe

if not exist "%PYTHON_EXE%" (
    echo [!] Creating Python virtual environment...
    python -m venv venv
    echo [!] Installing requirements...
    %PYTHON_EXE% -m pip install -r requirements.txt
)

echo [*] Initializing database and demo accounts...
"%PYTHON_EXE%" -m app.seed

echo.
echo [*] Starting ESLA Portal Server at http://localhost:8000 ...
echo [*] Admin Credentials:
echo     - Email:    admin@esla.org.eg
echo     - Password: Admin@ESLA2026
echo.
echo [*] Opening portal in browser...
start http://localhost:8000

echo [>] Server is running. Press CTRL+C to stop.
"%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

pause
