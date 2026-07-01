// Comparar 2–4 países: tabla lado a lado por indicador, con el mejor valor de cada
// fila resaltado en oro. Se añaden países pulsándolos en el globo o desde el buscador
// interno. Dinámico, claro y útil. Ver brief de diseño.
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDataset } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { DIMENSIONS, DIMENSION_COLORS } from "@/lib/theme";
import { formatValue } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function AddPicker() {
  const { ds } = useDataset();
  const { t, name } = useI18n();
  const compareList = useStore((s) => s.compareList);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null);

  // El popover se renderiza en un PORTAL con posición fija, calculada desde el botón.
  // Así NO lo recorta el `overflow-auto` del panel (era el bug: tras añadir el primer
  // país el desplegable quedaba oculto y "no funcionaba"). Se cierra al clicar fuera.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = 224;
      const left = Math.min(Math.max(8, r.left + r.width / 2 - width / 2), window.innerWidth - width - 8);
      setPos({ left, bottom: window.innerHeight - r.top + 8 });
    };
    place();
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || popRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    if (!ds) return [];
    const f = fold(q.trim());
    return ds.countries
      .filter((c) => !compareList.includes(c.iso3) && (!f || fold(c.name).includes(f)))
      .slice(0, 8);
  }, [ds, q, compareList]);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`grid h-9 w-9 place-items-center rounded-full border border-dashed transition-colors ${
          open ? "border-gold/60 text-gold" : "border-grid text-ink-300 hover:border-gold/50 hover:text-gold"
        }`}
        aria-label={t("add_country")}
        aria-expanded={open}
      >
        <Icon name="plus" size={16} />
      </button>
      <span className="mt-1 text-2xs text-ink-500">{t("add")}</span>
      {open &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            style={{ position: "fixed", left: pos.left, bottom: pos.bottom, width: 224 }}
            className="glass z-50 overflow-hidden rounded-card shadow-2xl"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_country")}
              className="w-full border-b border-grid/70 bg-transparent px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
            />
            <ul className="max-h-52 overflow-y-auto p-1">
              {results.map((c) => (
                <li key={c.iso3}>
                  <button
                    onClick={() => {
                      toggleCompare(c.iso3);
                      setQ("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-ink-100/[0.05]"
                  >
                    {c.flag && <img src={c.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-ink-100/10" />}
                    <span className="truncate text-sm text-ink-100">{name(c)}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="px-3 py-3 text-center text-2xs text-ink-500">{t("no_results")}</li>}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function ComparePanel() {
  const open = useStore((s) => s.compareOpen);
  const setOpen = useStore((s) => s.setCompareOpen);
  const compareList = useStore((s) => s.compareList);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const { ds, byIso3 } = useDataset();
  const { t, name, dim, metric } = useI18n();

  if (!open || !ds) return null;
  const countries = compareList.map((iso) => byIso3.get(iso)).filter(Boolean) as NonNullable<
    ReturnType<typeof byIso3.get>
  >[];
  const cols = `190px repeat(${Math.max(countries.length, 1)}, minmax(110px, 1fr))${
    countries.length < 4 ? " 84px" : ""
  }`;

  return (
    <section
      className="glass rise-in fixed inset-x-0 bottom-0 z-30 flex max-h-[52vh] flex-col rounded-t-card md:left-[248px]"
      aria-label={t("compare")}
    >
      <header className="flex items-center gap-3 border-b border-grid/70 px-4 py-3">
        <Icon name="compare" size={18} className="text-gold" />
        <h2 className="text-lg font-bold tracking-tight text-ink-100">{t("compare")}</h2>
        <span className="text-2xs text-ink-500">{t("of_4", { n: countries.length })}</span>
        <div className="ml-auto flex items-center gap-2">
          {countries.length > 0 && (
            <button onClick={clearCompare} className="rounded-btn px-2.5 py-1.5 text-xs text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
              {t("clear")}
            </button>
          )}
          <button onClick={() => setOpen(false)} aria-label={t("close")} className="rounded-lg p-1 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
            <Icon name="close" size={17} />
          </button>
        </div>
      </header>

      {countries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <p className="text-sm text-ink-200">{t("compare_empty1")}</p>
          <p className="text-2xs text-ink-500">{t("compare_empty2")}</p>
          <div className="mt-2">
            <AddPicker />
          </div>
        </div>
      ) : (
        <div className="overflow-auto">
          <div className="grid min-w-max" style={{ gridTemplateColumns: cols }}>
            {/* Cabecera: columnas de país */}
            <div className="sticky left-0 z-10 bg-space-800/80 backdrop-blur" />
            {countries.map((c) => (
              <div key={c.iso3} className="flex flex-col items-center gap-1.5 p-3">
                {c.flag && <img src={c.flag} alt="" className="h-6 w-9 rounded-[3px] object-cover ring-1 ring-ink-100/10" />}
                <span className="max-w-full truncate text-sm font-semibold text-ink-100">{name(c)}</span>
                <button
                  onClick={() => toggleCompare(c.iso3)}
                  aria-label={t("remove", { name: name(c) })}
                  className="text-ink-500 hover:text-[#E0556E]"
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            ))}
            {countries.length < 4 && <AddPicker />}

            {/* Filas por dimensión */}
            {DIMENSIONS.map((d) => {
              const defs = ds.metricCatalog.filter((m) => m.dimension === d);
              return (
                <div key={d} style={{ gridColumn: "1 / -1" }} className="contents">
                  <div
                    style={{ gridColumn: "1 / -1", color: DIMENSION_COLORS[d] }}
                    className="border-t border-grid/60 px-4 pb-1 pt-2.5 text-2xs font-semibold uppercase tracking-[0.1em]"
                  >
                    {dim(d)}
                  </div>
                  {defs.map((m) => {
                    const lower = m.direction === "lower_is_better";
                    const vals = countries.map((c) => c.metrics[m.id]?.value ?? null);
                    const present = vals.filter((v): v is number => v != null);
                    const best = present.length
                      ? lower
                        ? Math.min(...present)
                        : Math.max(...present)
                      : null;
                    return (
                      <div key={m.id} className="contents">
                        <div className="sticky left-0 z-10 truncate bg-space-800/85 px-4 py-1.5 text-sm text-ink-300 backdrop-blur">
                          {metric(m)}
                        </div>
                        {vals.map((v, i) => {
                          const isBest = v != null && best != null && v === best && present.length > 1;
                          return (
                            <div
                              key={i}
                              className={`num px-2 py-1.5 text-center text-sm ${
                                v == null ? "text-ink-500" : isBest ? "font-semibold text-gold" : "text-ink-100"
                              }`}
                            >
                              {v != null ? formatValue(v, m) : "—"}
                            </div>
                          );
                        })}
                        {countries.length < 4 && <div />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
