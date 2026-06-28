// i18n de Strata Founders (aislado). Reutiliza idioma y nombres de país de la app
// principal; añade su propio diccionario de chrome y etiquetas.
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { BusinessType, ClientBase, Criterion, VerifyStatus } from "./types";

type Dict = Record<string, string>;

const ES: Dict = {
  founders: "Founders",
  founders_sub: "Dónde basar tu empresa, legalmente",
  back_to_globe: "Volver al globo",
  nav_match: "Recomendador",
  nav_browse: "Jurisdicciones",
  nav_compare: "Comparar",
  nav_glossary: "Glosario",
  legal_banner:
    "Información educativa, no asesoramiento. Depende de tu situación y nacionalidad. Optimización legal, nunca evasión. Consulta a un profesional transfronterizo.",
  coverage: "{n}/{t} verificadas",
  seed_note: "Datos de partida orientativos, pendientes de doble verificación.",

  your_profile: "Tu perfil de fundador",
  business_q: "¿Qué tipo de negocio?",
  clients_q: "¿Dónde están tus clientes?",
  nationality_q: "¿Cuál es tu nacionalidad?",
  nationality_ph: "Buscar país…",
  priorities_q: "¿Qué te importa más?",
  see_matches: "Ver recomendaciones",
  recalc: "Recalcular",
  best_matches: "Mejores encajes para ti",
  match_intro: "Ordenado por tus prioridades sobre datos públicos. La aportación de cada criterio es transparente.",
  score: "Encaje",
  why: "Por qué encaja",
  open_profile: "Ver ficha",
  add_compare: "Comparar",
  in_compare: "En comparación",
  cfc_warning:
    "Aviso CFC: tu nacionalidad aplica reglas de transparencia fiscal internacional. Los beneficios no distribuidos de una sociedad de baja tributación que controlas pueden atribuirse y gravarse en tu país. Exige sustancia real y declaración.",
  low_tax_note: "Jurisdicción de baja tributación o territorial: el cuadro de cumplimiento importa más que el tipo titular.",
  partial_flag: "Parcial",
  partial_help: "Falta más del 40 % del peso con dato.",

  // Estado de verificación
  status_verified: "Verificada",
  status_partial: "En revisión",
  status_pending: "Pendiente",
  verify_source: "Verificar en fuente",
  last_verified: "Última verificación",
  no_data: "no disponible",

  // Pilares
  pillar_companyTax: "Fiscalidad de empresa",
  pillar_setup: "Constitución y operación",
  pillar_founderTax: "Fiscalidad del fundador",
  pillar_compliance: "Cumplimiento",
  pillar_residency: "Residencia y movilidad",
  pillar_living: "Coste y calidad de vida",
  pillar_stability: "Estabilidad y reputación",

  // Campos
  fld_corporateRate: "Sociedades",
  fld_system: "Sistema",
  fld_vatStandard: "IVA",
  fld_capitalGains: "Plusvalías",
  fld_dividendWHT: "Retención dividendos",
  fld_specialRegime: "Régimen especial",
  fld_incorporationDays: "Días para constituir",
  fld_incorporationCostEUR: "Coste de constitución",
  fld_foreignOwnership100: "100 % propiedad extranjera",
  fld_remoteIncorporation: "Constitución remota",
  fld_bankingAccess: "Acceso bancario",
  fld_personalIncomeTopRate: "IRPF (máx.)",
  fld_dividendTax: "Dividendos del socio",
  fld_residencyTrigger: "Disparador de residencia",
  fld_newResidentRegime: "Régimen nuevo residente",
  fld_cfcNote: "Exposición CFC",
  fld_substance: "Sustancia",
  fld_crsParticipant: "CRS",
  fld_pillarTwo: "Pillar Two",
  fld_costOfLivingIndex: "Coste de vida (índice)",
  fld_internetMbps: "Internet",
  fld_englishProficiency: "Inglés",
  fld_timezone: "Huso horario",
  fld_ruleOfLaw: "Estado de derecho",
  fld_politicalStability: "Estabilidad política",
  fld_blacklistFlags: "Banderas reputacionales",

  yes: "Sí",
  no: "No",
  glossary_intro: "Los conceptos clave de fiscalidad internacional para fundadores, explicados. Educación, no asesoramiento.",
  read_more: "Saber más",
  compare_empty: "Añade jurisdicciones desde el recomendador o el listado para compararlas.",
  remove: "Quitar",

  // Briefing anclado (determinista, sin IA: solo lee los datos)
  briefing: "Briefing",
  generate_briefing: "Generar briefing",
  briefing_title: "Briefing del fundador",
  briefing_anchored: "Generado solo a partir de los datos públicos de la ficha; no inventa cifras.",
  ai_button: "Mejorar con IA (gratis)",
  ai_loading: "Generando con IA…",
  ai_section: "Resumen con IA",
  ai_unavailable: "IA no disponible (configura GEMINI_API_KEY en el despliegue). Te mostramos el briefing base, que no necesita IA.",
  b_intro: "Para un fundador de {business} con clientes {clients} y nacionalidad {nation}, estos son tus mejores encajes según tus prioridades, sobre datos públicos:",
  b_pick: "{rank}. {name} — encaje {score}/100. Destaca en {strengths}.",
  b_data: "Sociedades: {corp}. IRPF (máx.): {pers}. Constitución: {setup}.",
  b_watch_h: "Qué revisar con un asesor (independiente de la jurisdicción)",
  b_watch_pe: "Establecimiento permanente y sede de dirección efectiva: gestionar la empresa desde tu país puede hacerla tributable allí.",
  b_watch_cfc: "CFC: si controlas una sociedad de baja tributación, tu país puede atribuirte los beneficios no distribuidos.",
  b_watch_substance: "Sustancia económica real: sin ella, la estructura no protege.",
  b_watch_vat: "IVA/OSS: vender a clientes de la UE puede obligarte a repercutir su IVA aunque la empresa esté fuera.",
  b_watch_residency: "Residencia personal: los 183 días y tus vínculos determinan dónde tributas tú.",
  b_close: "Esto es información educativa, no asesoramiento. El CFC y tu tributación dependen de tu nacionalidad y residencia. Consulta a un asesor transfronterizo.",

  // Exportar informe
  export: "Exportar",
  export_md: "Descargar Markdown",
  print_pdf: "Imprimir / Guardar PDF",
  report_title: "Informe de fundador · Strata Founders",
  report_profile: "Perfil",
  report_ranking: "Ranking de jurisdicciones",
  report_sources: "Fuentes y verificación",

  // Escenarios guardados + frescura
  scenarios: "Escenarios",
  save_scenario: "Guardar escenario",
  scenario_name_ph: "Nombre del escenario…",
  no_scenarios: "Sin escenarios guardados.",
  load: "Cargar",
  stale_flag: "Pendiente de revisión",
  stale_help: "La última verificación supera los 12 meses.",
  data_updated: "Los datos se han actualizado desde tu última visita.",
};

