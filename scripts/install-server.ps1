# Strata — instala el servidor "siempre encendido" en Windows SIN permisos de admin.
# Usa el arranque automatico de usuario (clave Run de HKCU) + un lanzador oculto.
# Arranca al iniciar sesion y el propio serve.cmd se reinicia solo si se cae.
# Equivale al systemd de Linux (ver deploy/strata.service).
#
# Uso:    powershell -ExecutionPolicy Bypass -File scripts\install-server.ps1
# Quitar: powershell -ExecutionPolicy Bypass -File scripts\uninstall-server.ps1

$ErrorActionPreference = "Stop"
$name = "StrataServer"
$vbs = Join-Path $PSScriptRoot "serve-hidden.vbs"
if (-not (Test-Path $vbs)) { throw "No se encuentra serve-hidden.vbs en $vbs" }

# 1) Autoarranque al iniciar sesion (usuario actual, sin admin).
$runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$cmd = "wscript.exe `"$vbs`""
New-ItemProperty -Path $runKey -Name $name -Value $cmd -PropertyType String -Force | Out-Null

# 2) Arranca ya mismo (sin esperar al proximo inicio de sesion).
Start-Process "wscript.exe" -ArgumentList "`"$vbs`""

Write-Host "OK: '$name' quedara siempre encendido."
Write-Host "URL:    http://127.0.0.1:4173"
Write-Host "Arranca solo al iniciar sesion y se reinicia si se cae."
Write-Host "Quitar: powershell -ExecutionPolicy Bypass -File scripts\uninstall-server.ps1"
