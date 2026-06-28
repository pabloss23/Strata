// Carga las fronteras (world-atlas TopoJSON, bundle local) y las convierte a
// GeoJSON, etiquetando cada feature con su iso3 via el puente numerico.
import { useQuery } from "@tanstack/react-query";
import { feature } from "topojson-client";
import { iso3FromNumeric } from "@/lib/isoNumeric";

export interface BorderFeature {
  type: "Feature";
  id?: string | number;
  properties: { iso3?: string; name?: string };
  geometry: unknown;
}

async function loadBorders(): Promise<BorderFeature[]> {
  const res = await fetch("/geo/countries-110m.json");
  if (!res.ok) throw new Error("No se pudieron cargar las fronteras");
  const topo: any = await res.json();
  const fc: any = feature(topo, topo.objects.countries);
  for (const f of fc.features as BorderFeature[]) {
    f.properties = {
      iso3: iso3FromNumeric(f.id),
      name: (f.properties as any)?.name,
    };
  }
  // Fuera la Antartida: no es un pais del dataset y ensucia el plano sur.
  return (fc.features as BorderFeature[]).filter((f) => f.properties.iso3 !== "ATA");
}

export function useBorders() {
  return useQuery({ queryKey: ["borders"], queryFn: loadBorders, staleTime: Infinity });
}
