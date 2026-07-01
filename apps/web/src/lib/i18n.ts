// i18n: Valencià (ca) · Castellano (es) · English (en).
// Los nombres de país se localizan con Intl.DisplayNames (nativo) por código ISO2,
// así toda la web —incluidos los países— habla el mismo idioma. Ver brief.
import { useStore } from "@/store/useStore";
import type { Dimension } from "@/types/country";

export type Lang = "ca" | "es" | "en";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "ca", label: "Valencià", short: "VAL" },
  { code: "es", label: "Castellano", short: "CAS" },
  { code: "en", label: "English", short: "ENG" },
];

export function detectLang(): Lang {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("strata-lang") as Lang | null;
    if (saved && ["ca", "es", "en"].includes(saved)) return saved;
  }
  const n = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "es";
  if (n.startsWith("ca") || n.startsWith("va")) return "ca";
  if (n.startsWith("en")) return "en";
  return "es";
}

type Dict = Record<string, string>;

const ES: Dict = {
  tagline: "Explora el mundo",
  indicator: "Indicador",
  search: "Buscar país o indicador",
  search_ph: "Buscar país o indicador…",
  compare: "Comparar",
  rankings: "Rankings",
  curiosities: "Curiosidades",
  curiosities_sub: "Lo bueno del mundo ahora mismo (2026), con su fuente y año.",
  curiosities_note: "Selección editorial curada. Cada dato cita su fuente; no son cifras del pipeline de métricas.",
  curiosities_open: "Verlo en el globo",
  curiosities_source: "Ver fuente",
  settings: "Ajustes",
  accessibility: "Accesibilidad",
  theme: "Tema",
  theme_light: "Claro",
  theme_dark: "Oscuro",
  language: "Idioma",
  data_wb: "Datos World Bank",
  data_note: "Cada cifra, con su año y fuente.",
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  countries_unit: "países y territorios",
  no_data: "sin datos",
  no_data_country: "Sin datos: la fuente no cubre ese país",
  world_rank: "Puesto mundial",
  better_than: "Mejor que el {pct}% de los países",
  no_data_indicator: "Sin dato para este indicador.",
  layer_summary: "Resumen por capa",
  no_datum: "sin dato",
  see_evolution: "Ver evolución",
  ranked_by: "{n} países y territorios ordenados por:",
  of_4: "{n}/4 países",
  clear: "Vaciar",
  add: "Añadir",
  add_country: "Añadir país",
  compare_empty1: "Añade de 2 a 4 países para compararlos.",
  compare_empty2: "Púlsalos en el globo o búscalos abajo.",
  search_country: "Buscar país…",
  no_results: "Sin resultados",
  no_matches: "Sin coincidencias para «{q}»",
  move: "moverse",
  open: "abrir",
  results: "{n} resultados",
  remove: "Quitar {name}",
  close: "Cerrar",
  hc: "Alto contraste",
  hc_desc: "Ensancha la escala de color del mapa para distinguir mejor los valores.",
  rm: "Reducir animaciones",
  rm_desc: "Desactiva los conteos y transiciones, además de la preferencia del sistema.",
  access_note:
    "El mapa usa una escala de oro por luminosidad, legible también con daltonismo. El valor de cada país está siempre en texto.",
  loading: "Cargando el mundo",
  error_title: "No se pudieron cargar los datos",
  retry: "Reintentar",
  pop: "hab.",
  sources: "Fuentes: World Bank · World Bank WGI. Cada cifra muestra su año.",
  explore_hint: "Pulsa para explorar →",
  rank_of: "Puesto #{r} de {t}",
  evolution: "Evolución",
  evo_loading: "Cargando la serie histórica…",
  evo_empty: "El World Bank no publica serie histórica de este indicador para este país.",
  evo_error: "No se pudo cargar la serie. Reintentar.",
  evo_latest: "Último",
  evo_min: "Mínimo",
  evo_max: "Máximo",
  evo_subtitle: "Serie histórica · World Bank",
};

