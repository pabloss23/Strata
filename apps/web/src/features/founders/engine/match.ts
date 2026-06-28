// Motor de emparejamiento (MVP). Perfil del fundador → ranking de jurisdicciones
// por percentiles de los criterios ponderados, con la APORTACIÓN de cada criterio
// y avisos de cumplimiento (CFC). Determinista; ante huecos renormaliza; si falta
// >40% del peso → "parcial". No inventa: solo ordena datos existentes.
import type { Criterion, FounderProfile, Jurisdiction, Signals } from "../types";

type Dir = "high" | "low";
const SIGNAL: Record<Criterion, { key: keyof Signals; dir: Dir }> = {
  corpTax: { key: "corpTaxEff", dir: "low" },
  personalTax: { key: "personalTaxEff", dir: "low" },
  setup: { key: "setupDays", dir: "low" },
  banking: { key: "bankingEase", dir: "high" },
  residency: { key: "residencyEase", dir: "high" },
  cost: { key: "costOfLiving", dir: "low" },
  stability: { key: "stability", dir: "high" },
  compliance: { key: "complianceBurden", dir: "low" },
};

// Nacionalidades con regímenes CFC estrictos (UE/ATAD + otras economías).
// Si el fundador es de aquí y la jurisdicción es de baja tributación o territorial,
// los beneficios no distribuidos pueden atribuírsele en su país.
export const CFC_STRICT = new Set<string>([
  "ESP", "FRA", "DEU", "ITA", "PRT", "NLD", "BEL", "AUT", "SWE", "DNK", "FIN", "IRL", "POL", "GRC",
  "CZE", "HUN", "ROU", "BGR", "HRV", "SVK", "SVN", "LTU", "LVA", "EST", "LUX", "CYP", "MLT",
  "GBR", "USA", "CAN", "AUS", "NZL", "JPN", "KOR", "NOR", "ISL", "CHE",
]);

export interface Contribution {
  criterion: Criterion;
  weight: number;
  percentile: number; // 0–100 (más = mejor para el criterio)
  weighted: number; // aportación al score
}
export interface MatchResult {
  jurisdiction: Jurisdiction;
  score: number; // 0–100
  contributions: Contribution[];
  cfcWarning: boolean;
  lowTax: boolean;
  partial: boolean;
}

function percentile(value: number, all: number[], dir: Dir): number {
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  if (hi === lo) return 50;
  const t = (value - lo) / (hi - lo); // 0..1 (alto valor)
  return Math.round((dir === "low" ? 1 - t : t) * 1000) / 10;
}

/** Calcula el ranking para un perfil de fundador sobre las jurisdicciones dadas. */
export function rankJurisdictions(profile: FounderProfile, list: Jurisdiction[]): MatchResult[] {
  // Pre-calcula los rangos de cada criterio.
  const ranges: Partial<Record<Criterion, number[]>> = {};
  (Object.keys(SIGNAL) as Criterion[]).forEach((c) => {
    ranges[c] = list.map((j) => j.signals[SIGNAL[c].key]).filter((v) => typeof v === "number" && !Number.isNaN(v));
  });

  const results = list.map((j): MatchResult => {
    const contributions: Contribution[] = [];
    let sum = 0;
    let wsum = 0;
    let missingWeight = 0;
    let totalWeight = 0;

    (Object.keys(SIGNAL) as Criterion[]).forEach((c) => {
      const w = profile.weights[c] ?? 0;
      if (w <= 0) return;
      totalWeight += w;
      const raw = j.signals[SIGNAL[c].key];
      if (typeof raw !== "number" || Number.isNaN(raw)) {
        missingWeight += w;
        return;
      }
      const pct = percentile(raw, ranges[c]!, SIGNAL[c].dir);
      contributions.push({ criterion: c, weight: w, percentile: pct, weighted: pct * w });
      sum += pct * w;
      wsum += w;
    });

    const score = wsum === 0 ? 0 : Math.round((sum / wsum) * 10) / 10;
    const partial = totalWeight > 0 && missingWeight / totalWeight > 0.4;
    const lowTax = j.signals.corpTaxEff < 10 || j.territorial;
    const cfcWarning = lowTax && CFC_STRICT.has(profile.nationality);

    contributions.sort((a, b) => b.weighted - a.weighted);
    return { jurisdiction: j, score, contributions, cfcWarning, lowTax, partial };
  });

  return results.sort((a, b) => b.score - a.score);
}

/** Pesos por defecto, sesgados ligeramente por tipo de negocio. */
export function defaultWeights(): Record<Criterion, number> {
  return { corpTax: 2, personalTax: 2, setup: 1, banking: 1, residency: 1, cost: 1, stability: 2, compliance: 1 };
}
