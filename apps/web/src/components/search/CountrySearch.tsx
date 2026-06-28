// Buscador universal (⌘K / "/"): países e indicadores en un mismo sitio, estilo
// Spotlight. Camino accesible para seleccionar sin tocar la esfera.
import { useEffect, useMemo, useRef, useState } from "react";
import { useDataset } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

type Row =
  | { type: "country"; iso3: string; name: string; region?: string; flag?: string }
  | { type: "indicator"; id: string; label: string; category: string };

export default function CountrySearch() {
  const { ds } = useDataset();
  const { t, lang, name, metric, dim } = useI18n();
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const selectCountry = useStore((s) => s.selectCountry);
  const setActiveMetric = useStore((s) => s.setActiveMetric);

  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const rows = useMemo<Row[]>(() => {
    if (!ds) return [];
    const f = fold(q.trim());
    // Busca por nombre localizado y por nombre original (e.g. "Alemania" o "Germany").
    const countries: Row[] = ds.countries
      .map((c) => ({ c, ln: name(c) }))
      .filter(
        ({ c, ln }) => !f || fold(ln).includes(f) || fold(c.name).includes(f) || c.iso3.toLowerCase().includes(f)
      )
      .slice(0, 40)
      .map(({ c, ln }) => ({ type: "country", iso3: c.iso3, name: ln, region: c.region, flag: c.flag }));
    const indicators: Row[] = ds.metricCatalog
      .filter((m) => !f || fold(metric(m)).includes(f) || fold(m.label).includes(f))
      .map((m) => ({ type: "indicator", id: m.id, label: metric(m), category: dim(m.dimension) }));
    return [...indicators, ...countries];
  }, [ds, q, lang]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  // Abrir con ⌘K / Ctrl+K o "/".
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !open && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const choose = (row: Row) => {
    if (row.type === "country") selectCountry(row.iso3);
    else setActiveMetric(row.id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && rows[active]) {
      e.preventDefault();
      choose(rows[active]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-space-900/65 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("search")}
        className="glass w-[520px] max-w-[92vw] overflow-hidden rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-grid/70 px-4 py-3.5">
          <Icon name="search" size={18} className="text-ink-300" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("search_ph")}
            aria-label={t("search")}
            className="w-full bg-transparent text-base text-ink-100 placeholder:text-ink-500 focus:outline-none"
          />
          <kbd className="rounded-md border border-grid bg-space-900/60 px-1.5 py-0.5 text-2xs text-ink-500">Esc</kbd>
        </div>

        <ul ref={listRef} className="max-h-[46vh] overflow-y-auto overscroll-contain p-1.5" role="listbox">
          {rows.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-ink-500">{t("no_matches", { q })}</li>
          )}
          {rows.map((row, i) => {
            const sel = i === active;
            const key = row.type === "country" ? `c-${row.iso3}` : `i-${row.id}`;
            return (
              <li key={key} role="option" aria-selected={sel}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(row)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    sel ? "bg-gold/12" : "hover:bg-ink-100/[0.04]"
                  }`}
                >
                  {row.type === "country" ? (
                    <>
                      {row.flag ? (
                        <img
                          src={row.flag}
                          alt=""
                          loading="lazy"
                          className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover ring-1 ring-ink-100/10"
                        />
                      ) : (
                        <span
                          className="h-4 w-[22px] shrink-0 rounded-[3px] bg-space-700 ring-1 ring-ink-100/10"
                          aria-hidden
                        />
                      )}
                      <span className="num w-9 shrink-0 text-2xs text-ink-500">{row.iso3}</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-ink-100">{row.name}</span>
                      {row.region && (
                        <span className="shrink-0 truncate pl-2 text-2xs text-ink-500">{row.region}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gold/12 text-gold">
                        <Icon name="chart" size={13} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-ink-100">{row.label}</span>
                      <span className="shrink-0 rounded-md bg-ink-100/[0.04] px-2 py-0.5 text-2xs text-ink-500">
                        {row.category}
                      </span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 border-t border-grid/70 px-4 py-2 text-2xs text-ink-500">
          <span>
            <kbd className="rounded bg-space-700 px-1">↑</kbd>
            <kbd className="ml-0.5 rounded bg-space-700 px-1">↓</kbd> {t("move")}
          </span>
          <span>
            <kbd className="rounded bg-space-700 px-1">↵</kbd> {t("open")}
          </span>
          <span className="num ml-auto">{t("results", { n: rows.length })}</span>
        </div>
      </div>
    </div>
  );
}
