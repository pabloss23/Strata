// Curiosidades: avances y hechos POSITIVOS de países influyentes, curados a mano y
// con su fuente y año (ver content/curiosities.ts). Al pulsar una tarjeta se
// selecciona el país en el globo (vuela hacia él y abre su ficha). Optimista, pero
// honesto: cada dato dice de dónde sale. Mismo lenguaje visual que Rankings.
import { useDataset } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { CURIOSITIES, TAG_META } from "@/content/curiosities";

export default function CuriositiesPanel() {
  const open = useStore((s) => s.curiositiesOpen);
  const setOpen = useStore((s) => s.setCuriositiesOpen);
  const select = useStore((s) => s.selectCountry);
  const { byIso3 } = useDataset();
  const { t, name, lang } = useI18n();

  if (!open) return null;

  return (
    <aside
      className="glass panel-in fixed right-0 top-[120px] z-30 flex h-[calc(100%-120px)] w-[420px] max-w-[94vw] flex-col rounded-l-card md:top-0 md:h-full"
      aria-label={t("curiosities")}
    >
      <header className="border-b border-grid/70 p-4">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={18} className="text-gold" />
          <h2 className="flex-1 text-lg font-bold tracking-tight text-ink-100">{t("curiosities")}</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="rounded-lg p-1 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
        <p className="mt-1 text-2xs text-ink-500">{t("curiosities_sub")}</p>
      </header>

      <ul className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-3">
        {CURIOSITIES.map((c, i) => {
          const country = byIso3.get(c.iso3);
          const meta = TAG_META[c.tag];
          const cname = country ? name(country) : c.iso3;
          return (
            <li key={i}>
              <div className="group overflow-hidden rounded-card border border-grid/60 bg-space-700/30 transition-colors hover:border-gold/40 hover:bg-space-700/50">
                {/* Zona superior: pulsar selecciona el país en el globo */}
                <button
                  onClick={() => {
                    select(c.iso3);
                    setOpen(false);
                  }}
                  title={t("curiosities_open")}
                  className="block w-full p-3 pb-2.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-semibold"
                      style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.label[lang]}
                    </span>
                    <span className="ml-auto flex items-center gap-1.5 text-2xs text-ink-300">
                      {country?.flag && (
                        <img src={country.flag} alt="" loading="lazy" className="h-3 w-[18px] rounded-[2px] object-cover ring-1 ring-ink-100/10" />
                      )}
                      <span className="truncate">{cname}</span>
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-ink-100">{c.title[lang]}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-300">{c.text[lang]}</p>
                </button>
                {/* Pie: fuente + enlace a la fuente original (nueva pestaña) */}
                <div className="flex items-center gap-1.5 border-t border-grid/50 px-3 py-2 text-2xs text-ink-500">
                  <span className="num">{c.source}</span>
                  <span aria-hidden>·</span>
                  <span className="num">{c.year}</span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("curiosities_source")}: ${c.source}`}
                    className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-gold/80 transition-colors hover:bg-gold/10 hover:text-gold"
                  >
                    {t("curiosities_source")}
                    <Icon name="external" size={12} />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
        <li className="px-1 pb-1 pt-2 text-2xs leading-relaxed text-ink-500">{t("curiosities_note")}</li>
      </ul>
    </aside>
  );
}
