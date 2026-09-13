@echo off
chcp 65001 >nul
echo ======================================================================
echo    Push ESLA Portal to GitHub
echo    رفع مشروع بوابة ESLA على حسابك في GitHub
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1] Checking repository status...
git status

echo.
set /p REPO_URL="Enter your GitHub Repository URL (مثال: https://github.com/username/esla-portal.git): "

if "%REPO_URL%"=="" (
    echo [!] No URL provided. Cancelled.
    pause
    exit /b
)

echo.
echo [*] Adding remote origin: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [*] Renaming branch to main...
git branch -M main

echo [*] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [✓] Project successfully pushed to GitHub!
    echo [✓] تم رفع المشروع بنجاح إلى GitHub!
    echo ======================================================================
) else (
    echo.
    echo [!] Push failed or authentication required.
    echo [!] إذا طلب منك تسجيل الدخول، يرجى إدخال اسم المستخدم والـ Personal Access Token الخاص بك في GitHub.
)

pause