const CA: Dict = {
  tagline: "Explora el món",
  indicator: "Indicador",
  search: "Cerca país o indicador",
  search_ph: "Cerca país o indicador…",
  compare: "Comparar",
  rankings: "Rànquings",
  curiosities: "Curiositats",
  curiosities_sub: "El bo del món ara mateix (2026), amb la seua font i any.",
  curiosities_note: "Selecció editorial curada. Cada dada cita la seua font; no són xifres del pipeline de mètriques.",
  curiosities_open: "Veure-ho al globus",
  curiosities_source: "Veure font",
  settings: "Ajustos",
  accessibility: "Accessibilitat",
  theme: "Tema",
  theme_light: "Clar",
  theme_dark: "Fosc",
  language: "Idioma",
  data_wb: "Dades World Bank",
  data_note: "Cada xifra, amb el seu any i font.",
  low: "Baix",
  medium: "Mitjà",
  high: "Alt",
  countries_unit: "països i territoris",
  no_data: "sense dades",
  no_data_country: "Sense dades: la font no cobreix eixe país",
  world_rank: "Posició mundial",
  better_than: "Millor que el {pct}% dels països",
  no_data_indicator: "Sense dada per a este indicador.",
  layer_summary: "Resum per capa",
  no_datum: "sense dada",
  see_evolution: "Veure evolució",
  ranked_by: "{n} països i territoris ordenats per:",
  of_4: "{n}/4 països",
  clear: "Buidar",
  add: "Afegir",
  add_country: "Afegir país",
  compare_empty1: "Afig de 2 a 4 països per a comparar-los.",
  compare_empty2: "Prem-los al globus o cerca'ls davall.",
  search_country: "Cerca país…",
  no_results: "Sense resultats",
  no_matches: "Cap coincidència per a «{q}»",
  move: "moure's",
  open: "obrir",
  results: "{n} resultats",
  remove: "Llevar {name}",
  close: "Tancar",
  hc: "Alt contrast",
  hc_desc: "Eixampla l'escala de color del mapa per a distingir millor els valors.",
  rm: "Reduir animacions",
  rm_desc: "Desactiva els comptadors i transicions, a més de la preferència del sistema.",
  access_note:
    "El mapa fa servir una escala d'or per luminositat, llegible també amb daltonisme. El valor de cada país sempre apareix en text.",
  loading: "Carregant el món",
  error_title: "No s'han pogut carregar les dades",
  retry: "Reintentar",
  pop: "hab.",
  sources: "Fonts: World Bank · World Bank WGI. Cada xifra mostra el seu any.",
  explore_hint: "Prem per a explorar →",
  rank_of: "Posició #{r} de {t}",
  evolution: "Evolució",
  evo_loading: "Carregant la sèrie històrica…",
  evo_empty: "El World Bank no publica sèrie històrica d'este indicador per a este país.",
  evo_error: "No s'ha pogut carregar la sèrie. Reintentar.",
  evo_latest: "Últim",
  evo_min: "Mínim",
  evo_max: "Màxim",
  evo_subtitle: "Sèrie històrica · World Bank",
};

const EN: Dict = {
  tagline: "Explore the world",
  indicator: "Indicator",
  search: "Search country or indicator",
  search_ph: "Search country or indicator…",
  compare: "Compare",
  rankings: "Rankings",
  curiosities: "Highlights",
  curiosities_sub: "The world's good news right now (2026), with source and year.",
  curiosities_note: "Curated editorial picks. Every fact cites its source; these are not metric-pipeline figures.",
  curiosities_open: "See it on the globe",
  curiosities_source: "View source",
  settings: "Settings",
  accessibility: "Accessibility",
  theme: "Theme",
  theme_light: "Light",
  theme_dark: "Dark",
  language: "Language",
  data_wb: "World Bank data",
  data_note: "Every figure, with its year and source.",
  low: "Low",
  medium: "Mid",
  high: "High",
  countries_unit: "countries & territories",
  no_data: "no data",
  no_data_country: "No data: the source doesn't cover this country",
  world_rank: "World rank",
  better_than: "Better than {pct}% of countries",
  no_data_indicator: "No data for this indicator.",
  layer_summary: "Layer summary",
  no_datum: "no data",
  see_evolution: "See trend",
  ranked_by: "{n} countries & territories ranked by:",
  of_4: "{n}/4 countries",
  clear: "Clear",
  add: "Add",
  add_country: "Add country",
  compare_empty1: "Add 2 to 4 countries to compare them.",
  compare_empty2: "Click them on the globe or search below.",
  search_country: "Search country…",
  no_results: "No results",
  no_matches: "No matches for “{q}”",
  move: "move",
  open: "open",
  results: "{n} results",
  remove: "Remove {name}",
  close: "Close",
  hc: "High contrast",
  hc_desc: "Widens the map's colour scale to tell values apart more easily.",
  rm: "Reduce motion",
  rm_desc: "Turns off counters and transitions, on top of the system preference.",
  access_note:
    "The map uses a gold scale by luminance, readable with colour blindness too. Each country's value is always shown as text.",
  loading: "Loading the world",
  error_title: "Couldn't load the data",
  retry: "Retry",
  pop: "pop.",
  sources: "Sources: World Bank · World Bank WGI. Each figure shows its year.",
  explore_hint: "Click to explore →",
  rank_of: "Rank #{r} of {t}",
  evolution: "Trend",
  evo_loading: "Loading the historical series…",
  evo_empty: "The World Bank publishes no historical series of this indicator for this country.",
  evo_error: "Couldn't load the series. Retry.",
  evo_latest: "Latest",
  evo_min: "Min",
  evo_max: "Max",
  evo_subtitle: "Historical series · World Bank",
};