const CA: Dict = {
  founders: "Founders",
  founders_sub: "On basar la teua empresa, legalment",
  back_to_globe: "Tornar al globus",
  nav_match: "Recomanador",
  nav_browse: "Jurisdiccions",
  nav_compare: "Comparar",
  nav_glossary: "Glossari",
  legal_banner:
    "Informació educativa, no assessorament. Depén de la teua situació i nacionalitat. Optimització legal, mai evasió. Consulta un professional transfronterer.",
  coverage: "{n}/{t} verificades",
  seed_note: "Dades de partida orientatives, pendents de doble verificació.",

  your_profile: "El teu perfil de fundador",
  business_q: "Quin tipus de negoci?",
  clients_q: "On són els teus clients?",
  nationality_q: "Quina és la teua nacionalitat?",
  nationality_ph: "Cerca país…",
  priorities_q: "Què t'importa més?",
  see_matches: "Veure recomanacions",
  recalc: "Recalcular",
  best_matches: "Millors encaixos per a tu",
  match_intro: "Ordenat per les teues prioritats sobre dades públiques. L'aportació de cada criteri és transparent.",
  score: "Encaix",
  why: "Per què encaixa",
  open_profile: "Veure fitxa",
  add_compare: "Comparar",
  in_compare: "En comparació",
  cfc_warning:
    "Avís CFC: la teua nacionalitat aplica regles de transparència fiscal internacional. Els beneficis no distribuïts d'una societat de baixa tributació que controles poden atribuir-se i gravar-se al teu país. Exigeix substància real i declaració.",
  low_tax_note: "Jurisdicció de baixa tributació o territorial: el quadre de compliment importa més que el tipus titular.",
  partial_flag: "Parcial",
  partial_help: "Falta més del 40 % del pes amb dada.",

  status_verified: "Verificada",
  status_partial: "En revisió",
  status_pending: "Pendent",
  verify_source: "Verificar en font",
  last_verified: "Última verificació",
  no_data: "no disponible",

  pillar_companyTax: "Fiscalitat d'empresa",
  pillar_setup: "Constitució i operació",
  pillar_founderTax: "Fiscalitat del fundador",
  pillar_compliance: "Compliment",
  pillar_residency: "Residència i mobilitat",
  pillar_living: "Cost i qualitat de vida",
  pillar_stability: "Estabilitat i reputació",

  fld_corporateRate: "Societats",
  fld_system: "Sistema",
  fld_vatStandard: "IVA",
  fld_capitalGains: "Plusvàlues",
  fld_dividendWHT: "Retenció dividends",
  fld_specialRegime: "Règim especial",
  fld_incorporationDays: "Dies per a constituir",
  fld_incorporationCostEUR: "Cost de constitució",
  fld_foreignOwnership100: "100 % propietat estrangera",
  fld_remoteIncorporation: "Constitució remota",
  fld_bankingAccess: "Accés bancari",
  fld_personalIncomeTopRate: "IRPF (màx.)",
  fld_dividendTax: "Dividends del soci",
  fld_residencyTrigger: "Disparador de residència",
  fld_newResidentRegime: "Règim nou resident",
  fld_cfcNote: "Exposició CFC",
  fld_substance: "Substància",
  fld_crsParticipant: "CRS",
  fld_pillarTwo: "Pillar Two",
  fld_costOfLivingIndex: "Cost de vida (índex)",
  fld_internetMbps: "Internet",
  fld_englishProficiency: "Anglés",
  fld_timezone: "Fus horari",
  fld_ruleOfLaw: "Estat de dret",
  fld_politicalStability: "Estabilitat política",
  fld_blacklistFlags: "Banderes reputacionals",

  yes: "Sí",
  no: "No",
  glossary_intro: "Els conceptes clau de fiscalitat internacional per a fundadors, explicats. Educació, no assessorament.",
  read_more: "Saber-ne més",
  compare_empty: "Afig jurisdiccions des del recomanador o el llistat per a comparar-les.",
  remove: "Llevar",

  briefing: "Briefing",
  generate_briefing: "Generar briefing",
  briefing_title: "Briefing del fundador",
  briefing_anchored: "Generat només a partir de les dades públiques de la fitxa; no inventa xifres.",
  ai_button: "Millorar amb IA (gratis)",
  ai_loading: "Generant amb IA…",
  ai_section: "Resum amb IA",
  ai_unavailable: "IA no disponible (configura GEMINI_API_KEY al desplegament). Et mostrem el briefing base, que no necessita IA.",
  b_intro: "Per a un fundador de {business} amb clients {clients} i nacionalitat {nation}, estos són els teus millors encaixos segons les teues prioritats, sobre dades públiques:",
  b_pick: "{rank}. {name} — encaix {score}/100. Destaca en {strengths}.",
  b_data: "Societats: {corp}. IRPF (màx.): {pers}. Constitució: {setup}.",
  b_watch_h: "Què revisar amb un assessor (independent de la jurisdicció)",
  b_watch_pe: "Establiment permanent i seu de direcció efectiva: gestionar l'empresa des del teu país pot fer-la tributable allí.",
  b_watch_cfc: "CFC: si controles una societat de baixa tributació, el teu país pot atribuir-te els beneficis no distribuïts.",
  b_watch_substance: "Substància econòmica real: sense ella, l'estructura no protegeix.",
  b_watch_vat: "IVA/OSS: vendre a clients de la UE pot obligar-te a repercutir el seu IVA encara que l'empresa estiga fora.",
  b_watch_residency: "Residència personal: els 183 dies i els teus vincles determinen on tributes tu.",
  b_close: "Açò és informació educativa, no assessorament. El CFC i la teua tributació depenen de la teua nacionalitat i residència. Consulta un assessor transfronterer.",

  export: "Exportar",
  export_md: "Descarregar Markdown",
  print_pdf: "Imprimir / Guardar PDF",
  report_title: "Informe de fundador · Strata Founders",
  report_profile: "Perfil",
  report_ranking: "Rànquing de jurisdiccions",
  report_sources: "Fonts i verificació",

  scenarios: "Escenaris",
  save_scenario: "Guardar escenari",
  scenario_name_ph: "Nom de l'escenari…",
  no_scenarios: "Sense escenaris guardats.",
  load: "Carregar",
  stale_flag: "Pendent de revisió",
  stale_help: "L'última verificació supera els 12 mesos.",
  data_updated: "Les dades s'han actualitzat des de la teua última visita.",
};

