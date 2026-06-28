// Rankings: lista de países ordenada por el indicador activo. Dinámico (cambia al
// cambiar el indicador) y claro (puesto, bandera, valor y barra). Click → ficha.
import { useMemo } from "react";
import { useDataset, useActiveColoring } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { formatValue } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import IndicatorSelect from "@/components/chrome/IndicatorSelect";

export default function RankingsPanel() {
  const open = useStore((s) => s.rankingsOpen);
  const setOpen = useStore((s) => s.setRankingsOpen);
  const select = useStore((s) => s.selectCountry);
  const { ds } = useDataset();
  const { def } = useActiveColoring();
  const { t, name } = useI18n();

  const ranked = useMemo(() => {
    if (!ds || !def) return [];
    const lower = def.direction === "lower_is_better";
    const rows = ds.countries
      .map((c) => ({ c, v: c.metrics[def.id]?.value }))
      .filter((x): x is { c: (typeof ds.countries)[number]; v: number } => x.v != null && !Number.isNaN(x.v))
      .sort((a, b) => (lower ? a.v - b.v : b.v - a.v));
    const n = rows.length;
    return rows.map((x, i) => ({
      country: x.c,
      value: x.v,
      rank: i + 1,
      pct: n > 1 ? ((n - 1 - i) / (n - 1)) * 100 : 100,
    }));
  }, [ds, def]);

  if (!open || !ds || !def) return null;

  return (
    <aside
      className="glass panel-in fixed right-0 top-14 z-30 flex h-[calc(100%-3.5rem)] w-[400px] max-w-[94vw] flex-col rounded-l-card md:top-0 md:h-full"
      aria-label="Rankings"
    >
      <header className="border-b border-grid/70 p-4">
        <div className="flex items-center gap-2">
          <Icon name="rankings" size={18} className="text-gold" />
          <h2 className="flex-1 text-lg font-bold tracking-tight text-ink-100">{t("rankings")}</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="rounded-lg p-1 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
        <p className="mb-2 mt-1 text-2xs text-ink-500">{t("ranked_by", { n: ranked.length })}</p>
        <IndicatorSelect />
      </header>

      <ol className="flex-1 overflow-y-auto overscroll-contain p-2">
        {ranked.map(({ country, value, rank, pct }) => (
          <li key={country.iso3}>
            <button
              onClick={() => {
                select(country.iso3);
                setOpen(false);
              }}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-ink-100/[0.04]"
            >
              <span
                className={`num w-7 shrink-0 text-right text-sm font-semibold tabular-nums ${
                  rank <= 3 ? "text-gold" : "text-ink-500"
                }`}
              >
                {rank}
              </span>
              {country.flag ? (
                <img src={country.flag} alt="" loading="lazy" className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover ring-1 ring-ink-100/10" />
              ) : (
                <span className="h-4 w-[22px] shrink-0 rounded-[3px] bg-space-700 ring-1 ring-ink-100/10" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink-100">{name(country)}</span>
                <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-ink-100/[0.05]">
                  <span className="block h-full rounded-full bg-gold/80" style={{ width: `${pct}%` }} />
                </span>
              </span>
              <span className="num shrink-0 text-sm font-medium text-ink-100">{formatValue(value, def)}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
