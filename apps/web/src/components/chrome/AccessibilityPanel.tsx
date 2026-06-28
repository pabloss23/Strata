// Panel de ajustes: idioma + accesibilidad. Opciones reales y cableadas.
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useI18n, LANGS } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

function Toggle({ label, desc, on, onClick }: { label: string; desc: string; on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-input px-3 py-3 text-left transition-colors hover:bg-ink-100/[0.04]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink-100">{label}</span>
        <span className="block text-2xs text-ink-500">{desc}</span>
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-gold" : "bg-grid"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export default function AccessibilityPanel() {
  const open = useStore((s) => s.accessOpen);
  const setOpen = useStore((s) => s.setAccessOpen);
  const highContrast = useStore((s) => s.highContrast);
  const toggleHighContrast = useStore((s) => s.toggleHighContrast);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const toggleReduceMotion = useStore((s) => s.toggleReduceMotion);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const setLang = useStore((s) => s.setLang);
  const { t, lang } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-space-900/60 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("settings")}
        className="glass w-[440px] max-w-[92vw] overflow-hidden rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-grid/70 px-4 py-3.5">
          <Icon name="access" size={18} className="text-gold" />
          <h2 className="flex-1 text-base font-semibold text-ink-100">{t("settings")}</h2>
          <button onClick={() => setOpen(false)} aria-label={t("close")} className="rounded-lg p-1 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Tema */}
        <div className="border-b border-grid/70 p-4">
          <div className="mb-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">{t("theme")}</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { v: "light", icon: "sun", label: t("theme_light") },
              { v: "dark", icon: "moon", label: t("theme_dark") },
            ] as const).map((o) => (
              <button
                key={o.v}
                onClick={() => setTheme(o.v)}
                aria-pressed={theme === o.v}
                className={`flex items-center justify-center gap-2 rounded-input border px-2 py-2.5 text-sm font-medium transition-colors ${
                  theme === o.v
                    ? "border-gold/50 bg-gold/12 text-gold"
                    : "border-grid text-ink-300 hover:bg-ink-100/[0.04] hover:text-ink-100"
                }`}
              >
                <Icon name={o.icon} size={16} />
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Idioma */}
        <div className="border-b border-grid/70 p-4">
          <div className="mb-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">{t("language")}</div>
          <div className="grid grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className={`rounded-input border px-2 py-2.5 text-center text-sm font-medium transition-colors ${
                  lang === l.code
                    ? "border-gold/50 bg-gold/12 text-gold"
                    : "border-grid text-ink-300 hover:bg-ink-100/[0.04] hover:text-ink-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accesibilidad */}
        <div className="p-1.5">
          <div className="px-3 pb-1 pt-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-500">
            {t("accessibility")}
          </div>
          <Toggle label={t("hc")} desc={t("hc_desc")} on={highContrast} onClick={toggleHighContrast} />
          <Toggle label={t("rm")} desc={t("rm_desc")} on={reduceMotion} onClick={toggleReduceMotion} />
        </div>

        <p className="border-t border-grid/70 px-4 py-3 text-2xs leading-relaxed text-ink-500">{t("access_note")}</p>
      </div>
    </div>
  );
}
