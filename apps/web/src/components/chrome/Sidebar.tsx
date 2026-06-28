// Barra lateral premium (escritorio). Marca, selector de indicador, buscador,
// navegación e idioma. El globo es la herramienta; aquí está el control.
import { useStore } from "@/store/useStore";
import { useI18n, LANGS } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { navigate } from "@/features/founders/useFoundersRoute";
import IndicatorSelect from "./IndicatorSelect";

export default function Sidebar() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setAccessOpen = useStore((s) => s.setAccessOpen);
  const openCompare = useStore((s) => s.openCompare);
  const openRankings = useStore((s) => s.openRankings);
  const compareOpen = useStore((s) => s.compareOpen);
  const rankingsOpen = useStore((s) => s.rankingsOpen);
  const setLang = useStore((s) => s.setLang);
  const { t, lang } = useI18n();

  return (
    <aside className="glass fixed left-0 top-0 z-30 hidden h-full w-[248px] flex-col p-4 md:flex">
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-1.5 pb-1">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold/15 text-gold">
          <Icon name="globe" size={18} />
        </span>
        <span>
          <span className="block text-[19px] font-bold leading-none tracking-tight text-ink-100">Strata</span>
          <span className="block text-2xs text-ink-500">{t("tagline")}</span>
        </span>
      </div>

      <div className="my-4 h-px bg-grid/70" />

      {/* Indicador activo */}
      <div className="mb-2 px-1 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">{t("indicator")}</div>
      <IndicatorSelect />

      {/* Buscar (⌘K) */}
      <button
        onClick={() => setSearchOpen(true)}
        className="mt-3 flex items-center gap-2.5 rounded-input border border-grid bg-space-700/40 px-3 py-2.5 text-left text-sm text-ink-300 transition-colors duration-200 ease-smooth hover:border-gold/40 hover:text-ink-100"
      >
        <Icon name="search" size={16} className="text-ink-300" />
        <span className="flex-1">{t("search")}</span>
        <kbd className="rounded-md border border-grid bg-space-900/60 px-1.5 py-0.5 text-2xs text-ink-500">⌘K</kbd>
      </button>

      {/* Navegación */}
      <nav className="mt-6 flex flex-col gap-0.5">
        <button
          onClick={() => navigate("/founders")}
          className="mb-1 flex items-center gap-2.5 rounded-btn border border-gold/30 bg-gold/10 px-3 py-2 text-[15px] font-semibold text-gold transition-all duration-200 ease-smooth hover:bg-gold/15"
        >
          <Icon name="building" size={17} /> {t("founders")}
        </button>
        <button onClick={openCompare} className={`nav-item ${compareOpen ? "nav-item-active" : ""}`}>
          <Icon name="compare" size={17} /> {t("compare")}
        </button>
        <button onClick={openRankings} className={`nav-item ${rankingsOpen ? "nav-item-active" : ""}`}>
          <Icon name="rankings" size={17} /> {t("rankings")}
        </button>
        <button onClick={() => setAccessOpen(true)} className="nav-item">
          <Icon name="access" size={17} /> {t("settings")}
        </button>
      </nav>

      {/* Idioma */}
      <div className="mt-auto px-1.5">
        <div className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">{t("language")}</div>
        <div className="flex gap-1 rounded-input border border-grid p-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
              title={l.label}
              className={`flex-1 rounded-lg py-1.5 text-2xs font-semibold transition-colors ${
                lang === l.code ? "bg-gold/15 text-gold" : "text-ink-500 hover:bg-ink-100/[0.04] hover:text-ink-200"
              }`}
            >
              {l.short}
            </button>
          ))}
        </div>
      </div>

      <div className="px-1.5 pt-3 text-2xs leading-relaxed text-ink-500">
        {t("data_wb")}. {t("data_note")}
      </div>
    </aside>
  );
}
