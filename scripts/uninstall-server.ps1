# Strata — desinstala el servidor "siempre encendido" (Windows, sin admin).
# Quita el autoarranque y detiene el preview en el puerto 4173.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\uninstall-server.ps1
$ErrorActionPreference = "SilentlyContinue"
$name = "StrataServer"

# 1) Quitar autoarranque.
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name $name

# 2) Detener el proceso que escucha en el puerto 4173 (vite preview).
$conns = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
foreach ($c in $conns) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }

Write-Host "OK: autoarranque eliminado y servidor del puerto 4173 detenido."
