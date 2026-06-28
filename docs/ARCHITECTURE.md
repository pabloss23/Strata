# ARCHITECTURE.md — Arquitectura y decisiones

## Principio rector: "datos baked, frontend estático, IA opcional al borde"

El flujo de datos pesado (descargar de 10 fuentes, normalizar) ocurre **fuera de
runtime**, en un pipeline que produce JSON estático. El frontend solo consume ese
JSON → es rápido, barato (hosting estático gratis) y reproducible. La única pieza
con servidor es la IA (serverless), y es opcional.

```
                      ┌─────────────────────────────┐
   Fuentes abiertas → │  Pipeline ETL (Python)      │ → data/processed/countries.json
   (World Bank, V-Dem,│  data/pipeline/             │   (+ series por año)
    UNDP, OWID, ...)   │  fetch → normalize → build  │
                      └─────────────────────────────┘
                                   │ (commit / artefacto)
                                   ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  Frontend (React + Vite)  apps/web/                          │
   │   ├─ Globe (react-globe.gl)  ← TopoJSON fronteras + colores  │
   │   ├─ Store (Zustand): país sel., métrica, modo, pesos índice │
   │   ├─ Data layer (TanStack Query): carga countries.json       │
   │   ├─ Charts (Recharts/D3): radar, scatter, barras            │
   │   └─ Deep links: store ↔ URL                                 │
   └──────────────────────────────────────────────────────────────┘
                                   │ (fetch opcional)
                                   ▼
        ┌────────────────────────────────────────────┐
        │ Serverless  api/  (Vercel/Netlify Funcs)   │
        │  briefing.ts → API Anthropic (clave server)│
        │  (opcional) proxy/caché de datos en vivo   │
        └────────────────────────────────────────────┘

   Persistencia opcional (v2): Supabase (Postgres) para índices/usuarios guardados.
```

## Contrato de datos

El frontend depende de UN esquema estable: `data/schema/country_schema.json`.
El pipeline DEBE producir JSON que valide contra ese esquema. Si cambia el esquema,
se versiona (`schemaVersion`). Esto desacopla pipeline y frontend: pueden
desarrollarse en paralelo usando el dataset de muestra.

Forma (resumen):
```jsonc
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-01-15",
  "countries": [
    {
      "iso3": "ESP",
      "name": "España",
      "region": "Europe",
      "flag": "https://flagcdn.com/es.svg",
      "population": 48000000,
      "metrics": {
        "gdp_per_capita": { "value": 33000, "year": 2024, "source": "World Bank" },
        "democracy_index": { "value": 8.0, "year": 2024, "source": "EIU" }
        // ...
      }
    }
  ]
}
```

## Decisiones (ADR resumidas)

- **react-globe.gl vs Mapbox/MapLibre.** Elegimos globo 3D para el factor "satélite"
  y el impacto visual. MapLibre queda como alternativa para un coroplético 2D si el
  feedback lo pide. *Trade-off:* el globo es más espectacular pero más caro en
  rendimiento; mitigado con geometrías ligeras (TopoJSON 1:110m).
- **Estático vs backend.** Estático para v1: cero coste, máxima velocidad,
  reproducible. La IA va en serverless para no exponer la clave. Backend completo
  solo si aparecen features en vivo (precios, noticias).
- **Python para ETL.** Ecosistema de datos maduro (pandas, requests, wbgapi).
  TypeScript en el frontend. La frontera entre ambos es el JSON + el esquema.
- **TanStack Query** para carga/caché del JSON (y futura API), **Zustand** para
  estado de UI (ligero, sin boilerplate).
- **Normalización en el pipeline o en cliente.** Los valores crudos se guardan en el
  JSON; la **normalización 0–100 y los rankings se calculan en cliente** (`lib/metrics.ts`)
  para que el Index Builder pueda recomputar al vuelo con pesos del usuario.

## Rendimiento

- Geometrías: TopoJSON simplificado; cargar 1:110m por defecto, 1:50m bajo demanda.
- Datos: un solo `countries.json` (~cientos de KB) cargado una vez y cacheado.
- Globo: limitar re-renders; memorizar escalas de color; respetar
  `prefers-reduced-motion` (sin auto-rotación).
- Code-splitting por feature (Index Builder, Correlation, Stories lazy-loaded).

## Carpetas clave y su responsabilidad

- `data/pipeline/` — descarga + normalización (Python). Idempotente y testeable.
- `data/processed/` — salida consumible. `countries.sample.json` para desarrollo.
- `apps/web/src/data/` — carga del JSON y adaptadores a tipos de UI.
- `apps/web/src/lib/` — normalización, escalas de color, formato, i18n, tema.
- `apps/web/src/store/` — estado global (selección, métrica, pesos, modo).
- `api/` — funciones serverless (IA).

## Testing (mínimo viable)

- Pipeline: validar salida contra el esquema JSON; tests de normalización.
- Frontend: tests de `lib/metrics.ts` (normalización/dirección), smoke test del
  store. E2E ligero (Playwright) para selección de país.

## CI/CD

- `.github/workflows/data.yml`: corre el pipeline en cron (mensual) y commitea el
  JSON actualizado (o lo publica como artefacto).
- Deploy automático en push (Netlify/Vercel).
