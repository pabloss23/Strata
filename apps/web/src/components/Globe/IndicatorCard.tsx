// Tarjeta de indicador (abajo-izquierda), estilo terminal de datos: nombre del
// indicador, leyenda de color (bajo→alto) y metadatos. La gente entiende el mapa
// de un vistazo. Ver brief de diseño.
import { useActiveColoring, useDataset } from "@/data/useDataset";
import { legendGradient } from "@/lib/colorScale";
import { COLORS } from "@/lib/theme";
import { formatLegend } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { Icon } from "@/components/ui/Icon";

export default function IndicatorCard() {
  const { def, dimension, scale, total } = useActiveColoring();
  const { ds, bounds } = useDataset();
  const { t, metric, category } = useI18n();
  const theme = useStore((s) => s.theme);
  // Debe coincidir con el color "sin datos" del mapa (claro usa un gris claro).
  const nodataSwatch = theme === "light" ? "#8FA1B8" : COLORS.nodata;
  if (!def || !ds) return null;

  const [lo, hi] = bounds[def.id] ?? [0, 1];
  const lower = def.direction === "lower_is_better";
  const minVal = lower ? hi : lo; // extremo "bajo" de la escala (peor)
  const maxVal = lower ? lo : hi; // extremo "alto" (mejor)

  return (
    <section
      aria-label="Indicador activo y leyenda"
      className="glass rise-in pointer-events-auto w-[330px] rounded-card p-4"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold">
          <Icon name="chart" size={16} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-ink-100">{metric(def)}</h2>
          <p className="text-2xs text-ink-500">{dimension ? category(dimension) : ""}</p>
        </div>
      </div>

      {/* Leyenda de color */}
      <div
        key={def.id}
        className="mt-3.5 h-2.5 w-full rounded-full ring-1 ring-inset ring-ink-100/10"
        style={{ backgroundImage: legendGradient(scale) }}
      />
      <div className="mt-1.5 flex justify-between text-2xs font-medium uppercase tracking-[0.08em] text-ink-500">
        <span>{t("low")}</span>
        <span>{t("medium")}</span>
        <span className="text-gold">{t("high")}</span>
      </div>
      <div className="mt-1 flex justify-between num text-2xs text-ink-300">
        <span>{formatLegend(minVal, def)}</span>
        <span className="text-gold">{formatLegend(maxVal, def)}</span>
      </div>

      {/* Metadatos + acciones */}
      <div className="mt-3.5 flex items-center justify-between border-t border-grid/70 pt-3">
        <p className="text-2xs text-ink-500">
          <span className="num text-ink-300">{total}</span> {t("countries_unit")} · World Bank
        </p>
        <span className="flex items-center gap-1 text-2xs text-ink-500" title={t("no_data_country")}>
          <span
            className="h-3 w-3.5 rounded-[3px] border border-grid"
            style={{ background: nodataSwatch }}
            aria-hidden
          />
          {t("no_data")}
        </span>
      </div>
    </section>
  );
}
