// Panel de briefing del fundador: explicación anclada (determinista) + export MD
// e imprimir/PDF. Reutiliza el motor de briefing y de informe.
import { useEffect, useMemo, useState } from "react";
import type { FounderProfile } from "../types";
import type { MatchResult } from "../engine/match";
import { buildBriefing } from "../engine/briefing";
import { buildMarkdown, buildReportHtml, downloadText, printReport } from "../engine/report";
import { buildAiPayload, fetchAiBriefing } from "../engine/aiBriefing";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";

export default function BriefingPanel({
  profile,
  results,
  nationName,
  onClose,
}: {
  profile: FounderProfile;
  results: MatchResult[];
  nationName: string;
  onClose: () => void;
}) {
  const { ft, criterion, business, clients, status, lang } = useFoundersI18n();
  const [ai, setAi] = useState<{ state: "idle" | "loading" | "done" | "unavailable"; text: string }>({ state: "idle", text: "" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const runAi = async () => {
    setAi({ state: "loading", text: "" });
    const payload = buildAiPayload(lang, business(profile.business), clients(profile.clients), nationName, results);
    const text = await fetchAiBriefing(payload);
    setAi(text ? { state: "done", text } : { state: "unavailable", text: "" });
  };

  const helpers = { ft, criterion, business, clients };
  const blocks = useMemo(() => buildBriefing(profile, results, nationName, helpers), [profile, results, nationName, ft]);

  const input = { profile, results, blocks, nationName, h: { ...helpers, status } };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-space-900/70 p-4 pt-[6vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ft("briefing_title")}
        className="glass flex max-h-[88vh] w-[620px] max-w-full flex-col overflow-hidden rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-grid/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold/15 text-gold">
              <Icon name="sparkles" size={17} />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink-100">{ft("briefing_title")}</h2>
              <p className="text-2xs text-ink-500">{ft("briefing_anchored")}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="×" className="rounded-lg p-1.5 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="space-y-2.5 overflow-y-auto overscroll-contain p-5 text-sm leading-relaxed text-ink-200">
          {/* IA gratuita opcional (Gemini vía serverless); cae al briefing base si no está */}
          <div>
            {ai.state === "idle" && (
              <button
                onClick={runAi}
                className="flex items-center gap-1.5 rounded-btn border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/15"
              >
                <Icon name="sparkles" size={14} /> {ft("ai_button")}
              </button>
            )}
            {ai.state === "loading" && (
              <p className="flex items-center gap-2 text-xs text-ink-300">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-grid" style={{ borderTopColor: "var(--gold)" }} />
                {ft("ai_loading")}
              </p>
            )}
            {ai.state === "unavailable" && (
              <p className="flex items-start gap-1.5 rounded-lg border border-info/30 bg-info/[0.07] px-3 py-2 text-2xs text-ink-300">
                <Icon name="info" size={12} className="mt-0.5 shrink-0 text-info" /> {ft("ai_unavailable")}
              </p>
            )}
            {ai.state === "done" && (
              <div className="rounded-card border border-gold/30 bg-gold/[0.05] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.08em] text-gold">
                  <Icon name="sparkles" size={12} /> {ft("ai_section")}
                </div>
                <p className="whitespace-pre-line text-sm text-ink-200">{ai.text}</p>
              </div>
            )}
          </div>

          {blocks.map((b, i) =>
            "h" in b ? (
              <h3 key={i} className="pt-2 text-xs font-semibold uppercase tracking-[0.08em] text-gold">
                {b.h}
              </h3>
            ) : "ul" in b ? (
              <ul key={i} className="list-disc space-y-1 pl-5 text-ink-300">
                {b.ul.map((it, k) => (
                  <li key={k}>{it}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className={b.p.startsWith("⚠") ? "rounded-lg border border-warning/30 bg-warning/[0.07] px-3 py-2 text-2xs text-ink-300" : ""}>
                {b.p}
              </p>
            )
          )}
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-grid/70 p-3">
          <button
            onClick={() => downloadText("strata-founders.md", buildMarkdown(input))}
            className="flex items-center gap-1.5 rounded-btn border border-grid px-3 py-2 text-xs font-medium text-ink-100 transition-colors hover:border-gold/40"
          >
            <Icon name="book" size={14} /> {ft("export_md")}
          </button>
          <button
            onClick={() => printReport(buildReportHtml(input), ft("report_title"))}
            className="flex items-center gap-1.5 rounded-btn border border-grid px-3 py-2 text-xs font-medium text-ink-100 transition-colors hover:border-gold/40"
          >
            <Icon name="external" size={14} /> {ft("print_pdf")}
          </button>
        </footer>
      </div>
    </div>
  );
}
