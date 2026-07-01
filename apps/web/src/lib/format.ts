// Formato de numeros y lecturas tipo instrumento. Numeros tabulares, locale ES.
import type { MetricDef } from "@/types/country";

const nf = (min = 0, max = 1) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: min, maximumFractionDigits: max });

/** Numero con separador de miles y hasta `dec` decimales. */
export function num(value: number, dec = 1): string {
  return nf(0, dec).format(value);
}

/** Valor crudo de una metrica con su unidad, formateado segun el tipo. */
export function formatValue(value: number | null | undefined, def: MetricDef): string {
  if (value == null || Number.isNaN(value)) return "—";
  const u = def.unit;
  if (u === "USD") return `${nf(0, 0).format(Math.round(value))} $`;
  if (u.startsWith("%")) return `${num(value, 1)} %`;
  if (u.includes("0-100") || u.includes("percentil")) return num(value, 1);
  return num(value, 1);
}

/**
 * Valor para los EXTREMOS de la leyenda: números limpios y redondos en vez de
 * cifras crudas raras (p. ej. 288.001 $ → 288.000 $). USD grande se redondea a
 * miles/cientos; el resto usa el formato normal.
 */
export function formatLegend(value: number | null | undefined, def: MetricDef): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (def.unit === "USD") {
    const abs = Math.abs(value);
    const v = abs >= 100000 ? Math.round(value / 1000) * 1000 : abs >= 10000 ? Math.round(value / 100) * 100 : Math.round(value);
    return `${nf(0, 0).format(v)} $`;
  }
  return formatValue(value, def);
}

/** Poblacion compacta: 48,8 M · 1,42 mil M. */
export function formatPopulation(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e9) return `${num(n / 1e9, 2)} mil M`;
  if (n >= 1e6) return `${num(n / 1e6, 1)} M`;
  if (n >= 1e3) return `${num(n / 1e3, 0)} mil`;
  return num(n, 0);
}

/** Area en km2 compacta. */
export function formatArea(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${nf(0, 0).format(Math.round(n))} km²`;
}

/** Coordenada estilo consola: 40.4°N 3.7°O. */
export function formatLatLng(latlng: [number, number] | undefined | null): string {
  if (!latlng) return "—";
  const [lat, lon] = latlng;
  const ns = lat >= 0 ? "N" : "S";
  const eo = lon >= 0 ? "E" : "O";
  return `${Math.abs(lat).toFixed(1)}°${ns} ${Math.abs(lon).toFixed(1)}°${eo}`;
}
