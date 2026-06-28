@echo off
REM Strata — servidor local siempre encendido (Windows).
REM Sirve la SPA construida (apps/web/dist) con `vite preview` y se reinicia solo
REM si el proceso se cae. Lo lanza la Tarea Programada "StrataServer".
setlocal
cd /d "%~dp0..\apps\web"

REM Construye si no hay build todavia.
if not exist "dist\index.html" call npm run build

:loop
call npm run preview -- --port 4173 --host 127.0.0.1
echo [StrataServer] el servidor se detuvo; reiniciando en 3s...
timeout /t 3 /nobreak >nul
goto loop
