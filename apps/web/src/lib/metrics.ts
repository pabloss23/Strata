// Normalizacion 0-100, scores por dimension e indice personalizado.
// El corazon analitico de la app. Ver docs/METRICS.md

import type { Country, Dataset, Dimension, MetricDef, IndexWeights } from "@/types/country";

// Métricas muy sesgadas (distribución log-normal): el PIB per cápita va de ~219 $
// (Burundi) a ~288.000 $ (Mónaco). Con escala lineal casi todo el mundo cae en el
// extremo oscuro. Se normalizan en escala LOGARÍTMICA y, además, la leyenda usa
// los extremos REALES de los datos (mínimo y máximo exactos), no percentiles
// recortados — así "bajo" y "alto" del PIB son cifras fieles.
export const LOG_METRICS = new Set<string>(["gdp_per_capita"]);

// Percentil robusto para recortar outliers antes de escalar
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}

// Devuelve, por metrica, los limites robustos [lo, hi] entre paises
export function metricBounds(countries: Country[], metricId: string): [number, number] {
  const vals = countries
    .map((c) => c.metrics[metricId]?.value)
    .filter((v): v is number => v != null && !Number.isNaN(v))
    .sort((a, b) => a - b);
  if (vals.length === 0) return [0, 1];
  // Métricas log: extremos reales (min/max exactos) sobre valores positivos.
  if (LOG_METRICS.has(metricId)) {
    const pos = vals.filter((v) => v > 0);
    if (pos.length > 0) return [pos[0], pos[pos.length - 1]];
  }
  return [quantile(vals, 0.02), quantile(vals, 0.98)];
}

// Normaliza un valor crudo a 0-100 segun la direccion de la metrica
export function normalize(
  value: number | null | undefined,
  def: MetricDef,
  bounds: [number, number]
): number | null {
  if (value == null || Number.isNaN(value)) return null;
  const [lo, hi] = bounds;
  if (hi === lo) return 50;
  // En métricas log se interpola en el espacio logarítmico (reparte el color de
  // forma justa cuando los datos abarcan varios órdenes de magnitud).
  const useLog = LOG_METRICS.has(def.id) && lo > 0 && hi > 0;
  const v = useLog ? Math.log(value) : value;
  const l = useLog ? Math.log(lo) : lo;
  const h = useLog ? Math.log(hi) : hi;
  const clamped = Math.max(l, Math.min(h, v));
  const t = (clamped - l) / (h - l); // 0..1
  const score = def.direction === "lower_is_better" ? 1 - t : t;
  return Math.round(score * 1000) / 10; // 0..100, 1 decimal
}

// Pre-calcula bounds de todas las metricas (una vez por dataset)
export function computeAllBounds(ds: Dataset): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {};
  for (const def of ds.metricCatalog) out[def.id] = metricBounds(ds.countries, def.id);
  return out;
}

// Score 0-100 de una dimension para un pais (media de sus metricas normalizadas)
export function dimensionScore(
  country: Country,
  ds: Dataset,
  dimension: Dimension,
  bounds: Record<string, [number, number]>
): number | null {
  const defs = ds.metricCatalog.filter((m) => m.dimension === dimension);
  const scores = defs
    .map((d) => normalize(country.metrics[d.id]?.value, d, bounds[d.id]))
    .filter((s): s is number => s != null);
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// Indice GLOBAL personalizado con pesos del usuario (Index Builder, feature estrella)
export function customIndex(
  country: Country,
  ds: Dataset,
  weights: IndexWeights,
  bounds: Record<string, [number, number]>
): number | null {
  const dims: Dimension[] = ["economic", "political", "social"];
  let sum = 0;
  let wsum = 0;
  for (const dim of dims) {
    const s = dimensionScore(country, ds, dim, bounds);
    const w = weights[dim] ?? 0;
    if (s != null && w > 0) {
      sum += s * w;
      wsum += w;
    }
  }
  return wsum === 0 ? null : sum / wsum;
}

// Ranking de paises segun el indice personalizado
export function rankByIndex(ds: Dataset, weights: IndexWeights) {
  const bounds = computeAllBounds(ds);
  return ds.countries
    .map((c) => ({ country: c, score: customIndex(c, ds, weights, bounds) }))
    .filter((r) => r.score != null)
    .sort((a, b) => (b.score! - a.score!));
}

export interface Rank {
  rank: number; // 1 = mejor
  total: number; // países con dato para esta métrica
  pct: number; // percentil 0-100 (100 = mejor)
}

// Ranking mundial por métrica, respetando la dirección (más=mejor o menos=mejor).
export function rankMap(ds: Dataset, metricId: string): Map<string, Rank> {
  const def = ds.metricCatalog.find((m) => m.id === metricId);
  const lower = def?.direction === "lower_is_better";
  const rows = ds.countries
    .map((c) => ({ iso3: c.iso3, v: c.metrics[metricId]?.value }))
    .filter((r): r is { iso3: string; v: number } => r.v != null && !Number.isNaN(r.v));
  rows.sort((a, b) => (lower ? a.v - b.v : b.v - a.v));
  const total = rows.length;
  const out = new Map<string, Rank>();
  rows.forEach((r, i) => {
    const rank = i + 1;
    out.set(r.iso3, { rank, total, pct: total > 1 ? ((total - rank) / (total - 1)) * 100 : 100 });
  });
  return out;
}

// Presets de pesos para el Index Builder
export const INDEX_PRESETS: Record<string, IndexWeights> = {
  balanced: { economic: 1, political: 1, social: 1 },
  qualityOfLife: { economic: 0.8, political: 0.7, social: 1.5 },
  economicOpportunity: { economic: 1.6, political: 0.7, social: 0.7 },
  freedom: { economic: 0.6, political: 1.7, social: 0.7 },
  forExpats: { economic: 1.0, political: 0.9, social: 1.3 },
};
