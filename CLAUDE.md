# CLAUDE.md — Contexto del proyecto para Claude Code

> Este archivo lo lee Claude Code automáticamente. Resume QUÉ es el proyecto,
> CÓMO está construido y las CONVENCIONES a seguir. Mantenlo actualizado.

## 1. Qué es Strata

**Strata** es una plataforma web interactiva para **comparar países del mundo en
tres dimensiones**: económica, política y social. La interfaz principal es un
**globo terráqueo 3D con textura de satélite**: seleccionas un país y obtienes un
panel con sus métricas, lo comparas con otros, y puedes **colorear el globo según
cualquier indicador** (mapa coroplético sobre la esfera).

Lema de producto: **"Cada país, en capas."**

El objetivo no es solo mostrar datos, sino **dar criterio**: rankings
personalizables, correlaciones, detección de países que rinden por encima/debajo
de lo esperado, y resúmenes en lenguaje natural generados con IA (Claude).

La especificación completa está en `docs/PRD.md`. Léela antes de implementar
features grandes.

## 2. Las tres dimensiones (modelo mental central)

Todo en la app se organiza alrededor de estas tres dimensiones, y **cada una tiene
un color propio** que se usa de forma consistente en toda la UI:

| Dimensión | Color | Qué mide (resumen) |
|-----------|-------|--------------------|
| **Económica** | ámbar `#E8B04B` | PIB, PIB per cápita, crecimiento, inflación, paro, deuda/PIB, desigualdad (Gini)… |
| **Política**  | violeta `#7C6FF0` | democracia, libertades, corrupción, estado de derecho, libertad de prensa, estabilidad… |
| **Social**    | verde-azulado `#3FBFA8` | esperanza de vida, educación, sanidad, felicidad, urbanización, conectividad, igualdad… |

