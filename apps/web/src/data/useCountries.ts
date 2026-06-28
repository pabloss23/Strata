// Carga del dataset (JSON estatico). Cae al sample si no hay countries.json.
import { useQuery } from "@tanstack/react-query";
import type { Dataset } from "@/types/country";

async function loadDataset(): Promise<Dataset> {
  // Intenta el dataset real; si no existe, usa el de muestra.
  const candidates = ["/data/countries.json", "/data/countries.sample.json"];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (res.ok) return (await res.json()) as Dataset;
    } catch {
      /* siguiente candidato */
    }
  }
  throw new Error("No se pudo cargar el dataset");
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: loadDataset,
    staleTime: Infinity,
  });
}
