// Strata Founders — shell a pantalla completa (ruta /founders). Recomendador,
// jurisdicciones, comparar y glosario. Encuadre legal persistente (C9).
import { useEffect, useMemo, useState } from "react";
import { useCountries } from "@/data/useCountries";
import { useStore } from "@/store/useStore";
import { Icon } from "@/components/ui/Icon";
import { navigate } from "./useFoundersRoute";
import { useFoundersI18n } from "./i18n";
import { JURISDICTION_DATA, TOTAL_COUNTRIES } from "./data/jurisdictions";
import { defaultWeights, rankJurisdictions } from "./engine/match";
import type { FounderProfile, Jurisdiction } from "./types";
import MatchView from "./components/MatchView";
import CompareView from "./components/CompareView";
import GlossaryView from "./components/GlossaryView";
import JurisdictionDetail from "./components/JurisdictionDetail";
import BriefingPanel from "./components/BriefingPanel";
import { StatusChip } from "./components/bits";

type View = "match" | "browse" | "compare" | "glossary";

export interface SavedScenario {
  id: string;
  name: string;
  profile: FounderProfile;
}

const SCENARIOS_KEY = "strata-founders-scenarios";
const VERSION_KEY = "strata-founders-version";

function loadScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY);
    if (raw) return JSON.parse(raw) as SavedScenario[];
  } catch {
    /* sin localStorage */
  }
  return [];
}

