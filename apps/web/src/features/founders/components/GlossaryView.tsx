// Glosario experto (Parte D): conceptos de fiscalidad internacional para fundadores.
import { GLOSSARY } from "../content/glossary";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";

export default function GlossaryView() {
  const { ft, lang } = useFoundersI18n();
  const terms = GLOSSARY[lang] ?? GLOSSARY.es;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-300">{ft("glossary_intro")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <article key={t.id} className="rounded-card border border-grid bg-space-800/60 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-100">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gold/12 text-gold">
                <Icon name="book" size={13} />
              </span>
              {t.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{t.def}</p>
            {t.caveat && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-warning/25 bg-warning/[0.06] px-2.5 py-1.5 text-2xs text-ink-300">
                <Icon name="alert" size={12} className="mt-0.5 shrink-0 text-warning" />
                {t.caveat}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
