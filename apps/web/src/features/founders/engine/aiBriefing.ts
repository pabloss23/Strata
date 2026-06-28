// Cliente de la IA anclada (gratuita). Llama a /api/briefing (función serverless
// con Gemini). Si no existe o falla (p. ej. en local sin función), devuelve null
// y la UI usa el briefing determinista. La clave vive en el servidor, no aquí.
import type { Field } from "../types";
import type { MatchResult } from "./match";

interface AiPick {
  name: string;
  score: number;
  corporateRate?: string;
  personalRate?: string;
  system?: string;
  cfcNote?: string;
  cfcWarning?: boolean;
  status?: string;
  lastVerified?: string;
}
export interface AiPayload {
  lang: "es" | "ca" | "en";
  business: string;
  clients: string;
  nationality: string;
  picks: AiPick[];
}

const fieldStr = (f?: Field): string | undefined =>
  !f || f.value === "" || f.value == null ? undefined : `${f.value}${f.unit ? ` ${f.unit}` : ""}`;

export function buildAiPayload(
  lang: "es" | "ca" | "en",
  business: string,
  clients: string,
  nationality: string,
  results: MatchResult[]
): AiPayload {
  return {
    lang,
    business,
    clients,
    nationality,
    picks: results.slice(0, 5).map((r) => ({
      name: r.jurisdiction.name,
      score: Math.round(r.score),
      corporateRate: fieldStr(r.jurisdiction.companyTax.corporateRate),
      personalRate: fieldStr(r.jurisdiction.founderTax.personalIncomeTopRate),
      system: fieldStr(r.jurisdiction.companyTax.system),
      cfcNote: fieldStr(r.jurisdiction.compliance.cfcNote),
      cfcWarning: r.cfcWarning,
      status: r.jurisdiction.status,
      lastVerified: r.jurisdiction.lastVerified,
    })),
  };
}

/** Devuelve el texto del briefing IA, o null si no está disponible. */
export async function fetchAiBriefing(payload: AiPayload): Promise<string | null> {
  try {
    const r = await fetch("/api/briefing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { text?: string };
    return data.text?.trim() || null;
  } catch {
    return null;
  }
}
