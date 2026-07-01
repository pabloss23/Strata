# Publica Strata en GitHub Pages con UN comando.
#   npm run deploy               (mensaje automatico con fecha/hora)
#   powershell -File scripts/publish.ps1 "mi mensaje"
#
# Que hace:
#   1) Construye la web (falla rapido si hay errores; no publica roto).
#   2) git add + commit (solo si hay cambios) + push a main.
#   3) El workflow .github/workflows/deploy-pages.yml despliega solo en 1-2 min.
#
# Requisito (una sola vez): en GitHub -> Settings -> Pages -> Source: "GitHub Actions".

param([string]$Message = "")

# Ir a la raiz del repo (este script esta en scripts/).
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not $Message) { $Message = "deploy: " + (Get-Date -Format "yyyy-MM-dd HH:mm") }

Write-Host "==> 1/3 Construyendo la web..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build FALLO. No se publica nada." -ForegroundColor Red
  exit 1
}

Write-Host "==> 2/3 Guardando cambios (commit)..." -ForegroundColor Cyan
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m $Message
} else {
  Write-Host "    No hay cambios nuevos; se empuja lo que hubiera pendiente." -ForegroundColor Yellow
}

Write-Host "==> 3/3 Subiendo a GitHub (push)..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "El push FALLO (revisa tu login de GitHub)." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "LISTO. GitHub Actions desplegara en 1-2 min:" -ForegroundColor Green
Write-Host "  https://pabloss23.github.io/strata/" -ForegroundColor Green
