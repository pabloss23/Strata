// Tipos del dominio. Espejo de data/schema/country_schema.json

export type Dimension = "economic" | "political" | "social";
export type Direction = "higher_is_better" | "lower_is_better" | "neutral";

export interface MetricDef {
  id: string;
  label: string;
  dimension: Dimension;
  direction: Direction;
  unit: string;
  source: string;
}

export interface MetricValue {
  value: number | null;
  year: number | null;
  source?: string;
  estimated?: boolean;
}

export interface Country {
  iso3: string;
  iso2?: string;
  name: string;
  region?: string;
  subregion?: string;
  capital?: string;
  flag?: string;
  population?: number | null;
  area_km2?: number | null;
  latlng?: [number, number];
  metrics: Record<string, MetricValue>;
  series?: Record<string, Record<string, number | null>>;
}

export interface Dataset {
  schemaVersion: string;
  generatedAt: string;
  metricCatalog: MetricDef[];
  countries: Country[];
}

// Pesos del Index Builder: por dimension y, opcionalmente, por metrica.
export interface IndexWeights {
  economic: number;
  political: number;
  social: number;
  perMetric?: Record<string, number>;
}
