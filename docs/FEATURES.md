# FEATURES.md — Features detalladas (con foco en lo innovador)

Cada feature lleva: **qué es**, **por qué importa**, **cómo funciona** y **notas de
implementación**. Las marcadas con ⭐ son las que diferencian el proyecto de "otra
web de estadísticas".

---

## 1. Globo coroplético (núcleo)
**Qué:** la Tierra en 3D con textura satélite; cada país se tiñe según la métrica
seleccionada, con una leyenda de color.
**Por qué:** el dato vive sobre la geografía; los patrones (regiones ricas/pobres,
cinturones de libertad) se ven de golpe.
**Cómo:** `react-globe.gl` con `polygonsData` = fronteras (TopoJSON), `polygonCapColor`
= escala de color de la métrica activa. Selector de métrica arriba; al cambiar,
recolorea con transición.
**Impl:** escala de color secuencial/divergente (d3-scale-chromatic). Cuidado con
países sin dato (color neutro + patrón rayado). LOD de geometría para rendimiento.

## 2. Ficha de país (núcleo)
**Qué:** panel lateral con bandera, datos clave, **radar de las 3 dimensiones** y las
métricas top por dimensión, cada una con su fuente y año.
**Cómo:** al hacer click en un país, Zustand guarda `selectedCountry`; el panel hace
fade-in. Radar con Recharts (3 ejes = dimensiones, o N ejes = submétricas).
**Impl:** el radar usa los **scores normalizados 0–100**, no los valores crudos.

## 3. Comparación 2–4 países (núcleo)
**Qué:** seleccionas varios países y los ves lado a lado: radar superpuesto, barras
por métrica y una tabla "quién gana" por dimensión.
**Cómo:** modo "compare" en el store con un array de ISO3; el globo resalta esos
países; panel con tabla y radares.

---

## ⭐ 4. Index Builder — tu propio índice
**Qué:** sliders donde el usuario decide **cuánto le importa** cada dimensión y cada
submétrica (p.ej. 50% economía, 30% social, 20% política; dentro de social, subir
"sanidad"). La app **genera un ranking personalizado** y **recolorea el globo** según
ese índice.
**Por qué:** no existe un "mejor país" objetivo; depende de tus valores. Esto convierte
al usuario de espectador en autor. Es el feature estrella.
**Cómo:** pesos en el store; score = suma ponderada de scores normalizados; ranking
ordenado; globo coloreado por el índice; tabla "top 10 según TU criterio".
**Impl:** presets ("Calidad de vida", "Oportunidad económica", "Libertad",
"Para emigrar"). Pesos normalizados a 100%. Compartible por URL (deep link).

## ⭐ 5. Correlation Explorer
**Qué:** scatter de cualquier métrica X vs Y entre todos los países, con recta de
regresión, R² y resaltado de outliers. Ej.: "PIB/cápita vs felicidad".
**Por qué:** enseña relaciones (y su ausencia); es educativo y adictivo.
**Cómo:** dos selectores de métrica; puntos = países (color por región o por una 3ª
métrica = burbuja); D3 para la regresión. Click en punto → ficha.

## ⭐ 6. Outlier Radar
**Qué:** detecta países que rinden muy por encima/debajo de lo que predeciría su PIB
(o cualquier predictor). Ej.: "felicidad alta pese a PIB bajo".
**Por qué:** las historias interesantes están en los residuos, no en la media.
**Cómo:** regresión simple métrica ~ predictor; ordenar por residuo; listar
"sobre-rinden" y "infra-rinden". Resaltar en el globo.

## ⭐ 7. Time Machine
**Qué:** un slider de años; el globo coroplético y las fichas se **animan** mostrando
la evolución (p.ej. la difusión/retroceso de la democracia 2000–2024).
**Por qué:** el cambio en el tiempo cuenta historias que una foto fija no puede.
**Cómo:** datasets por año (no solo último); interpolar color entre años; botón
play/pause. Requiere que el pipeline guarde series, no solo el último valor.

## ⭐ 8. Lifestyle / Relocation Matcher
**Qué:** un breve quiz ("¿qué valoras? clima, impuestos bajos, sanidad, seguridad,
visados fáciles…") → países recomendados que encajan.
**Por qué:** caso de uso emocional y muy compartible (gente pensando en emigrar).
**Cómo:** mapea respuestas a pesos del Index Builder + filtros duros (visados, idioma);
devuelve top matches con explicación ("encaja porque…").

## ⭐ 9. AI Briefings (Claude)
**Qué:** un botón "Explícame este país" / "Compara estos dos" que genera un **resumen
en lenguaje natural** equilibrado a partir de las métricas reales.
**Por qué:** convierte tablas en comprensión; accesible para quien no lee gráficos.
**Cómo:** función serverless `api/briefing.ts` que recibe los datos del país (ya
cargados en cliente) y llama a la API de Anthropic con un prompt que **solo usa los
datos provistos** y mantiene neutralidad. Ver `api/briefing.ts` (stub).
**Impl/seguridad:** la clave de Anthropic vive en el servidor (env var), nunca en el
cliente. Límite de uso. El prompt debe prohibir inventar cifras y pedir tono neutral
y con fuentes.

## ⭐ 10. Data Stories
**Qué:** narrativas curadas tipo "scrollytelling" guiadas por datos ("El ascenso de
Asia", "La recesión democrática", "Quién envejece más rápido").
**Cómo:** secuencias declarativas (JSON) que mueven la cámara del globo, resaltan
países y muestran texto. Reusa el motor del globo.

## 11. Deep links y snapshots
**Qué:** cualquier estado (país, métrica activa, comparación, índice personalizado) se
codifica en la URL para compartir.
**Cómo:** sincronizar store ↔ query params. Botón "compartir" copia la URL.

## 12. Capa de honestidad (transversal)
**Qué:** cada métrica muestra fuente, año y, si aplica, "estimado" o "datos antiguos".
Una página de "Fuentes y créditos".
**Por qué:** diferencia un producto serio de un agregador opaco. Es un valor del
proyecto, no un extra.

---

## Priorización sugerida
1. Núcleo (1–3) → producto usable.
2. Index Builder (4) → el diferenciador, alto impacto.
3. Correlation Explorer (5) + Outliers (6) → profundidad analítica.
4. AI Briefings (9) → "wow" y accesibilidad.
5. Time Machine (7), Matcher (8), Stories (10) → expansión.