const EN: Dict = {
  founders: "Founders",
  founders_sub: "Where to base your company, legally",
  back_to_globe: "Back to the globe",
  nav_match: "Matcher",
  nav_browse: "Jurisdictions",
  nav_compare: "Compare",
  nav_glossary: "Glossary",
  legal_banner:
    "Educational information, not advice. It depends on your situation and nationality. Legal optimisation, never evasion. Consult a cross-border professional.",
  coverage: "{n}/{t} verified",
  seed_note: "Orientative seed data, pending double verification.",

  your_profile: "Your founder profile",
  business_q: "What kind of business?",
  clients_q: "Where are your clients?",
  nationality_q: "What's your nationality?",
  nationality_ph: "Search country…",
  priorities_q: "What matters most?",
  see_matches: "See recommendations",
  recalc: "Recalculate",
  best_matches: "Best matches for you",
  match_intro: "Ranked by your priorities over public data. Each criterion's contribution is transparent.",
  score: "Fit",
  why: "Why it fits",
  open_profile: "View profile",
  add_compare: "Compare",
  in_compare: "In comparison",
  cfc_warning:
    "CFC warning: your nationality applies controlled-foreign-company rules. Undistributed profits of a low-tax company you control may be attributed and taxed in your country. Requires real substance and reporting.",
  low_tax_note: "Low-tax or territorial jurisdiction: the compliance picture matters more than the headline rate.",
  partial_flag: "Partial",
  partial_help: "Over 40% of the weight lacks data.",

  status_verified: "Verified",
  status_partial: "Under review",
  status_pending: "Pending",
  verify_source: "Verify at source",
  last_verified: "Last verified",
  no_data: "not available",

  pillar_companyTax: "Company tax",
  pillar_setup: "Setup & operation",
  pillar_founderTax: "Founder tax",
  pillar_compliance: "Compliance",
  pillar_residency: "Residency & mobility",
  pillar_living: "Cost & quality of life",
  pillar_stability: "Stability & reputation",

  fld_corporateRate: "Corporate",
  fld_system: "System",
  fld_vatStandard: "VAT",
  fld_capitalGains: "Capital gains",
  fld_dividendWHT: "Dividend WHT",
  fld_specialRegime: "Special regime",
  fld_incorporationDays: "Days to incorporate",
  fld_incorporationCostEUR: "Incorporation cost",
  fld_foreignOwnership100: "100% foreign ownership",
  fld_remoteIncorporation: "Remote incorporation",
  fld_bankingAccess: "Banking access",
  fld_personalIncomeTopRate: "Income tax (top)",
  fld_dividendTax: "Owner dividends",
  fld_residencyTrigger: "Residency trigger",
  fld_newResidentRegime: "New-resident regime",
  fld_cfcNote: "CFC exposure",
  fld_substance: "Substance",
  fld_crsParticipant: "CRS",
  fld_pillarTwo: "Pillar Two",
  fld_costOfLivingIndex: "Cost of living (index)",
  fld_internetMbps: "Internet",
  fld_englishProficiency: "English",
  fld_timezone: "Timezone",
  fld_ruleOfLaw: "Rule of law",
  fld_politicalStability: "Political stability",
  fld_blacklistFlags: "Reputational flags",

  yes: "Yes",
  no: "No",
  glossary_intro: "The key international-tax concepts for founders, explained. Education, not advice.",
  read_more: "Learn more",
  compare_empty: "Add jurisdictions from the matcher or the list to compare them.",
  remove: "Remove",

  briefing: "Briefing",
  generate_briefing: "Generate briefing",
  briefing_title: "Founder briefing",
  briefing_anchored: "Generated only from the public data in the profile; it doesn't invent figures.",
  ai_button: "Enhance with AI (free)",
  ai_loading: "Generating with AI…",
  ai_section: "AI summary",
  ai_unavailable: "AI unavailable (set GEMINI_API_KEY in the deployment). Showing the base briefing, which needs no AI.",
  b_intro: "For a {business} founder with {clients} clients and {nation} nationality, these are your best fits by your priorities, over public data:",
  b_pick: "{rank}. {name} — fit {score}/100. Strong in {strengths}.",
  b_data: "Corporate: {corp}. Income tax (top): {pers}. Setup: {setup}.",
  b_watch_h: "What to check with an adviser (jurisdiction-independent)",
  b_watch_pe: "Permanent establishment and place of effective management: running the company from your country can make it taxable there.",
  b_watch_cfc: "CFC: if you control a low-tax company, your country may attribute its undistributed profits to you.",
  b_watch_substance: "Real economic substance: without it, the structure offers no protection.",
  b_watch_vat: "VAT/OSS: selling to EU customers may require charging their VAT even if the company is abroad.",
  b_watch_residency: "Personal residency: the 183 days and your ties decide where you are taxed.",
  b_close: "This is educational information, not advice. CFC and your taxation depend on your nationality and residency. Consult a cross-border adviser.",

  export: "Export",
  export_md: "Download Markdown",
  print_pdf: "Print / Save PDF",
  report_title: "Founder report · Strata Founders",
  report_profile: "Profile",
  report_ranking: "Jurisdiction ranking",
  report_sources: "Sources & verification",

  scenarios: "Scenarios",
  save_scenario: "Save scenario",
  scenario_name_ph: "Scenario name…",
  no_scenarios: "No saved scenarios.",
  load: "Load",
  stale_flag: "Pending review",
  stale_help: "Last verification is over 12 months old.",
  data_updated: "Data has been updated since your last visit.",
};

