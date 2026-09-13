@echo off
chcp 65001 >nul
echo ======================================================================
echo    Egyptian Society of Landscape Architects (ESLA) Portal
echo    رفع التعديلات إلى: https://github.com/Mohamedoudalsa/esla-portal.git
echo ======================================================================
echo.

cd /d "%~dp0"

git remote remove origin >nul 2>&1
git remote add origin https://github.com/Mohamedoudalsa/esla-portal.git
git branch -M main

echo.
set /p GITHUB_TOKEN="ألصق الـ Personal Access Token الجديد هنا (أو اضغط Enter لتسجيل الدخول العادي): "

if not "%GITHUB_TOKEN%"=="" (
    echo.
    echo [*] جاري الرفع باستخدام الـ Token...
    git -c credential.helper= push "https://Mohamedoudalsa:%GITHUB_TOKEN%@github.com/Mohamedoudalsa/esla-portal.git" main
    git remote set-url origin https://github.com/Mohamedoudalsa/esla-portal.git
    goto END
)

echo.
echo [*] جاري تنفيذ أمر git push origin main ...
git push origin main

:END
if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [✓] تم رفع التعديلات بنجاح إلى GitHub!
    echo [✓] سيقوم Render الآن بإعادة البناء والتشغيل تلقائياً (Auto-Deploy)!
    echo ======================================================================
) else (
    echo.
    echo [!] فشل الرفع. يرجى إنشاء Token جديد من: https://github.com/settings/tokens/new
    echo [!] مع التأكد من وضع علامة صح على [repo].
)

pause
