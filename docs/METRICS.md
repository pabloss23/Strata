# METRICS.md — Catálogo de métricas

Cada métrica tiene: **id**, **dimensión**, **unidad**, **dirección**
(`higher_is_better` / `lower_is_better`), **fuente** y **normalización** a 0–100
(para rankings y color del globo). La dirección importa: para "paro" o "inflación",
más es peor, así que al normalizar se invierte.

> El frontend lee esta definición desde `apps/web/src/lib/metrics.ts`. Mantener
> ambos sincronizados. **Los VALORES vienen del pipeline, no se hardcodean.**

## Normalización (cómo se calcula el 0–100)

Para una métrica con valores `x` entre países en un año:
- Si `higher_is_better`: `score = 100 * (x - min) / (max - min)`
- Si `lower_is_better`:  `score = 100 * (max - x) / (max - min)`
- Recortar outliers extremos con percentiles 2/98 antes de escalar (robustez).
- Métricas ya en 0–100 o 0–10 (índices) se reescalan linealmente a 0–100.

El **score de dimensión** de un país = media (ponderable) de los scores de sus
métricas. El **score global** por defecto = media de las tres dimensiones (pero el
Index Builder deja al usuario cambiar los pesos).

## Dimensión ECONÓMICA (color `#E8B04B`)

| id | Nombre | Unidad | Dirección | Fuente |
|---|---|---|---|---|
| `gdp` | PIB | USD | higher | World Bank `NY.GDP.MKTP.CD` |
| `gdp_per_capita` | PIB per cápita | USD | higher | WB `NY.GDP.PCAP.CD` |
| `gdp_growth` | Crecimiento del PIB | % anual | higher | WB `NY.GDP.MKTP.KD.ZG` |
| `inflation` | Inflación (IPC) | % | **lower** | WB `FP.CPI.TOTL.ZG` |
| `unemployment` | Desempleo | % | **lower** | WB `SL.UEM.TOTL.ZS` |
| `gov_debt` | Deuda pública / PIB | % | **lower** | WB `GC.DOD.TOTL.GD.ZS` |
| `gini` | Desigualdad (Gini) | índice | **lower** | WB `SI.POV.GINI` |
| `ease_business` | Facilidad de negocio | rank/score | higher | (histórico WB Doing Business / sustituto) |

## Dimensión POLÍTICA (color `#7C6FF0`)

| id | Nombre | Unidad | Dirección | Fuente |
|---|---|---|---|---|
| `democracy_index` | Índice de democracia | 0–10 | higher | EIU / V-Dem |
| `political_rights` | Derechos políticos | 0–100 | higher | Freedom House |
| `civil_liberties` | Libertades civiles | 0–100 | higher | Freedom House |
| `corruption` | Percepción de corrupción (CPI) | 0–100 | higher (100 = limpio) | Transparency Intl |
| `press_freedom` | Libertad de prensa | 0–100 | higher | RSF |
| `rule_of_law` | Estado de derecho | índice | higher | WB WGI / WJP |
| `gov_effectiveness` | Efectividad del gobierno | índice | higher | WB WGI |
| `political_stability` | Estabilidad política | índice | higher | WB WGI |

## Dimensión SOCIAL (color `#3FBFA8`)

| id | Nombre | Unidad | Dirección | Fuente |
|---|---|---|---|---|
| `hdi` | Índice de Desarrollo Humano | 0–1 | higher | UNDP |
| `life_expectancy` | Esperanza de vida | años | higher | WB `SP.DYN.LE00.IN` / WHO |
| `education_index` | Índice de educación | 0–1 | higher | UNDP |
| `literacy` | Alfabetización | % | higher | UNESCO / WB |
| `happiness` | Felicidad (Cantril) | 0–10 | higher | World Happiness Report |
| `internet_users` | Uso de internet | % población | higher | WB `IT.NET.USER.ZS` |
| `urbanization` | Población urbana | % | neutral→higher | WB `SP.URB.TOTL.IN.ZS` |
| `gender_gap` | Brecha de género | índice | higher (1 = paridad) | WEF Global Gender Gap |
| `safety` | Seguridad / homicidios | tasa | **lower** | UNODC / WB |

## Métricas de contexto (no puntúan, solo informan)

`population`, `area_km2`, `capital`, `region`, `subregion`, `currency`,
`languages`, `flag_url`. Vienen de REST Countries / Natural Earth.

## Notas de calidad

- Marcar el **año** de cada valor; pueden no coincidir entre métricas.
- Indicar **estimaciones** (p.ej. proyecciones IMF) frente a observados.
- Cobertura: si una métrica falta para >40% de países, considerar marcarla como
  "experimental" en la UI.
- Para índices compuestos de terceros (HDI, democracia), enlazar a la metodología
  oficial desde el tooltip.
