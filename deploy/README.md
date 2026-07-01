# Despliegue de Strata

Todo gratuito. Dos cosas: subir a GitHub y mantener el servidor encendido.

## 1) Subir a GitHub

El repo ya está inicializado y con el primer commit en la rama `main`.
Solo falta crear el repositorio remoto y empujar (necesita TU cuenta de GitHub).

**Opción A — con GitHub CLI (recomendada):**
```bash
# Instala gh una vez (Windows):  winget install GitHub.cli
gh auth login                       # inicia sesión (navegador)
gh repo create strata --public --source=. --remote=origin --push
```

**Opción B — sin gh (web + git):**
1. Crea un repo vacío en https://github.com/new (sin README).
2. En la carpeta del proyecto:
```bash
git remote add origin https://github.com/TU_USUARIO/strata.git
git push -u origin main             # te pedirá login la primera vez
```

> El `.gitignore` ya excluye `node_modules/`, `dist/`, `.env` y `.claude/`. Nunca se sube ninguna clave.

## 2) Servidor siempre encendido

**Windows (tu máquina ahora):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install-server.ps1
# Sirve en http://127.0.0.1:4173 , arranca solo al iniciar sesión y se reinicia si se cae.
# Quitar:  powershell -ExecutionPolicy Bypass -File scripts\uninstall-server.ps1
```

**Linux / VPS (producción):** usa `deploy/strata.service` (systemd). Instrucciones dentro del archivo.

> Para servir el frontend en Vercel/Netlify, el directorio de build es `apps/web/dist`
> (comando `npm --prefix apps/web run build`).