const DICTS: Record<Lang, Dict> = { es: ES, ca: CA, en: EN };

const CRITERION: Record<Lang, Record<Criterion, string>> = {
  es: { corpTax: "Impuesto de sociedades", personalTax: "Fiscalidad personal", setup: "Constitución", banking: "Banca y pagos", residency: "Residencia / visado", cost: "Coste de vida", stability: "Estabilidad y reputación", compliance: "Carga administrativa" },
  ca: { corpTax: "Impost de societats", personalTax: "Fiscalitat personal", setup: "Constitució", banking: "Banca i pagaments", residency: "Residència / visat", cost: "Cost de vida", stability: "Estabilitat i reputació", compliance: "Càrrega administrativa" },
  en: { corpTax: "Corporate tax", personalTax: "Personal tax", setup: "Setup", banking: "Banking & payments", residency: "Residency / visa", cost: "Cost of living", stability: "Stability & reputation", compliance: "Admin burden" },
};

const BUSINESS: Record<Lang, Record<BusinessType, string>> = {
  es: { saas: "SaaS / digital", ecommerce: "E-commerce", consulting: "Consultoría / servicios", holding: "Holding / IP", creator: "Creador" },
  ca: { saas: "SaaS / digital", ecommerce: "E-commerce", consulting: "Consultoria / serveis", holding: "Holding / IP", creator: "Creador" },
  en: { saas: "SaaS / digital", ecommerce: "E-commerce", consulting: "Consulting / services", holding: "Holding / IP", creator: "Creator" },
};

