// Selectores derivados del dataset, memoizados. Una sola fuente de verdad para
// el índice por iso3, los bounds de normalización, el coloreado y el ranking.
import { useMemo } from "react";
import type { Country, Dataset, Dimension, MetricDef } from "@/types/country";
import { computeAllBounds, normalize, rankMap, type Rank } from "@/lib/metrics";
import { makeGoldScale, type ColorScale } from "@/lib/colorScale";
import { useCountries } from "./useCountries";
import { useStore } from "@/store/useStore";

export interface DatasetView {
  ds: Dataset | undefined;
  byIso3: Map<string, Country>;
  bounds: Record<string, [number, number]>;
}

/** Dataset + índice por iso3 + bounds de todas las métricas (memoizado). */
export function useDataset(): DatasetView {
  const { data: ds } = useCountries();
  return useMemo(() => {
    const byIso3 = new Map<string, Country>();
    if (ds) for (const c of ds.countries) byIso3.set(c.iso3, c);
    const bounds = ds ? computeAllBounds(ds) : {};
    return { ds, byIso3, bounds };
  }, [ds]);
}

export interface ActiveColoring {
  def: MetricDef | undefined;
  dimension: Dimension | undefined;
  scale: ColorScale;
  /** Score normalizado 0-100 del país para la métrica activa (null = sin dato). */
  scoreOf: (iso3: string) => number | null;
  /** Ranking mundial del país para la métrica activa (null = sin dato). */
  rankOf: (iso3: string) => Rank | undefined;
  total: number;
}

/** Todo lo necesario para colorear el globo, la leyenda y el ranking. */
export function useActiveColoring(): ActiveColoring {
  const { ds, byIso3, bounds } = useDataset();
  const activeMetric = useStore((s) => s.activeMetric);
  const highContrast = useStore((s) => s.highContrast);

  return useMemo(() => {
    const def = ds?.metricCatalog.find((m) => m.id === activeMetric);
    const dimension = def?.dimension;
    const scale = makeGoldScale(highContrast);
    const b = (def && bounds[def.id]) || [0, 1];
    const ranks = ds && def ? rankMap(ds, def.id) : new Map<string, Rank>();
    const scoreOf = (iso3: string): number | null => {
      if (!def) return null;
      const c = byIso3.get(iso3);
      return normalize(c?.metrics[def.id]?.value, def, b);
    };
    return {
      def,
      dimension,
      scale,
      scoreOf,
      rankOf: (iso3: string) => ranks.get(iso3),
      total: ds?.countries.length ?? 0,
    };
  }, [ds, byIso3, bounds, activeMetric, highContrast]);
}
