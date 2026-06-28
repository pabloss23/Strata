// Barra superior compacta para móvil (la barra lateral se oculta en pantallas
// pequeñas). Marca, selector de indicador y accesos rápidos.
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { navigate } from "@/features/founders/useFoundersRoute";
import IndicatorSelect from "./IndicatorSelect";

export default function MobileBar() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setAccessOpen = useStore((s) => s.setAccessOpen);
  const { t } = useI18n();

  return (
    <header className="glass fixed inset-x-0 top-0 z-30 flex items-center gap-2 px-3 py-2.5 md:hidden">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
        <Icon name="globe" size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <IndicatorSelect compact />
      </div>
      <button
        onClick={() => navigate("/founders")}
        aria-label={t("founders")}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-btn border border-gold/30 bg-gold/10 text-gold transition-colors hover:bg-gold/15"
      >
        <Icon name="building" size={17} />
      </button>
      <button
        onClick={() => setSearchOpen(true)}
        aria-label={t("search")}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-btn border border-grid bg-space-700/50 text-ink-300 transition-colors hover:text-ink-100"
      >
        <Icon name="search" size={17} />
      </button>
      <button
        onClick={() => setAccessOpen(true)}
        aria-label={t("settings")}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-btn border border-grid bg-space-700/50 text-ink-300 transition-colors hover:text-ink-100"
      >
        <Icon name="access" size={17} />
      </button>
    </header>
  );
}
