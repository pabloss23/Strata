// Estado global de UI (ligero). Ver docs/ARCHITECTURE.md
import { create } from "zustand";
import type { IndexWeights } from "@/types/country";
import { INDEX_PRESETS } from "@/lib/metrics";
import type { Lang } from "@/lib/i18n";

export type ViewMode = "explore" | "compare" | "index" | "correlate";
export type Theme = "dark" | "light";

function initTheme(): Theme {
  try {
    const s = localStorage.getItem("strata-theme");
    if (s === "light" || s === "dark") return s;
  } catch {
    /* sin localStorage */
  }
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", theme);
}

function initLang(): Lang {
  try {
    const s = localStorage.getItem("strata-lang");
    if (s === "ca" || s === "es" || s === "en") return s;
  } catch {
    /* sin localStorage */
  }
  const n = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "es";
  if (n.startsWith("ca") || n.startsWith("va")) return "ca";
  if (n.startsWith("en")) return "en";
  return "es";
}

interface AppState {
  mode: ViewMode;
  activeMetric: string; // métrica que colorea el globo
  selectedIso3: string | null; // país en la ficha
  hoveredIso3: string | null; // país bajo el cursor en el globo
  compareList: string[]; // iso3 en comparación (2-4)
  weights: IndexWeights; // pesos del Index Builder
  searchOpen: boolean;
  accessOpen: boolean; // popover de accesibilidad
  rankingsOpen: boolean; // panel de rankings
  compareOpen: boolean; // panel de comparación
  curiositiesOpen: boolean; // panel de curiosidades / avances positivos
  highContrast: boolean; // rampa de mayor contraste
  reduceMotion: boolean; // desactivar animaciones (además del SO)
  theme: Theme; // tema claro/oscuro
  lang: Lang; // idioma de la interfaz y de los nombres de país
  evolutionOpen: boolean; // gráfica de evolución del país seleccionado

  setMode: (m: ViewMode) => void;
  setActiveMetric: (id: string) => void;
  selectCountry: (iso3: string | null) => void;
  setHovered: (iso3: string | null) => void;
  toggleCompare: (iso3: string) => void;
  clearCompare: () => void;
  setWeights: (w: IndexWeights) => void;
  setSearchOpen: (open: boolean) => void;
  setAccessOpen: (open: boolean) => void;
  openRankings: () => void;
  openCompare: () => void;
  openCuriosities: () => void;
  setRankingsOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  setCuriositiesOpen: (open: boolean) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
  setEvolutionOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: "explore",
  activeMetric: "gdp_per_capita",
  selectedIso3: null,
  hoveredIso3: null,
  compareList: [],
  weights: INDEX_PRESETS.balanced,
  searchOpen: false,
  accessOpen: false,
  rankingsOpen: false,
  compareOpen: false,
  curiositiesOpen: false,
  highContrast: false,
  reduceMotion: false,
  theme: initTheme(),
  lang: initLang(),
  evolutionOpen: false,

  setMode: (m) => set({ mode: m }),
  setActiveMetric: (id) => set({ activeMetric: id }),
  selectCountry: (iso3) => set({ selectedIso3: iso3 }),
  setHovered: (iso3) => set({ hoveredIso3: iso3 }),
  toggleCompare: (iso3) =>
    set((s) => {
      const has = s.compareList.includes(iso3);
      if (has) return { compareList: s.compareList.filter((x) => x !== iso3) };
      if (s.compareList.length >= 4) return s; // max 4
      return { compareList: [...s.compareList, iso3] };
    }),
  clearCompare: () => set({ compareList: [] }),
  setWeights: (w) => set({ weights: w }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setAccessOpen: (open) => set({ accessOpen: open }),
  // Vistas mutuamente excluyentes; al abrir una se cierran las otras y la ficha.
  openRankings: () =>
    set((s) => ({ rankingsOpen: !s.rankingsOpen, compareOpen: false, curiositiesOpen: false, selectedIso3: null })),
  openCompare: () =>
    set((s) => ({ compareOpen: !s.compareOpen, rankingsOpen: false, curiositiesOpen: false, selectedIso3: null })),
  openCuriosities: () =>
    set((s) => ({ curiositiesOpen: !s.curiositiesOpen, compareOpen: false, rankingsOpen: false, selectedIso3: null })),
  setRankingsOpen: (open) => set({ rankingsOpen: open }),
  setCompareOpen: (open) => set({ compareOpen: open }),
  setCuriositiesOpen: (open) => set({ curiositiesOpen: open }),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
  setTheme: (theme) => {
    try {
      localStorage.setItem("strata-theme", theme);
    } catch {
      /* sin localStorage */
    }
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("strata-theme", theme);
      } catch {
        /* sin localStorage */
      }
      applyTheme(theme);
      return { theme };
    }),
  setLang: (l) => {
    try {
      localStorage.setItem("strata-lang", l);
    } catch {
      /* sin localStorage */
    }
    set({ lang: l });
  },
  setEvolutionOpen: (open) => set({ evolutionOpen: open }),
}));
