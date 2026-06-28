# PRD — Strata: atlas comparativo del mundo

## 1. Visión

Una herramienta donde cualquiera —estudiante, periodista, inversor, curioso, alguien
pensando en emigrar— pueda **entender y comparar países** de un vistazo, en lo
económico, lo político y lo social, sin tener que cruzar diez webs distintas.

La diferencia frente a "otra web de estadísticas" es triple:
1. **Interfaz espacial**: un globo satélite donde el dato vive sobre la geografía.
2. **Criterio, no solo datos**: rankings personalizables, correlaciones, outliers,
   y resúmenes en lenguaje natural.
3. **Honestidad epistémica**: cada cifra con su fuente, su año y su nivel de
   confianza. La app no esconde la incertidumbre.

## 2. Usuarios y casos de uso

| Persona | Qué quiere | Feature que lo sirve |
|---|---|---|
| Estudiante / curioso | "¿Cómo se compara España con Japón?" | Modo comparación, fichas |
| Futuro emigrante | "¿Dónde podría vivir mejor según lo que me importa?" | Index Builder + Relocation lens |
| Periodista / analista | "Países que rinden por encima de su PIB" | Outliers + Correlation Explorer |
| Inversor | "Estabilidad política vs crecimiento" | Scatter de correlación, series temporales |
| Profesor | "Mostrar la 'recesión democrática' 2015–2025" | Time machine + Stories |

## 3. Alcance del MVP (v1)

**Incluye:**
- Globo 3D satélite con selección de país (click) y hover con tooltip.
- Coroplético: pintar el globo por una métrica elegida + leyenda.
- Panel de país: bandera, datos clave, **radar de las 3 dimensiones**, y top
  métricas por dimensión con su fuente/año.
- Modo comparación de 2–4 países (radar superpuesto + tabla "quién gana").
- ~25–30 indicadores reales de fuentes abiertas (ver `docs/METRICS.md`).
- Buscador de país por nombre.
- Responsive (desktop primero, móvil utilizable).
- i18n ES (EN/FR preparados).

**No incluye en v1 (va al roadmap):**
- Cuentas de usuario / guardado en la nube.
- IA de fichas (se añade en v1.1).
- Time machine animada (v1.2).

## 4. Features (resumen; detalle en `docs/FEATURES.md`)

### Núcleo
1. **Globo coroplético** — colorear la Tierra por cualquier indicador.
2. **Ficha de país** — radar de dimensiones + métricas con fuente.
3. **Comparación** — 2–4 países lado a lado.

### Innovadoras (lo que diferencia el proyecto)
4. **Index Builder** — el usuario pondera economía/política/social (y submétricas)
   con sliders → genera un **ranking personalizado** y recolorea el globo. "Tu
   propio índice de calidad de vida / poder / oportunidad."
5. **Correlation Explorer** — scatter de cualquier métrica X vs Y entre todos los
   países, con recta de regresión y R². ("¿Más PIB = más felicidad?")
6. **Outlier Radar** — detecta automáticamente países que rinden muy por encima o
   por debajo de lo que predeciría su PIB (residuos del modelo).
7. **Time Machine** — slider de años; el globo y las fichas se animan en el tiempo.
8. **Lifestyle / Relocation Matcher** — quiz de preferencias → países recomendados.
9. **AI Briefings** — resumen en lenguaje natural de un país o comparación (Claude).
10. **Data Stories** — narrativas curadas guiadas por datos.
11. **Deep links / snapshots** — compartir una comparación o un índice por URL.

## 5. Requisitos no funcionales

- **Rendimiento**: el globo a 60 fps en hardware medio; carga inicial < 3 s
  (datos baked en JSON, lazy-load de texturas).
- **Datos**: actualización del pipeline mensual/trimestral vía GitHub Actions.
- **Accesibilidad**: WCAG AA, navegación por teclado, modo daltónico, motion
  reducido.
- **Privacidad**: sin tracking invasivo; analítica agregada y anónima a lo sumo.
- **Coste**: hosting estático gratuito (Netlify/Vercel free tier); IA opcional y
  con límite de uso.

## 6. Métricas de éxito del producto

- Tiempo en sesión y nº de países explorados por sesión.
- % de usuarios que crean un índice personalizado (engagement con el feature
  estrella).
- Comparaciones compartidas (deep links generados).
- (Cualitativo) "¿Aprendí algo que no sabía?"

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Datos políticos sesgados/polémicos | Usar índices de terceros reputados, citar fuente, tono neutral, mostrar varios índices cuando existan |
| Datos incompletos por país | Estados vacíos explícitos + indicador de cobertura; nunca rellenar a ojo |
| Rendimiento del globo con muchos polígonos | Simplificar geometrías (topojson), LOD, deck.gl si hace falta |
| Licencias de datos | Catálogo de licencias y atribución (ver DATA_SOURCES) |
| "Otra web de stats" | Apostar por Index Builder + correlaciones + IA como diferenciador |

## 8. Decisiones abiertas

- ¿Globo (react-globe.gl) como única vista o también mapa 2D (MapLibre) para
  coroplético plano? → Empezar con globo; evaluar 2D según feedback.
- ¿Backend mínimo o 100% estático? → Estático para v1; serverless solo para IA.
- ¿Supabase desde v1? → Solo cuando se añadan cuentas (v2).
