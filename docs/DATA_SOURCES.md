# DATA_SOURCES.md — Fuentes de datos (abiertas y fiables)

Todas las fuentes de abajo son **gratuitas**. La mayoría tienen API o CSV
descargable. El pipeline (`data/pipeline/`) las consume, normaliza y vuelca a
`data/processed/countries.json`.

> Regla de oro: **citar siempre la fuente y el año** de cada métrica en la UI.
> Respetar la atribución que pide cada licencia.

## Económicas

| Fuente | Qué da | Acceso | Notas |
|---|---|---|---|
| **World Bank Open Data** | PIB, PIB/cápita, crecimiento, inflación, paro, deuda, Gini, comercio… | API REST sin clave: `https://api.worldbank.org/v2/country/all/indicator/{CODE}?format=json` | La columna vertebral. Miles de indicadores. |
| **IMF Data** | Proyecciones macro, balanza, reservas | API / SDMX | Complementa al World Bank |
| **OECD Data** | Indicadores de países desarrollados | API SDMX | Cobertura limitada a OCDE |
| **UN Comtrade** | Comercio bilateral | API (con límites) | Para vista de comercio |

Códigos World Bank útiles: `NY.GDP.MKTP.CD` (PIB), `NY.GDP.PCAP.CD` (PIB/cápita),
`NY.GDP.MKTP.KD.ZG` (crecimiento), `FP.CPI.TOTL.ZG` (inflación),
`SL.UEM.TOTL.ZS` (paro), `SI.POV.GINI` (Gini),
`GC.DOD.TOTL.GD.ZS` (deuda/PIB).

## Políticas

| Fuente | Qué da | Acceso | Notas |
|---|---|---|---|
| **V-Dem (Varieties of Democracy)** | Índices de democracia muy granulares | Dataset descargable (CSV) / paquete R/py | Académico, muy reputado |
| **Freedom House — Freedom in the World** | Derechos políticos y libertades civiles (0–100) | CSV/Excel anual | Atribución requerida |
| **Transparency International — CPI** | Percepción de corrupción (0–100) | CSV anual | Atribución requerida |
| **Reporters Without Borders** | Libertad de prensa | CSV anual | |
| **EIU Democracy Index** | Índice de democracia (0–10) | Informe/tabla anual | Acceso a la tabla puede requerir scraping del informe |
| **World Bank — Worldwide Governance Indicators** | Estado de derecho, efectividad, estabilidad, voz | API World Bank | 6 dimensiones de gobernanza |
| **World Justice Project — Rule of Law** | Estado de derecho detallado | CSV | |

## Sociales

| Fuente | Qué da | Acceso | Notas |
|---|---|---|---|
| **UNDP — Human Development Index** | IDH y componentes (educación, salud, renta) | CSV/API | Estándar global de desarrollo |
| **World Happiness Report** | Escalera de Cantril (felicidad) + factores | CSV/Excel anual | Gallup/Oxford |
| **WHO — Global Health Observatory** | Esperanza de vida, mortalidad, sanidad | API OData | |
| **World Bank (social)** | Alfabetización, urbanización, acceso a internet, agua | API World Bank | `IT.NET.USER.ZS` (internet), `SP.URB.TOTL.IN.ZS` (urbano), `SP.DYN.LE00.IN` (esperanza vida) |
| **UNESCO Institute for Statistics** | Educación detallada | API/CSV | |
| **OWID (Our World in Data)** | Datasets ya limpios de casi todo lo anterior | CSV en GitHub, sin clave | **Atajo excelente**: muchos indicadores ya unificados por país-año |

## Geografía e identidad de país

| Fuente | Qué da | Acceso | Notas |
|---|---|---|---|
| **Natural Earth** | Fronteras de países (GeoJSON/Shapefile) | Descarga directa, dominio público | Para los polígonos del globo. Usar 1:110m (ligero) o 1:50m |
| **world-atlas (TopoJSON)** | Topología de países lista para D3/globe | npm / CDN | Geometrías ligeras (topojson) |
| **REST Countries** | Nombre, ISO, bandera, capital, región, idiomas, moneda | API sin clave: `https://restcountries.com/v3.1/all` | Metadatos e banderas |
| **flagcdn.com** | Banderas SVG/PNG por código ISO | CDN | Banderas ligeras |

## Cómo unimos todo

- **Clave primaria**: código **ISO 3166-1 alpha-3** (ESP, JPN, USA…). Todo se
  une por ahí. El pipeline mapea cualquier código de fuente a alpha-3.
- **Eje temporal**: año. Guardamos series por año cuando existan (para la Time
  Machine); para el MVP basta el último año disponible por métrica.
- **Cobertura**: no todos los países tienen todas las métricas. El esquema marca
  `value: null` y la UI lo muestra como "sin dato".

## Licencias y atribución (resumen — verificar antes de publicar)

- World Bank: CC BY 4.0 (atribución).
- Our World in Data: CC BY (atribución).
- Freedom House, Transparency International, RSF, World Happiness Report: uso con
  atribución; revisar términos de cada informe antes de redistribuir datos.
- Natural Earth: dominio público.
- REST Countries: open source (MPL).

> Crear una página "Fuentes y créditos" en la app que liste cada fuente con enlace
> y el año de los datos usados. Es un requisito, no un extra.
