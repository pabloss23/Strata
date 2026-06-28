// Gráfica de evolución del país+indicador seleccionados. Serie histórica real del
// World Bank pedida al vuelo. Estados honestos: cargando / sin serie / error.
import { useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDataset, useActiveColoring } from "@/data/useDataset";
import { useEvolution, type EvoPoint } from "@/data/useEvolution";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import { formatValue } from "@/lib/format";
import { GOLD, COLORS } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

const compact = (v: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v);

export default function EvolutionModal() {
  const open = useStore((s) => s.evolutionOpen);
  const setOpen = useStore((s) => s.setEvolutionOpen);
  const iso3 = useStore((s) => s.selectedIso3);
  const { byIso3 } = useDataset();
  const { def } = useActiveColoring();
  const { t, name, metric } = useI18n();
  const country = iso3 ? byIso3.get(iso3) : undefined;

  const { data, isLoading, error, refetch } = useEvolution(iso3 ?? undefined, def?.id, open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open || !country || !def) return null;

  const points = data ?? [];
  const latest = points.length ? points[points.length - 1] : null;
  const minP = points.reduce<EvoPoint | null>((a, p) => (!a || p.value < a.value ? p : a), null);
  const maxP = points.reduce<EvoPoint | null>((a, p) => (!a || p.value > a.value ? p : a), null);

  const Stat = ({ label, p }: { label: string; p: EvoPoint | null }) =>
    p ? (
      <div className="flex-1">
        <div className="text-2xs text-ink-500">{label}</div>
        <div className="num text-sm font-semibold text-ink-100">{formatValue(p.value, def)}</div>
        <div className="num text-2xs text-ink-500">{p.year}</div>
      </div>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-900/65 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${t("evolution")} — ${name(country)}`}
        className="glass w-[640px] max-w-full overflow-hidden rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-grid/70 p-4">
          {country.flag && <img src={country.flag} alt="" className="h-6 w-9 rounded-[3px] object-cover ring-1 ring-ink-100/10" />}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold tracking-tight text-ink-100">{name(country)}</h2>
            <p className="truncate text-2xs">
              <span className="font-semibold text-gold">{metric(def)}</span>
              <span className="text-ink-500"> · {t("evo_subtitle")}</span>
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t("close")} className="rounded-lg p-1 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="p-4">
          <div className="h-[280px] w-full">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-500">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-grid" style={{ borderTopColor: GOLD }} />
                <span className="text-2xs uppercase tracking-[0.1em]">{t("evo_loading")}</span>
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-ink-200">{t("evo_error")}</p>
                <button onClick={() => refetch()} className="rounded-btn border border-grid bg-space-700/60 px-3 py-1.5 text-xs text-ink-100 hover:border-gold/40">
                  {t("retry")}
                </button>
              </div>
            ) : points.length < 2 ? (
              <div className="flex h-full items-center justify-center px-8 text-center text-sm text-ink-500">
                {t("evo_empty")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="evoGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.grid} strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.ink500, fontSize: 11 }} tickLine={false} axisLine={{ stroke: COLORS.grid }} minTickGap={28} />
                  <YAxis tick={{ fill: COLORS.ink500, fontSize: 11 }} tickLine={false} axisLine={false} width={46} tickFormatter={compact} />
                  <Tooltip
                    cursor={{ stroke: GOLD, strokeOpacity: 0.4 }}
                    content={({ active, payload, label }: any) =>
                      active && payload?.length ? (
                        <div className="glass rounded-lg px-3 py-2 text-xs">
                          <div className="num text-ink-500">{label}</div>
                          <div className="num font-semibold text-ink-100">{formatValue(payload[0].value, def)}</div>
                        </div>
                      ) : null
                    }
                  />
                  <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2} fill="url(#evoGold)" activeDot={{ r: 4, fill: GOLD, stroke: COLORS.space900 }} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {points.length >= 2 && (
            <div className="mt-3 flex gap-3 border-t border-grid/70 pt-3">
              <Stat label={t("evo_latest")} p={latest} />
              <Stat label={t("evo_min")} p={minP} />
              <Stat label={t("evo_max")} p={maxP} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
