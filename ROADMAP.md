# ROADMAP.md — Plan por fases

Fases pensadas para entregar valor pronto y dejar el "wow" para cuando la base sea
sólida. Cada fase es desplegable.

## Fase 0 — Cimientos (esta carpeta) ✅
- Estructura del repo, documentación de contexto (este scaffold).
- Esquema de datos + dataset de muestra.
- Stubs de Globe y tipos.

## Fase 1 — MVP usable ✅
**Meta:** seleccionar país en el globo y ver sus datos reales; colorear por una métrica.
- [x] Pipeline ETL: World Bank (15 indicadores, incl. 6 WGI de gobernanza) +
      metadatos World Bank + fronteras world-atlas. Salida: `data/processed/countries.json`
      (217 países) validado contra el esquema. REST Countries quedó deprecado → se
      sustituyó por el endpoint `/country` del World Bank.
- [x] Globo con fronteras y selección por click + hover tooltip de instrumento.
- [x] **Coroplético**: colorear por métrica seleccionable + leyenda viva (recoloreo
      coordinado globo+leyenda+acento de toda la UI por dimensión activa).
- [x] Ficha de país: radar de 3 dimensiones + métricas con fuente/año.
- [x] Buscador de país (paleta con teclado, atajo `/`).
- [x] Tema/diseño base (tokens, tipografía display/mono, barra de estado).
- [x] Responsive + accesibilidad base (foco visible, reduced-motion, modo daltónico).
*Entregable:* web pública que ya es útil.

## Fase 2 — Comparar y personalizar (el diferenciador)
- [ ] Modo comparación 2–4 países (radar superpuesto + tabla "quién gana").
- [ ] ⭐ **Index Builder**: pesos por dimensión/submétrica → ranking + recoloreo.
- [ ] Presets de índice + deep links (compartir estado por URL).
*Entregable:* "tu propio índice del mundo".

## Fase 3 — Profundidad analítica
- [ ] ⭐ **Correlation Explorer** (scatter X/Y + regresión + R²).
- [ ] ⭐ **Outlier Radar** (quién rinde sobre/bajo lo esperado).
- [ ] Más indicadores (V-Dem, Freedom House, HDI, felicidad…).
- [ ] Página "Fuentes y créditos".

## Fase 4 — IA y narrativa
- [ ] ⭐ **AI Briefings** (función serverless + API Anthropic, clave en servidor).
- [ ] ⭐ **Data Stories** (scrollytelling sobre el globo).

## Fase 5 — Tiempo y emoción
- [ ] ⭐ **Time Machine** (series por año + animación del globo).
- [ ] ⭐ **Lifestyle / Relocation Matcher** (quiz → países que encajan).

## Fase 6 — Cuentas y comunidad (opcional)
- [ ] Supabase: guardar índices/comparaciones, compartir, favoritos.
- [ ] Índices destacados de la comunidad.

## Ideas para más adelante (backlog)
- Comercio bilateral (arcos en el globo entre países).
- Vista de ciudades (no solo países).
- Exportar comparación a imagen/PDF.
- Modo "examen": adivina el país por sus métricas (gamificación educativa).
- API pública propia (servir el dataset normalizado a terceros).
