// Serie histórica de un país+indicador, pedida al vuelo al World Bank (CORS OK).
// Datos reales: nunca inventamos la evolución.
import { useQuery } from "@tanstack/react-query";
import { WB_CODE } from "@/lib/worldbankCodes";

export interface EvoPoint {
  year: number;
  value: number;
}

async function fetchSeries(iso3: string, metricId: string): Promise<EvoPoint[]> {
  const m = WB_CODE[metricId];
  if (!m) return [];
  const params = new URLSearchParams({ format: "json", per_page: "500" });
  if (m.source) params.set("source", String(m.source));
  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${m.code}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("World Bank API error");
  const json = await res.json();
  const rows: any[] = Array.isArray(json) && json[1] ? json[1] : [];
  return rows
    .map((r) => ({ year: Number(r.date), value: r.value == null ? NaN : Number(r.value) }))
    .filter((p) => !Number.isNaN(p.year) && !Number.isNaN(p.value))
    .sort((a, b) => a.year - b.year);
}

export function useEvolution(iso3: string | undefined, metricId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["evolution", iso3, metricId],
    queryFn: () => fetchSeries(iso3!, metricId!),
    enabled: enabled && !!iso3 && !!metricId && !!WB_CODE[metricId],
    staleTime: Infinity,
  });
}