const STRINGS: Record<Lang, Dict> = { ca: CA, es: ES, en: EN };

// --- Etiquetas de métricas e indicadores por idioma ---
const METRIC_LABELS: Record<Lang, Record<string, string>> = {
  es: {
    gdp_per_capita: "PIB per cápita",
    gdp_growth: "Crecimiento del PIB",
    inflation: "Inflación",
    unemployment: "Desempleo",
    gini: "Desigualdad (Gini)",
    rule_of_law: "Estado de derecho",
    control_of_corruption: "Control de la corrupción",
    voice_accountability: "Voz y rendición de cuentas",
    political_stability: "Estabilidad política",
    government_effectiveness: "Eficacia del gobierno",
    life_expectancy: "Esperanza de vida",
    internet_users: "Uso de internet",
    access_electricity: "Acceso a la electricidad",
    child_mortality: "Mortalidad infantil (<5)",
    secondary_enrollment: "Escolarización secundaria",
  },
  ca: {
    gdp_per_capita: "PIB per càpita",
    gdp_growth: "Creixement del PIB",
    inflation: "Inflació",
    unemployment: "Desocupació",
    gini: "Desigualtat (Gini)",
    rule_of_law: "Estat de dret",
    control_of_corruption: "Control de la corrupció",
    voice_accountability: "Veu i rendició de comptes",
    political_stability: "Estabilitat política",
    government_effectiveness: "Eficàcia del govern",
    life_expectancy: "Esperança de vida",
    internet_users: "Ús d'internet",
    access_electricity: "Accés a l'electricitat",
    child_mortality: "Mortalitat infantil (<5)",
    secondary_enrollment: "Escolarització secundària",
  },
  en: {
    gdp_per_capita: "GDP per capita",
    gdp_growth: "GDP growth",
    inflation: "Inflation",
    unemployment: "Unemployment",
    gini: "Inequality (Gini)",
    rule_of_law: "Rule of law",
    control_of_corruption: "Control of corruption",
    voice_accountability: "Voice & accountability",
    political_stability: "Political stability",
    government_effectiveness: "Government effectiveness",
    life_expectancy: "Life expectancy",
    internet_users: "Internet use",
    access_electricity: "Electricity access",
    child_mortality: "Child mortality (<5)",
    secondary_enrollment: "Secondary enrollment",
  },
};

const DIM_LABELS: Record<Lang, Record<Dimension, string>> = {
  es: { economic: "Económicos", political: "Políticos", social: "Sociales" },
  ca: { economic: "Econòmics", political: "Polítics", social: "Socials" },
  en: { economic: "Economic", political: "Political", social: "Social" },
};

const CATEGORY: Record<Lang, Record<Dimension, string>> = {
  es: { economic: "Indicador económico", political: "Indicador político", social: "Indicador social" },
  ca: { economic: "Indicador econòmic", political: "Indicador polític", social: "Indicador social" },
  en: { economic: "Economic indicator", political: "Political indicator", social: "Social indicator" },
};

// --- Nombres de país localizados (Intl.DisplayNames por ISO2) ---
const dnCache: Partial<Record<Lang, Intl.DisplayNames | null>> = {};
function displayNames(lang: Lang): Intl.DisplayNames | null {
  if (dnCache[lang] === undefined) {
    try {
      dnCache[lang] = new Intl.DisplayNames([lang], { type: "region" });
    } catch {
      dnCache[lang] = null;
    }
  }
  return dnCache[lang] ?? null;
}

export function localizedName(country: { iso2?: string; name: string }, lang: Lang): string {
  const code = country.iso2?.toUpperCase();
  if (code && /^[A-Z]{2}$/.test(code)) {
    try {
      const n = displayNames(lang)?.of(code);
      if (n && n !== code) return n;
    } catch {
      /* código no reconocido → respaldo */
    }
  }
  return country.name;
}

function fmt(s: string, params?: Record<string, string | number>): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
}

export interface I18n {
  lang: Lang;
  t: (key: keyof typeof ES, params?: Record<string, string | number>) => string;
  name: (c: { iso2?: string; name: string }) => string;
  metric: (def: { id: string; label: string }) => string;
  dim: (d: Dimension) => string;
  category: (d: Dimension) => string;
}

export function useI18n(): I18n {
  const lang = useStore((s) => s.lang);
  return {
    lang,
    t: (key, params) => fmt(STRINGS[lang][key as string] ?? STRINGS.es[key as string] ?? String(key), params),
    name: (c) => localizedName(c, lang),
    metric: (def) => METRIC_LABELS[lang][def.id] ?? def.label,
    dim: (d) => DIM_LABELS[lang][d],
    category: (d) => CATEGORY[lang][d],
  };
}
