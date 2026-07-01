// Barra superior compacta para móvil (la barra lateral se oculta en pantallas
// pequeñas). En vertical debe caber TODO y verse ordenado: fila 1 = indicador +
// buscar + ajustes; fila 2 = control segmentado equilibrado (Comparar · Rankings ·
// Curiosidades). Estado activo en oro. Ninguna función queda fuera del pulgar.
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import IndicatorSelect from "./IndicatorSelect";

function IconBtn({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-btn border border-grid bg-space-700/50 text-ink-300 transition-colors hover:text-ink-100"
    >
      <Icon name={icon} size={17} />
    </button>
  );
}

function SegBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold tracking-tight transition-colors ${
        active ? "bg-gold/15 text-gold" : "text-ink-300 hover:text-ink-100"
      }`}
    >
      <Icon name={icon} size={14} className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function MobileBar() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setAccessOpen = useStore((s) => s.setAccessOpen);
  const openCompare = useStore((s) => s.openCompare);
  const openRankings = useStore((s) => s.openRankings);
  const openCuriosities = useStore((s) => s.openCuriosities);
  const compareOpen = useStore((s) => s.compareOpen);
  const rankingsOpen = useStore((s) => s.rankingsOpen);
  const curiositiesOpen = useStore((s) => s.curiositiesOpen);
  const { t } = useI18n();

  return (
    <header className="glass fixed inset-x-0 top-0 z-30 md:hidden">
      {/* Fila 1: marca + indicador activo (control principal) + buscar + ajustes */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
          <Icon name="globe" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <IndicatorSelect compact />
        </div>
        <IconBtn icon="search" label={t("search")} onClick={() => setSearchOpen(true)} />
        <IconBtn icon="access" label={t("settings")} onClick={() => setAccessOpen(true)} />
      </div>
      {/* Fila 2: navegación segmentada, tres botones iguales */}
      <div className="mx-3 mb-2.5 flex items-center gap-1 rounded-xl border border-grid bg-space-700/40 p-1">
        <SegBtn icon="compare" label={t("compare")} active={compareOpen} onClick={openCompare} />
        <SegBtn icon="rankings" label={t("rankings")} active={rankingsOpen} onClick={openRankings} />
        <SegBtn icon="sparkles" label={t("curiosities")} active={curiositiesOpen} onClick={openCuriosities} />
      </div>
    </header>
  );
}
