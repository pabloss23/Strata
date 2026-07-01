// Rampa coroplética ORO: un único lenguaje de color para todo indicador.
// Valores bajos = oro oscuro · medios = oro · altos = oro brillante.
// Sin datos = gris oscuro. Ver el brief de diseño (estética Bloomberg).

import { scaleLinear } from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import { COLORS, GOLD, GOLD_HI } from "./theme";

export type ColorScale = (score: number) => string;

/** Rampa oro (oscuro → oro → brillante). `highContrast` ensancha la luminancia. */
export function makeGoldScale(highContrast = false): ColorScale {
  const low = highContrast ? "#2A2008" : "#5A4A24";
  const mid = GOLD;
  const high = highContrast ? "#FFF1CC" : GOLD_HI;
  const scale = scaleLinear<string>()
    .domain([0, 55, 100])
    .range([low, mid, high])
    .clamp(true)
    .interpolate(interpolateHcl);
  return (score: number) => scale(score);
}

/** Color para una celda del mapa: score o null → color "sin datos".
 *  `nodataColor` permite un gris más claro en el tema claro (evita parches negros). */
export function capColor(score: number | null, scale: ColorScale, nodataColor: string = COLORS.nodata): string {
  return score == null || Number.isNaN(score) ? nodataColor : scale(score);
}

/** Muestras [0..100] para pintar la barra de leyenda como gradiente CSS. */
export function legendStops(scale: ColorScale, n = 12): string[] {
  return Array.from({ length: n }, (_, i) => scale((i / (n - 1)) * 100));
}

export function legendGradient(scale: ColorScale): string {
  return `linear-gradient(90deg, ${legendStops(scale).join(", ")})`;
}
