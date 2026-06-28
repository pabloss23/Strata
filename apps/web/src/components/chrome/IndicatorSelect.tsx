// Selector de indicador (dropdown a medida, agrupado por categoría). Muestra el
// indicador activo con su categoría; al abrir, lista todos agrupados.
import { useEffect, useRef, useState } from "react";
import { useDataset, useActiveColoring } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { DIMENSIONS } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export default function IndicatorSelect({ compact = false }: { compact?: boolean }) {
  const { ds } = useDataset();
  const { def, dimension } = useActiveColoring();
  const { dim, category, metric } = useI18n();
  const activeMetric = useStore((s) => s.activeMetric);
  const setActiveMetric = useStore((s) => s.setActiveMetric);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ds) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-input border border-grid bg-space-700/60 px-3 py-2.5 text-left transition-colors duration-200 ease-smooth hover:border-gold/40"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/12 text-gold">
          <Icon name="chart" size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink-100">{def ? metric(def) : ""}</span>
          {!compact && dimension && (
            <span className="block truncate text-2xs text-ink-500">{category(dimension)}</span>
          )}
        </span>
        <Icon name="chevron" size={15} className={`shrink-0 text-ink-300 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="glass absolute left-0 right-0 top-full z-40 mt-2 max-h-[60vh] origin-top overflow-y-auto rounded-card p-1.5"
        >
          {DIMENSIONS.map((d) => {
            const items = ds.metricCatalog.filter((m) => m.dimension === d);
            if (items.length === 0) return null;
            return (
              <div key={d} className="px-1 pb-1.5 pt-2 first:pt-1">
                <div className="px-2 pb-1 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                  {dim(d)}
                </div>
                {items.map((m) => {
                  const active = m.id === activeMetric;
                  return (
                    <button
                      key={m.id}
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setActiveMetric(m.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                        active ? "bg-gold/12 text-gold" : "text-ink-200 hover:bg-ink-100/[0.04] hover:text-ink-100"
                      }`}
                    >
                      <span className="truncate">{metric(m)}</span>
                      {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
