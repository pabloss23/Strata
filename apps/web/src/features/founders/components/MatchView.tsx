// Recomendador (MVP): perfil del fundador → ranking de jurisdicciones con la
// aportación de cada criterio y avisos de cumplimiento (CFC). No es una tabla.
import { useMemo } from "react";
import type { Country } from "@/types/country";
import type { BusinessType, ClientBase, Criterion, FounderProfile } from "../types";
import { CRITERIA } from "../types";
import type { MatchResult } from "../engine/match";
import type { SavedScenario } from "../FoundersApp";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";
import { StatusChip } from "./bits";

const BUSINESSES: BusinessType[] = ["saas", "ecommerce", "consulting", "holding", "creator"];
const CLIENTS: ClientBase[] = ["global", "eu", "us", "local"];

export default function MatchView({
  profile,
  setProfile,
  results,
  countries,
  compareList,
  onToggleCompare,
  onOpen,
  onBriefing,
  scenarios,
  onSaveScenario,
  onLoadScenario,
  onDeleteScenario,
}: {
  profile: FounderProfile;
  setProfile: (p: FounderProfile) => void;
  results: MatchResult[];
  countries: Country[];
  compareList: string[];
  onToggleCompare: (iso3: string) => void;
  onOpen: (j: import("../types").Jurisdiction) => void;
  onBriefing: () => void;
  scenarios: SavedScenario[];
  onSaveScenario: () => void;
  onLoadScenario: (s: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
}) {
  const { ft, criterion, business, clients, weightLabel, name } = useFoundersI18n();

  const nationOptions = useMemo(
    () => countries.map((c) => ({ iso3: c.iso3, label: name(c) })).sort((a, b) => a.label.localeCompare(b.label)),
    [countries, name]
  );

  const setWeight = (c: Criterion, w: number) => setProfile({ ...profile, weights: { ...profile.weights, [c]: w } });

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Perfil */}
      <aside className="space-y-5 lg:sticky lg:top-2 lg:self-start">
        <h2 className="text-sm font-semibold text-ink-100">{ft("your_profile")}</h2>

        <Field label={ft("business_q")}>
          <div className="flex flex-wrap gap-1.5">
            {BUSINESSES.map((b) => (
              <Chip key={b} on={profile.business === b} onClick={() => setProfile({ ...profile, business: b })}>
                {business(b)}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label={ft("clients_q")}>
          <div className="flex flex-wrap gap-1.5">
            {CLIENTS.map((c) => (
              <Chip key={c} on={profile.clients === c} onClick={() => setProfile({ ...profile, clients: c })}>
                {clients(c)}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label={ft("nationality_q")}>
          <select
            value={profile.nationality}
            onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
            className="w-full rounded-input border border-grid bg-space-800 px-3 py-2 text-sm text-ink-100 focus:border-gold/50 focus:outline-none"
          >
            {nationOptions.map((o) => (
              <option key={o.iso3} value={o.iso3}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={ft("priorities_q")}>
          <div className="space-y-2.5">
            {CRITERIA.map((c) => (
              <div key={c}>
                <div className="mb-0.5 flex items-baseline justify-between">
                  <span className="text-xs text-ink-300">{criterion(c)}</span>
                  <span className="text-2xs font-medium text-gold">{weightLabel(profile.weights[c] ?? 0)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={profile.weights[c] ?? 0}
                  onChange={(e) => setWeight(c, Number(e.target.value))}
                  aria-label={criterion(c)}
                  className="w-full accent-gold"
                />
              </div>
            ))}
          </div>
        </Field>

        {/* Escenarios guardados */}
        <Field label={ft("scenarios")}>
          <button
            onClick={onSaveScenario}
            className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-btn border border-grid px-3 py-2 text-xs font-medium text-ink-100 transition-colors hover:border-gold/40"
          >
            <Icon name="plus" size={13} /> {ft("save_scenario")}
          </button>
          {scenarios.length === 0 ? (
            <p className="text-2xs text-ink-500">{ft("no_scenarios")}</p>
          ) : (
            <ul className="space-y-1">
              {scenarios.map((s) => (
                <li key={s.id} className="flex items-center gap-2 rounded-lg border border-grid bg-space-800/40 px-2.5 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-xs text-ink-200">{s.name}</span>
                  <button onClick={() => onLoadScenario(s)} className="text-2xs text-gold hover:underline">
                    {ft("load")}
                  </button>
                  <button onClick={() => onDeleteScenario(s.id)} aria-label={ft("remove")} className="text-ink-500 hover:text-danger">
                    <Icon name="close" size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>
      </aside>

      {/* Resultados */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink-100">{ft("best_matches")}</h2>
            <p className="text-2xs text-ink-500">{ft("match_intro")}</p>
          </div>
          <button
            onClick={onBriefing}
            className="flex shrink-0 items-center gap-1.5 rounded-btn border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/15"
          >
            <Icon name="sparkles" size={14} /> {ft("generate_briefing")}
          </button>
        </div>
        {results.map((r, i) => (
          <ResultCard
            key={r.jurisdiction.iso3}
            rank={i + 1}
            r={r}
            inCompare={compareList.includes(r.jurisdiction.iso3)}
            onToggleCompare={() => onToggleCompare(r.jurisdiction.iso3)}
            onOpen={() => onOpen(r.jurisdiction)}
          />
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.08em] text-ink-500">{label}</div>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        on ? "border-gold/50 bg-gold/12 text-gold" : "border-grid text-ink-300 hover:border-gold/40 hover:text-ink-100"
      }`}
    >
      {children}
    </button>
  );
}

function ResultCard({
  rank,
  r,
  inCompare,
  onToggleCompare,
  onOpen,
}: {
  rank: number;
  r: MatchResult;
  inCompare: boolean;
  onToggleCompare: () => void;
  onOpen: () => void;
}) {
  const { ft, criterion } = useFoundersI18n();
  const top = r.contributions.slice(0, 3);

  return (
    <article className="rise-in rounded-card border border-grid bg-space-800/60 p-4">
      <div className="flex items-start gap-3">
        <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/12 text-sm font-bold text-gold">{rank}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink-100">{r.jurisdiction.name}</h3>
            <StatusChip status={r.jurisdiction.status} />
            {r.partial && <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-2xs text-warning" title={ft("partial_help")}>{ft("partial_flag")}</span>}
          </div>
          {/* Aportación por criterio */}
          <div className="mt-2 space-y-1">
            {top.map((c) => (
              <div key={c.criterion} className="flex items-center gap-2">
                <span className="w-32 shrink-0 truncate text-2xs text-ink-500">{criterion(c.criterion)}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100/[0.06]">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${c.percentile}%` }} />
                </span>
                <span className="num w-8 shrink-0 text-right text-2xs text-ink-300">{Math.round(c.percentile)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="num text-2xl font-bold text-ink-100">{Math.round(r.score)}</div>
          <div className="text-2xs text-ink-500">{ft("score")}</div>
        </div>
      </div>

      {r.cfcWarning && (
        <div className="mt-3 flex items-start gap-2 rounded-card border border-warning/30 bg-warning/[0.07] px-3 py-2 text-2xs text-ink-300">
          <Icon name="alert" size={13} className="mt-0.5 shrink-0 text-warning" />
          {ft("cfc_warning")}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={onOpen} className="rounded-btn border border-grid px-3 py-1.5 text-xs font-medium text-ink-100 transition-colors hover:border-gold/40">
          {ft("open_profile")}
        </button>
        <button
          onClick={onToggleCompare}
          className={`rounded-btn border px-3 py-1.5 text-xs font-medium transition-colors ${
            inCompare ? "border-gold/50 bg-gold/12 text-gold" : "border-grid text-ink-300 hover:border-gold/40 hover:text-ink-100"
          }`}
        >
          {inCompare ? ft("in_compare") : ft("add_compare")}
        </button>
      </div>
    </article>
  );
}
