// Strata Founders — tipos del dominio. Inteligencia de jurisdicciones LEGAL para
// emprendedores: fiscalidad + constitución + cumplimiento + residencia + coste +
// estabilidad. Regla sagrada: cada dato lleva año + fuente + lastVerified; sin
// dato = gris ("no disponible"). Optimización legal, NUNCA evasión.

export type VerifyStatus = "verified" | "partial" | "pending";

/** Un dato siempre acompañado de su procedencia. */
export interface Field<T = string | number | boolean> {
  value: T;
  unit?: string;
  year?: number;
  source?: string;
  note?: string;
  caveat?: string;
}

export interface ResidencyOption {
  type: string; // "Visado nómada", "Startup visa", "Golden visa"…
  summary: string;
  incomeThresholdEUR?: number;
  durationMonths?: number;
  source?: string;
  year?: number;
}

/**
 * Señales numéricas que alimentan el MOTOR DE EMPAREJAMIENTO. Son resúmenes
 * curados (cada uno respaldado por su campo detallado con fuente en los pilares).
 * Direcciones: ver SIGNAL_DIRECTION en engine/match.ts.
 */
export interface Signals {
  corpTaxEff: number; // % tipo de sociedades EFECTIVO orientativo (menos = mejor)
  personalTaxEff: number; // % IRPF efectivo del fundador (menos = mejor)
  setupDays: number; // días para constituir (menos = mejor)
  bankingEase: number; // 0–3 acceso a banca/pagos (más = mejor)
  residencyEase: number; // 0–3 facilidad de visado/residencia (más = mejor)
  costOfLiving: number; // índice Numbeo (menos = mejor)
  stability: number; // 0–100 estabilidad+estado de derecho (más = mejor)
  complianceBurden: number; // 0–3 carga administrativa/contable (menos = mejor)
}

export interface Jurisdiction {
  iso3: string;
  name: string;
  status: VerifyStatus;
  lastVerified: string; // YYYY-MM
  euMember: boolean;
  territorial: boolean;
  signals: Signals;

  // 7 pilares (cada Field con año/fuente)
  companyTax: {
    corporateRate: Field;
    system: Field;
    vatStandard?: Field;
    capitalGains?: Field;
    dividendWHT?: Field;
    specialRegime?: Field;
  };
  setup: {
    incorporationDays: Field;
    incorporationCostEUR?: Field;
    foreignOwnership100: Field;
    remoteIncorporation: Field;
    bankingAccess: Field;
  };
  founderTax: {
    personalIncomeTopRate: Field;
    dividendTax?: Field;
    residencyTrigger: Field;
    newResidentRegime?: Field;
  };
  compliance: {
    cfcNote: Field;
    substance: Field;
    crsParticipant: Field;
    pillarTwo: Field;
  };
  residency: ResidencyOption[];
  living: {
    costOfLivingIndex?: Field;
    internetMbps?: Field;
    englishProficiency?: Field;
    timezone?: string;
  };
  stability: {
    ruleOfLaw?: Field;
    politicalStability?: Field;
    blacklistFlags: Field;
  };
}

export interface JurisdictionData {
  schemaVersion: string;
  generatedAt: string;
  disclaimer: string;
  jurisdictions: Jurisdiction[];
}

// ── Perfil del fundador (entrada del motor) ──────────────────────────────────
export type BusinessType = "saas" | "ecommerce" | "consulting" | "holding" | "creator";
export type ClientBase = "global" | "eu" | "us" | "local";

export type Criterion =
  | "corpTax"
  | "personalTax"
  | "setup"
  | "banking"
  | "residency"
  | "cost"
  | "stability"
  | "compliance";

export const CRITERIA: Criterion[] = [
  "corpTax",
  "personalTax",
  "setup",
  "banking",
  "residency",
  "cost",
  "stability",
  "compliance",
];

export interface FounderProfile {
  business: BusinessType;
  clients: ClientBase;
  nationality: string; // iso3 (avisos CFC)
  weights: Record<Criterion, number>; // 0–3 por criterio
}
