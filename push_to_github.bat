@echo off
chcp 65001 >nul
echo ======================================================================
echo    Egyptian Society of Landscape Architects (ESLA) Portal
echo    رفع المشروع إلى: https://github.com/Mohamedoudalsa/esla-portal.git
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1] Ensuring remote is set to: https://github.com/Mohamedoudalsa/esla-portal.git
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Mohamedoudalsa/esla-portal.git
git branch -M main

echo.
echo هل لديك GitHub Personal Access Token (PAT)؟
echo [1] نعم، أريد إدخال الـ Token للرفع المباشر والفوري.
echo [2] لا، جرب الرفع العادي (قد يطلب منك اسم المستخدم وكلمة المرور في المتصفح أو هنا).
echo.
set /p CHOICE="اختر 1 أو 2 (أو اضغط Enter للرفع العادي): "

if "%CHOICE%"=="1" (
    echo.
    set /p GITHUB_TOKEN="ألصق الـ Personal Access Token الخاص بك هنا: "
    if not "%GITHUB_TOKEN%"=="" (
        echo.
        echo [*] جاري الرفع باستخدام الـ Token...
        git push -u https://Mohamedoudalsa:%GITHUB_TOKEN%@github.com/Mohamedoudalsa/esla-portal.git main
        goto END
    )
)

echo.
echo [*] جاري تنفيذ أمر git push -u origin main ...
git push -u origin main

:END
if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [✓] تم رفع المشروع بالكامل إلى GitHub بنجاح!
    echo [✓] يمكنك رؤية الكود الآن على: https://github.com/Mohamedoudalsa/esla-portal
    echo ======================================================================
) else (
    echo.
    echo [!] فشل الرفع بسبب التحقق من الصلاحيات (Authentication).
    echo [!] نصيحة: أنشئ Personal Access Token من الرابط:
    echo     https://github.com/settings/tokens
    echo     (اختر repo ثم Generate token) وأعد تشغيل هذا الملف باختيار رقم 1.
)

pause
