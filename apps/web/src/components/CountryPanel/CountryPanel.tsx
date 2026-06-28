// Ficha de país centrada en el INDICADOR activo: valor + ranking mundial, luego
// resumen por capa y todos los indicadores. Una acción: ver la evolución.
import { useEffect, useRef } from "react";
import { useDataset, useActiveColoring } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { dimensionScore } from "@/lib/metrics";
import { DIMENSIONS, DIMENSION_COLORS } from "@/lib/theme";
import { formatValue, formatPopulation } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { ScoreCard } from "./ScoreCard";

export default function CountryPanel() {
  const { ds, byIso3, bounds } = useDataset();
  const { def, rankOf } = useActiveColoring();
  const iso3 = useStore((s) => s.selectedIso3);
  const select = useStore((s) => s.selectCountry);
  const setEvolutionOpen = useStore((s) => s.setEvolutionOpen);
  const { t, name, metric, dim } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (iso3) closeRef.current?.focus();
  }, [iso3]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && iso3) select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [iso3, select]);

  if (!ds || !iso3) return null;
  const country = byIso3.get(iso3);
  if (!country) return null;

  const mv = def ? country.metrics[def.id] : undefined;
  const rank = rankOf(country.iso3);
  const scores = DIMENSIONS.map((d) => ({ dim: d, score: dimensionScore(country, ds, d, bounds) }));

  return (
    <aside
      className="glass panel-in pointer-events-auto absolute right-3 top-[66px] z-20 flex max-h-[calc(100vh-82px)] w-[348px] max-w-[calc(100vw-1.5rem)] flex-col rounded-card md:right-4 md:top-4 md:max-h-[calc(100vh-2rem)]"
      aria-label={name(country)}
    >
      {/* Cabecera */}
      <header className="flex items-start gap-3 border-b border-grid/70 p-4 pb-3.5">
        {country.flag && (
          <img src={country.flag} alt="" className="mt-1 h-7 w-10 shrink-0 rounded-md ring-1 ring-ink-100/10" />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold leading-tight tracking-tight text-ink-100">
            {name(country)}
          </h2>
          <p className="mt-0.5 truncate text-xs text-ink-500">
            {country.capital ?? "—"} · {country.region ?? "—"} ·{" "}
            <span className="num">{formatPopulation(country.population)}</span> {t("pop")}
          </p>
        </div>
        <button
          ref={closeRef}
          onClick={() => select(null)}
          aria-label={t("close")}
          className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-ink-100/5 hover:text-ink-100"
        >
          <Icon name="close" size={17} />
        </button>
      </header>

      <div className="overflow-y-auto overscroll-contain">
        {/* HÉROE: indicador activo + ranking mundial */}
        {def && (
          <div className="border-b border-grid/70 p-4">
            <div className="text-2xs font-semibold uppercase tracking-[0.1em] text-gold">{metric(def)}</div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <span className="num text-[34px] font-bold leading-none text-ink-100">
                {formatValue(mv?.value, def)}
              </span>
              {rank && (
                <span className="shrink-0 text-right">
                  <span className="block text-2xs text-ink-500">{t("world_rank")}</span>
                  <span className="num text-xl font-semibold text-ink-100">
                    #{rank.rank}
                    <span className="text-sm font-normal text-ink-500"> / {rank.total}</span>
                  </span>
                </span>
              )}
            </div>
            {rank ? (
              <>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100/[0.06]">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-700 ease-smooth"
                    style={{ width: `${rank.pct}%`, boxShadow: "0 0 8px rgba(229,184,91,0.5)" }}
                  />
                </div>
                <p className="mt-1.5 text-2xs text-ink-500">
                  {t("better_than", { pct: Math.round(rank.pct) })} · {mv?.source ?? def.source} {mv?.year ?? ""}
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs italic text-ink-500">{t("no_data_indicator")}</p>
            )}
          </div>
        )}

        {/* Resumen por capa */}
        <div className="p-4 pb-1">
          <div className="label mb-2">{t("layer_summary")}</div>
          <div className="grid grid-cols-3 gap-2">
            {scores.map((s) => (
              <ScoreCard key={`${country.iso3}-${s.dim}`} label={dim(s.dim)} color={DIMENSION_COLORS[s.dim]} score={s.score} />
            ))}
          </div>
        </div>

        {/* Todos los indicadores */}
        <div className="space-y-4 p-4 pt-3">
          {DIMENSIONS.map((d) => {
            const defs = ds.metricCatalog.filter((m) => m.dimension === d);
            return (
              <div key={d}>
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: DIMENSION_COLORS[d] }} aria-hidden />
                  <span className="label">{dim(d)}</span>
                </div>
                <dl className="space-y-2">
                  {defs.map((m) => {
                    const v = country.metrics[m.id];
                    const has = v?.value != null;
                    const isActive = m.id === def?.id;
                    return (
                      <div key={m.id} className="flex items-baseline justify-between gap-3 text-sm">
                        <dt className={`truncate ${isActive ? "font-medium text-gold" : "text-ink-300"}`}>{metric(m)}</dt>
                        <dd className="num shrink-0 text-ink-100">
                          {has ? (
                            <>
                              {formatValue(v!.value, m)}
                              {v!.year && <span className="ml-1 text-2xs text-ink-500">’{String(v!.year).slice(2)}</span>}
                            </>
                          ) : (
                            <span className="italic text-ink-500">{t("no_datum")}</span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acción única: evolución */}
      <footer className="border-t border-grid/70 p-3">
        <button
          onClick={() => setEvolutionOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-btn border border-grid bg-space-700/50 px-3 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-gold/40 hover:bg-space-700"
        >
          <Icon name="chart" size={16} className="text-gold" />
          {t("see_evolution")}
          <span className="ml-0.5 text-ink-500">·</span>
          <span className="truncate text-ink-300">{def ? metric(def) : ""}</span>
        </button>
      </footer>
    </aside>
  );
}
