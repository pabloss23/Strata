# DESIGN.md — Sistema de diseño

## Dirección: "estación de observación orbital"

Strata no es un dashboard corporativo ni una infografía de revista. Su mundo es el
de la **cartografía y la observación por satélite**: una sala de control que mira la
Tierra. El héroe es el **globo luminoso sobre el vacío**, y los datos se leen como en
una **consola de instrumentos** (coordenadas, lecturas, escalas), no como tarjetas
genéricas.

La apuesta estética (el riesgo justificado): **el dato ES el color**. Las tres
dimensiones tienen tres colores que recorren toda la interfaz —el globo, los radares,
los selectores, los acentos—. Aprender el producto es aprender un lenguaje de tres
colores. Eso es lo que se recuerda.

> Nota: evita los tres clichés de UI auto-generada (crema + serif + terracota; negro
> + verde ácido; periódico con filetes). Aquí el fondo es **espacio profundo**, no
> negro plano, y el protagonismo cromático lo llevan las tres dimensiones.

## Paleta (tokens)

```
--space-900:  #0A0E1A   /* fondo, vacío profundo (azul casi negro) */
--space-800:  #0E1428   /* paneles */
--space-700:  #161E38   /* superficies elevadas, bordes suaves */
--ink-100:    #E8ECF4   /* texto principal (blanco frío) */
--ink-300:    #9AA6BF   /* texto secundario, etiquetas */
--grid:       #233052   /* líneas de rejilla, meridianos, separadores */

/* Dimensiones (significado, no decoración) */
--econ:    #E8B04B      /* económica — ámbar */
--polit:   #7C6FF0      /* política — violeta */
--social:  #3FBFA8      /* social — verde-azulado */

/* Estados */
--good:    #4FD1A1
--warn:    #E8B04B
--bad:     #E0556E
--nodata:  #2A3654       /* (usar patrón rayado además del color) */
```

Variante **daltónica**: sustituir el trío por una rampa segura (p.ej. azul / naranja
/ magenta de ColorBrewer) activable en ajustes. El color nunca debe ser el único
portador de significado: acompañar con icono/etiqueta.

## Tipografía

Tres roles, fuentes abiertas (para web libre):

- **Display** — `Clash Display` o `Space Grotesk` (carácter geométrico, técnico pero
  con personalidad). Uso con restraint: titulares, nombre de país grande.
- **Texto/UI** — `Inter` (neutra, legible a tamaños pequeños, números tabulares).
- **Datos/mono** — `IBM Plex Mono` o `JetBrains Mono` para lecturas tipo instrumento:
  coordenadas (lat/long), códigos ISO, valores numéricos, ejes. Es parte del "look de
  consola".

Escala (ejemplo): 12 / 14 / 16 / 20 / 28 / 44 / 72. Números siempre tabulares.
Etiquetas de datos en mono, MAYÚSCULAS suaves con tracking ligero.

## Layout

```
┌───────────────────────────────────────────────────────────────┐
│  STRATA            [ Métrica ▾ ]  [ Comparar ] [ Índice ] [⌕]  │  ← barra fina
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ◐  GLOBO 3D SATÉLITE  ◑                    │
│                   (héroe; ocupa el centro)                      │
│                                                    ┌──────────┐ │
│   leyenda de color de la métrica activa  ───────► │  FICHA   │ │
│   [▮▮▮▮▮▮▮ 0 ──────────── 100]                     │  país    │ │
│                                                    │  radar   │ │
│                                                    │  métricas│ │
│                                                    └──────────┘ │
├───────────────────────────────────────────────────────────────┤
│  ESP · 40.4°N 3.7°W · pop 48M · fuente WB 2024   (barra estado)│  ← mono
└───────────────────────────────────────────────────────────────┘
```

- **Héroe = globo**, siempre presente. Los paneles flotan sobre él (vidrio sutil,
  no opaco) para no romper la inmersión.
- **Barra de estado inferior** estilo instrumento: ISO, lat/long, población, fuente
  del dato visible. En mono. Refuerza la identidad "observatorio".
- Densidad media: ni minimal vacío ni saturado. La elegancia está en el espaciado y
  en los números bien alineados.

## El elemento firma

La **leyenda-escala viva**: cuando cambias la métrica, la barra de leyenda y el globo
se recolorean con una transición coordinada, y la dimensión activa "ilumina" su color
en toda la UI (el selector, el borde de la ficha). Un único momento orquestado, no
mil animaciones sueltas.

## Movimiento

- Globo: rotación suave opcional; **desactivada** si `prefers-reduced-motion`.
- Transición de recoloreo al cambiar métrica (~400 ms, easing suave).
- Ficha: fade-in + leve translate al seleccionar país.
- Nada más. El exceso de animación delata diseño generado.

## Estados vacíos y errores (con voz, no de relleno)

- **Sin dato** para una métrica/país: no inventar. Mostrar "Sin datos · [fuente] no
  cubre este país" + patrón rayado en el mapa. Es una invitación, no un error mudo.
- **Fallo de carga**: "No se pudieron cargar los datos. Reintentar." En la voz de la
  interfaz, sin disculpas vagas.
- Copys en voz activa, sentence case, específicos: "Elige una métrica para colorear
  el mundo", no "No hay selección".

## Accesibilidad (suelo de calidad, no opcional)

- Contraste AA mínimo sobre el fondo oscuro.
- Foco de teclado visible (anillo en color de dimensión activa).
- Toda interacción del globo accesible también por lista/buscador (no solo click en
  la esfera).
- Modo daltónico + el color nunca como único canal de información.
