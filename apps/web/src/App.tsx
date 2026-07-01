// Ensamblaje. Plataforma de datos: barra lateral (control) + globo (herramienta)
// + tarjeta de indicador + ficha de país + buscador universal. Ver brief de diseño.
import { useEffect } from "react";
import GlobeView from "@/components/Globe/Globe";
import IndicatorCard from "@/components/Globe/IndicatorCard";
import CountryPanel from "@/components/CountryPanel/CountryPanel";
import EvolutionModal from "@/components/CountryPanel/EvolutionModal";
import Sidebar from "@/components/chrome/Sidebar";
import MobileBar from "@/components/chrome/MobileBar";
import CountrySearch from "@/components/search/CountrySearch";
import AccessibilityPanel from "@/components/chrome/AccessibilityPanel";
import RankingsPanel from "@/components/rankings/RankingsPanel";
import ComparePanel from "@/components/compare/ComparePanel";
import CuriositiesPanel from "@/components/curiosities/CuriositiesPanel";
import { useCountries } from "@/data/useCountries";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";

export default function App() {
  const { data: ds, isLoading, error, refetch } = useCountries();
  const reduceMotion = useStore((s) => s.reduceMotion);
  const compareOpen = useStore((s) => s.compareOpen);
  const rankingsOpen = useStore((s) => s.rankingsOpen);
  const curiositiesOpen = useStore((s) => s.curiositiesOpen);
  const theme = useStore((s) => s.theme);
  const { t, lang } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Sincroniza el atributo de tema con el store (el HTML lo fija antes de pintar).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      className={`app-bg relative h-screen w-screen overflow-hidden text-ink-100 ${
        reduceMotion ? "reduce-anim" : ""
      }`}
    >
      <Sidebar />
      <MobileBar />

      {/* Globo (herramienta de navegación) */}
      <main className="absolute inset-x-0 bottom-0 top-[120px] md:left-[248px] md:top-0">
        {isLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <span
              className="h-10 w-10 animate-spin rounded-full border-2 border-grid"
              style={{ borderTopColor: "var(--gold)" }}
              aria-hidden
            />
            <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">
              {t("loading")}
            </span>
          </div>
        )}
        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-semibold text-ink-100">{t("error_title")}</p>
            <button
              onClick={() => refetch()}
              className="rounded-btn border border-grid bg-space-700/60 px-4 py-2 text-sm font-medium text-ink-100 hover:border-gold/40"
            >
              {t("retry")}
            </button>
          </div>
        )}
        {ds && <GlobeView />}
      </main>

      {/* Tarjeta de indicador (abajo-izquierda, despejando la barra lateral) */}
      {ds && !compareOpen && !rankingsOpen && !curiositiesOpen && (
        <div className="pointer-events-none absolute bottom-4 left-3 z-20 md:left-[264px]">
          <IndicatorCard />
        </div>
      )}

      <CountryPanel />
      <EvolutionModal />
      <RankingsPanel />
      <ComparePanel />
      <CuriositiesPanel />
      <CountrySearch />
      <AccessibilityPanel />

      <h1 className="sr-only">
        Strata — {t("tagline")}
      </h1>
    </div>
  );
}
