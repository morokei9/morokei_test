@echo off
echo Setting up website files...

if not exist fonts\ (
    mkdir fonts
)

copy "..\data\font.ttf" "fonts\"

echo Checking image folder...

if not exist "..\data\image\" (
    echo WARNING: Image folder does not exist!
    echo Please create the folder and place the images:
    echo %~dp0..\data\image\
    echo Required image files: image1.png, image2.png, image3.png
) else (
    echo Image folder exists. Checking images...
    if exist "..\data\image\image1.png" (
        echo - Found image1.png
    ) else (
        echo - WARNING: image1.png not found!
    )
    
    if exist "..\data\image\image2.png" (
        echo - Found image2.png
    ) else (
        echo - WARNING: image2.png not found!
    )
    
    if exist "..\data\image\image3.png" (
        echo - Found image3.png
    ) else (
        echo - WARNING: image3.png not found!
    )
)

echo.
echo Setup complete! Please open index.html in your browser to run the website.
echo.
echo Read README.txt for more information.
pause