El catálogo completo de métricas (con fuente, unidad, dirección "más=mejor o
peor", y normalización) está en `docs/METRICS.md`. **Nunca inventes valores de
métricas**: vienen del pipeline de datos (`data/`).

## 3. Stack técnico

- **Frontend**: React 18 + TypeScript + Vite.
- **Globo 3D**: `react-globe.gl` (Three.js + globe.gl) con textura satélite y
  polígonos de países coloreables. Alternativa 2D: MapLibre GL (open source).
- **Datos en cliente**: TanStack Query (cache) + Zustand (estado UI/selección).
- **Gráficas**: Recharts (radar, líneas, barras) + D3 para el scatter de correlación.
- **Estilo**: Tailwind CSS + componentes propios en `src/components/ui`.
- **Datos**: pipeline ETL en Python (`data/pipeline/`) que descarga de fuentes
  abiertas (World Bank, V-Dem, etc.), normaliza y escribe **JSON estático** en
  `data/processed/`. El frontend consume ese JSON (sin backend obligatorio).
- **IA (opcional)**: función serverless (`api/briefing.ts`) que llama a la API de
  Anthropic para generar fichas-resumen de un país o de una comparación.
- **Persistencia (opcional)**: Supabase (Postgres) para guardar comparaciones e
  índices personalizados del usuario.
- **Hosting**: Netlify o Vercel (estático + funciones serverless).

Decisiones de arquitectura y por qué, en `docs/ARCHITECTURE.md`.

## 4. Estructura del repositorio

```
strata/
├── CLAUDE.md              ← este archivo
├── README.md             ← arranque rápido
├── ROADMAP.md            ← plan por fases
├── docs/                 ← especificación (PRD, arquitectura, métricas, features, diseño)
├── apps/web/             ← frontend (React + Vite)
│   └── src/
│       ├── components/   ← Globe, CountryPanel, CompareView, IndexBuilder, ...
│       ├── data/         ← carga del JSON procesado, adaptadores
│       ├── hooks/        ← hooks de datos y de UI
│       ├── store/        ← Zustand (país seleccionado, métrica activa, modo)
│       ├── lib/          ← utilidades (normalización, escalas de color, formato)
│       └── types/        ← tipos TypeScript (Country, Metric, ...)
├── data/                 ← pipeline ETL + datasets
│   ├── pipeline/         ← scripts Python de descarga y normalización
│   ├── raw/              ← descargas crudas (gitignored)
│   ├── processed/        ← JSON final que consume el frontend
│   └── schema/           ← esquema JSON del país (contrato de datos)
├── api/                  ← funciones serverless (IA, proxy de datos)
└── scripts/              ← utilidades varias
```

## 5. Cómo ejecutar

```bash
# Frontend
cd apps/web
npm install
npm run dev            # http://localhost:5173

# Pipeline de datos (genera data/processed/countries.json)
cd ../../data/pipeline
pip install -r requirements.txt
python build_dataset.py
```

Mientras el pipeline no esté completo, el frontend usa
`data/processed/countries.sample.json` (datos ILUSTRATIVOS de unos pocos países).

## 6. Convenciones de código

- **TypeScript estricto**. Tipos en `src/types`. Nada de `any` salvo justificado.
- **Componentes** funcionales con hooks. Un componente por archivo, PascalCase.
- **Colores de dimensión**: usar SIEMPRE los tokens de `src/lib/theme.ts`
  (`DIMENSION_COLORS`), nunca hex sueltos en componentes.
- **Datos**: el frontend NUNCA hardcodea estadísticas. Todo sale de
  `useCountries()` / el JSON procesado. Si falta un dato, mostrar estado vacío
  explícito (ver `docs/DESIGN.md`), no inventarlo.
- **Métricas**: cada métrica define su `direction` ("higher_is_better" o
  "lower_is_better") y su normalización 0–100 en `lib/metrics.ts`. Las escalas de
  color y los rankings dependen de eso.
- **Accesibilidad**: foco visible por teclado, paletas seguras para daltonismo
  (hay una variante en el tema), `prefers-reduced-motion` respetado en el globo.
- **i18n**: textos en `src/lib/i18n` (ES por defecto; EN y FR previstos).
- **Epistemia honesta**: cada métrica muestra su fuente y su año. Si un dato es
  estimado o viejo, indicarlo. No presentar incertidumbre como certeza.

## 7. Estado actual

- [x] Estructura del repo y documentación de contexto.
- [x] Esquema de datos del país (`data/schema/country_schema.json`).
- [x] Dataset de muestra (`data/processed/countries.sample.json`).
- [x] Stubs de componentes clave (Globe, CountryPanel).
- [x] Pipeline ETL real: World Bank (15 indicadores, incl. 6 WGI de gobernanza) →
      `countries.json` (217 países). Regenerar con `npm run data`. REST Countries
      quedó deprecado; metadatos vía endpoint `/country` del World Bank. Nombres de
      país en inglés (pendiente i18n).
- [x] Globo coroplético funcional (recoloreo por dimensión, leyenda viva, hover/click,
      buscador, ficha con radar). Fronteras world-atlas en `apps/web/public/geo/`.
- [ ] Modo comparación, IndexBuilder, CorrelationExplorer.
- [ ] Función de IA (`api/briefing.ts`).
- [x] **Tema claro/oscuro**: tokens CSS por `[data-theme]` (tripletes RGB para
      opacidades de Tailwind) en `index.css`; conmutador en Ajustes; persistido en
      `strata-theme`; script anti-FOUC en `index.html`. La identidad navy+oro se
      mantiene y el globo es joya oscura en ambos temas. En claro el oro de TEXTO se
      oscurece a `#C8901E` (AA); el relleno sigue `#E5B85B` (`--accent-fill`).
- [x] Las secciones "Jugar" y "Strata Founders" se RETIRARON por completo (sin
      restos): no hay `apps/web/src/features/`, ni ruta `/jugar` o `/founders`, ni
      entradas de menú. La app es el globo de datos + comparar/rankings/ficha.
- [x] PIB per cápita en escala **logarítmica** con extremos reales (mín/máx exactos
      en la leyenda). Ver `LOG_METRICS` en `lib/metrics.ts`.

## 8. Por dónde empezar (sugerencia para Claude Code)

1. Completar el pipeline `data/pipeline/fetch_worldbank.py` para traer 8–10
   indicadores económicos/sociales reales y escribir `countries.json`.
2. Hacer el **globo coroplético** funcional: colorear países por una métrica
   seleccionable (esto es el corazón visual del producto).
3. Panel de país (`CountryPanel`) con radar de las 3 dimensiones.
4. Modo comparación 2–4 países.
5. IndexBuilder (índice personalizado con pesos) — el feature estrella.

Detalle de features innovadoras en `docs/FEATURES.md`.

## 9. Reglas de seguridad/datos

- Las claves (Anthropic, Supabase) van en variables de entorno, nunca en el repo.
  Ver `.env.example`.
- Respetar las licencias de cada fuente de datos (atribución requerida). Ver
  `docs/DATA_SOURCES.md`, sección de licencias.
- Datos políticos sensibles: presentar índices de terceros de forma **neutral y
  con fuente**, sin editorializar. La app informa, no opina.
