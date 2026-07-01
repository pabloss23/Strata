// Tokens de diseño. USAR ESTO en componentes, nunca hex sueltos.
// Plataforma de datos premium: oro sobre azul profundo (estética Bloomberg/Apple).

import type { Dimension } from "@/types/country";

export const COLORS = {
  space900: "#050814", // fondo más profundo
  space800: "#08101F", // paneles
  space700: "#0D1326", // superficies elevadas
  space600: "#111A30",
  ink100: "#F8FAFC", // texto principal
  ink200: "#CBD5E1",
  ink300: "#94A3B8", // texto secundario
  ink500: "#64748B",
  grid: "#1E293B", // bordes / rejilla
  nodata: "#3C475E", // gris azulado, VISIBLE sobre el océano (antes casi negro)
} as const;

// Marca: el oro es EL acento (no hay acento por dimensión; el mapa es oro).
export const GOLD = "#E5B85B";
export const GOLD_HI = "#F2C870";
export const GOLD_DIM = "#8A6E34";

// Etiquetas y categorías del catálogo (para agrupar el selector de indicador).
export const DIMENSION_LABELS: Record<Dimension, string> = {
  economic: "Económicos",
  political: "Políticos",
  social: "Sociales",
};

export const DIMENSIONS: Dimension[] = ["economic", "political", "social"];

// Colores de dimensión: ya no colorean el mapa, solo un punto sutil en el catálogo.
export const DIMENSION_COLORS: Record<Dimension, string> = {
  economic: "#E8B04B",
  political: "#7C6FF0",
  social: "#3FBFA8",
};

export const STATUS_COLORS = {
  good: "#4FD1A1",
  warn: "#E5B85B",
  bad: "#E0556E",
} as const;
