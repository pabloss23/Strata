# 🌍 Strata — atlas comparativo del mundo

Compara países en lo **económico**, lo **político** y lo **social** sobre un **globo
3D con vista de satélite**. Selecciona un país, mira sus métricas, compáralo con
otros y **colorea el mundo** según el indicador que te interese — o según **tu propio
índice** de pesos.

> Nombre en clave: **Strata** (placeholder, cámbialo libremente).
> Lema: *"Cada país, en capas."*

## ✨ Qué lo hace distinto

- 🗺️ **Globo coroplético**: pinta la Tierra por cualquier métrica.
- 🎚️ **Index Builder**: tú decides cuánto pesa cada cosa → ranking personalizado.
- 📈 **Correlation Explorer** y **Outlier Radar**: relaciones y sorpresas en los datos.
- 🤖 **AI Briefings**: resúmenes en lenguaje natural (Claude) a partir de datos reales.
- 🔍 **Honestidad de datos**: cada cifra con su fuente y su año.

Detalle completo en [`docs/FEATURES.md`](docs/FEATURES.md).

## 🚀 Arranque rápido

```bash
# 1) Frontend
cd apps/web
npm install
npm run dev          # http://localhost:5173

# 2) (opcional) Pipeline de datos reales
cd ../../data/pipeline
pip install -r requirements.txt
python build_dataset.py   # genera data/processed/countries.json
```

Sin pipeline, el frontend usa `data/processed/countries.sample.json` (datos de
muestra ILUSTRATIVOS de unos pocos países).

## 🧱 Stack

React + TypeScript + Vite · react-globe.gl (Three.js) · TanStack Query · Zustand ·
Recharts/D3 · Tailwind · Pipeline ETL en Python · IA con la API de Anthropic
(serverless) · Hosting estático (Netlify/Vercel).

## 📁 Estructura

```
strata/
├── CLAUDE.md       ← contexto para Claude Code (léelo primero)
├── docs/           ← PRD, arquitectura, métricas, features, diseño
├── apps/web/       ← frontend
├── data/           ← pipeline ETL + datasets
├── api/            ← funciones serverless (IA)
└── scripts/
```

## 🗂️ Documentación

- [`CLAUDE.md`](CLAUDE.md) — contexto y convenciones (para Claude Code).
- [`docs/PRD.md`](docs/PRD.md) — visión y requisitos.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura y decisiones.
- [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) — fuentes de datos abiertas.
- [`docs/METRICS.md`](docs/METRICS.md) — catálogo de métricas.
- [`docs/FEATURES.md`](docs/FEATURES.md) — features (incl. innovadoras).
- [`docs/DESIGN.md`](docs/DESIGN.md) — sistema de diseño.
- [`ROADMAP.md`](ROADMAP.md) — plan por fases.

## ⚖️ Datos y licencias

Datos de fuentes abiertas (World Bank, UNDP, V-Dem, Our World in Data, etc.) con
atribución. Ver `docs/DATA_SOURCES.md`. La app **informa con fuentes, no opina**.

## 🔐 Configuración

Copia `.env.example` a `.env` y rellena las claves (Anthropic, Supabase) si usas IA
o persistencia. **Nunca** subas claves al repositorio.

---

Hecho para entender el mundo un poco mejor. PRs y ramas por fase (ver ROADMAP).