const CLIENTS: Record<Lang, Record<ClientBase, string>> = {
  es: { global: "Globales", eu: "Unión Europea", us: "EE. UU.", local: "Locales" },
  ca: { global: "Globals", eu: "Unió Europea", us: "EUA", local: "Locals" },
  en: { global: "Global", eu: "European Union", us: "United States", local: "Local" },
};

const WEIGHT_LABEL: Record<Lang, string[]> = {
  es: ["No importa", "Algo", "Importante", "Clave"],
  ca: ["No importa", "Una mica", "Important", "Clau"],
  en: ["Don't care", "A bit", "Important", "Key"],
};

export interface FoundersI18n {
  lang: Lang;
  ft: (key: string, params?: Record<string, string | number>) => string;
  name: (c: { iso2?: string; name: string }) => string;
  criterion: (c: Criterion) => string;
  business: (b: BusinessType) => string;
  clients: (c: ClientBase) => string;
  weightLabel: (w: number) => string;
  status: (s: VerifyStatus) => string;
}

function fmt(s: string, params?: Record<string, string | number>): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
}

export function useFoundersI18n(): FoundersI18n {
  const base = useI18n();
  const lang = base.lang;
  return {
    lang,
    ft: (key, params) => fmt(DICTS[lang][key] ?? DICTS.es[key] ?? key, params),
    name: base.name,
    criterion: (c) => CRITERION[lang][c],
    business: (b) => BUSINESS[lang][b],
    clients: (c) => CLIENTS[lang][c],
    weightLabel: (w) => WEIGHT_LABEL[lang][Math.max(0, Math.min(3, w))],
    status: (s) => DICTS[lang][`status_${s}`] ?? s,
  };
}
