// Briefing anclado DETERMINISTA: compone una explicación en lenguaje natural SOLO
// a partir de los datos reales de las jurisdicciones (con su fuente). No usa IA ni
// red: es imposible que invente cifras. Reutilizado por el panel y por el export.
import type { Field, FounderProfile } from "../types";
import type { MatchResult } from "./match";

export type Block = { h: string } | { p: string } | { ul: string[] };

export interface BriefingHelpers {
  ft: (k: string, p?: Record<string, string | number>) => string;
  criterion: (c: import("../types").Criterion) => string;
  business: (b: import("../types").BusinessType) => string;
  clients: (c: import("../types").ClientBase) => string;
}

function fieldStr(f?: Field): string {
  if (!f || f.value === "" || f.value == null) return "—";
  return `${f.value}${f.unit ? ` ${f.unit}` : ""}`;
}

export function buildBriefing(
  profile: FounderProfile,
  results: MatchResult[],
  nationName: string,
  h: BriefingHelpers
): Block[] {
  const blocks: Block[] = [];
  const top = results.slice(0, 3);

  blocks.push({
    p: h.ft("b_intro", { business: h.business(profile.business), clients: h.clients(profile.clients), nation: nationName }),
  });

  top.forEach((r, i) => {
    const j = r.jurisdiction;
    const strengths = r.contributions.slice(0, 2).map((c) => h.criterion(c.criterion)).join(", ") || "—";
    blocks.push({ p: h.ft("b_pick", { rank: i + 1, name: j.name, score: Math.round(r.score), strengths }) });
    blocks.push({
      p: h.ft("b_data", {
        corp: fieldStr(j.companyTax.corporateRate),
        pers: fieldStr(j.founderTax.personalIncomeTopRate),
        setup: fieldStr(j.setup.incorporationDays),
      }),
    });
    if (r.cfcWarning) blocks.push({ p: `⚠ ${h.ft("cfc_warning")}` });
  });

  blocks.push({ h: h.ft("b_watch_h") });
  blocks.push({
    ul: [h.ft("b_watch_pe"), h.ft("b_watch_cfc"), h.ft("b_watch_substance"), h.ft("b_watch_vat"), h.ft("b_watch_residency")],
  });
  blocks.push({ p: h.ft("b_close") });

  return blocks;
}