export default function FoundersApp() {
  const ftI18n = useFoundersI18n();
  const { ft } = ftI18n;
  const { data: ds } = useCountries();
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const jurs = JURISDICTION_DATA.jurisdictions;
  const [view, setView] = useState<View>("match");
  const [profile, setProfile] = useState<FounderProfile>({
    business: "saas",
    clients: "global",
    nationality: "ESP",
    weights: defaultWeights(),
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [detail, setDetail] = useState<Jurisdiction | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadScenarios());
  const [dataUpdated, setDataUpdated] = useState(false);

  const byIso = useMemo(() => new Map(jurs.map((j) => [j.iso3, j])), [jurs]);
  const verifiedCount = jurs.filter((j) => j.status === "verified").length;
  const results = useMemo(() => rankJurisdictions(profile, jurs), [profile, jurs]);
  const nationName = useMemo(() => {
    const c = ds?.countries.find((x) => x.iso3 === profile.nationality);
    return c ? ftI18n.name(c) : profile.nationality;
  }, [ds, profile.nationality, ftI18n]);

  // Alerta de cambios: si la versión del dataset cambió desde la última visita.
  useEffect(() => {
    try {
      const seen = localStorage.getItem(VERSION_KEY);
      if (seen && seen !== JURISDICTION_DATA.schemaVersion) setDataUpdated(true);
      localStorage.setItem(VERSION_KEY, JURISDICTION_DATA.schemaVersion);
    } catch {
      /* sin localStorage */
    }
  }, []);

  const persistScenarios = (next: SavedScenario[]) => {
    setScenarios(next);
    try {
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(next));
    } catch {
      /* sin localStorage */
    }
  };
  const saveScenario = () => {
    const name = window.prompt(ftI18n.ft("scenario_name_ph"))?.trim();
    if (!name) return;
    persistScenarios([...scenarios, { id: `${Date.now()}`, name, profile }]);
  };

  const toggleCompare = (iso3: string) =>
    setCompareList((list) => (list.includes(iso3) ? list.filter((x) => x !== iso3) : list.length >= 4 ? list : [...list, iso3]));

  const NAV: { v: View; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { v: "match", label: ft("nav_match"), icon: "target" },
    { v: "browse", label: ft("nav_browse"), icon: "globe" },
    { v: "compare", label: `${ft("nav_compare")}${compareList.length ? ` (${compareList.length})` : ""}`, icon: "compare" },
    { v: "glossary", label: ft("nav_glossary"), icon: "book" },
  ];

  return (
    <div className="app-bg flex h-screen w-screen flex-col overflow-hidden text-ink-100">
      {/* Barra superior */}
      <header className="glass z-30 flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded-btn border border-grid px-2.5 py-1.5 text-xs font-medium text-ink-300 transition-colors hover:border-gold/40 hover:text-ink-100"
        >
          <Icon name="back" size={15} /> <span className="hidden sm:inline">{ft("back_to_globe")}</span>
        </button>
        <div className="ml-1 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold/15 text-gold">
            <Icon name="building" size={17} />
          </span>
          <div className="leading-none">
            <div className="text-[15px] font-bold tracking-tight text-ink-100">
              Strata <span className="text-gold">Founders</span>
            </div>
            <div className="hidden text-2xs text-ink-500 sm:block">{ft("founders_sub")}</div>
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-0.5">
          {NAV.map((n) => (
            <button
              key={n.v}
              onClick={() => setView(n.v)}
              className={`flex items-center gap-1.5 rounded-btn px-2.5 py-1.5 text-xs font-medium transition-colors ${
                view === n.v ? "bg-gold/12 text-gold" : "text-ink-300 hover:bg-ink-100/[0.05] hover:text-ink-100"
              }`}
            >
              <Icon name={n.icon} size={15} />
              <span className="hidden md:inline">{n.label}</span>
            </button>
          ))}
          <button
            onClick={toggleTheme}
            aria-label="theme"
            className="ml-1 grid h-8 w-8 place-items-center rounded-btn border border-grid text-ink-300 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
          </button>
        </nav>
      </header>

      {/* Banner legal persistente */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-grid/70 bg-warning/[0.05] px-4 py-2 text-2xs text-ink-300">
        <Icon name="info" size={13} className="shrink-0 text-warning" />
        <span className="flex-1">{ft("legal_banner")}</span>
        <span className="num shrink-0 rounded-full border border-grid px-2 py-0.5 text-ink-500">
          {ft("coverage", { n: verifiedCount, t: TOTAL_COUNTRIES })}
        </span>
      </div>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-6xl flex-1 overflow-y-auto p-4 sm:p-6">
        {dataUpdated && (
          <div className="mb-4 flex items-center gap-2 rounded-card border border-info/30 bg-info/[0.08] px-3 py-2 text-2xs text-ink-300">
            <Icon name="refresh" size={13} className="shrink-0 text-info" />
            {ft("data_updated")}
            <button onClick={() => setDataUpdated(false)} className="ml-auto text-ink-500 hover:text-ink-100">
              <Icon name="close" size={13} />
            </button>
          </div>
        )}
        {view === "match" && (
          <MatchView
            profile={profile}
            setProfile={setProfile}
            results={results}
            countries={ds?.countries ?? []}
            compareList={compareList}
            onToggleCompare={toggleCompare}
            onOpen={setDetail}
            onBriefing={() => setBriefingOpen(true)}
            scenarios={scenarios}
            onSaveScenario={saveScenario}
            onLoadScenario={(s) => setProfile(s.profile)}
            onDeleteScenario={(id) => persistScenarios(scenarios.filter((x) => x.id !== id))}
          />
        )}
        {view === "browse" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {jurs.map((j) => (
              <article key={j.iso3} className="rounded-card border border-grid bg-space-800/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <button onClick={() => setDetail(j)} className="text-left text-base font-semibold text-ink-100 hover:text-gold">
                    {j.name}
                  </button>
                  <StatusChip status={j.status} />
                </div>
                <dl className="mt-2 space-y-1 text-2xs text-ink-500">
                  <div className="flex justify-between">
                    <dt>{ft("fld_corporateRate")}</dt>
                    <dd className="num text-ink-300">{String(j.companyTax.corporateRate.value)} {j.companyTax.corporateRate.unit}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>{ft("fld_personalIncomeTopRate")}</dt>
                    <dd className="num text-ink-300">{String(j.founderTax.personalIncomeTopRate.value)} {j.founderTax.personalIncomeTopRate.unit}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setDetail(j)} className="rounded-btn border border-grid px-2.5 py-1 text-xs text-ink-100 hover:border-gold/40">
                    {ft("open_profile")}
                  </button>
                  <button
                    onClick={() => toggleCompare(j.iso3)}
                    className={`rounded-btn border px-2.5 py-1 text-xs transition-colors ${
                      compareList.includes(j.iso3) ? "border-gold/50 bg-gold/12 text-gold" : "border-grid text-ink-300 hover:border-gold/40"
                    }`}
                  >
                    {compareList.includes(j.iso3) ? ft("in_compare") : ft("add_compare")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {view === "compare" && (
          <CompareView
            jurs={compareList.map((iso) => byIso.get(iso)).filter((j): j is Jurisdiction => !!j)}
            onRemove={toggleCompare}
            onOpen={setDetail}
          />
        )}
        {view === "glossary" && <GlossaryView />}
      </main>

      {detail && (
        <JurisdictionDetail
          jur={detail}
          onClose={() => setDetail(null)}
          onCompare={toggleCompare}
          inCompare={compareList.includes(detail.iso3)}
        />
      )}

      {briefingOpen && (
        <BriefingPanel profile={profile} results={results} nationName={nationName} onClose={() => setBriefingOpen(false)} />
      )}
    </div>
  );
}
