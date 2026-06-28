// Ficha profunda de una jurisdicción: 7 pilares con cada dato + año/fuente +
// "verificar en fuente". Modal. Banner de datos de partida si status = partial.
import { useEffect } from "react";
import type { Jurisdiction } from "../types";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";
import { FieldRow, StatusChip, StaleChip, isStale, sourceUrl } from "./bits";

export default function JurisdictionDetail({
  jur,
  onClose,
  onCompare,
  inCompare,
}: {
  jur: Jurisdiction;
  onClose: () => void;
  onCompare: (iso3: string) => void;
  inCompare: boolean;
}) {
  const { ft } = useFoundersI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ct = jur.companyTax;
  const su = jur.setup;
  const ftx = jur.founderTax;
  const cmp = jur.compliance;
  const lv = jur.living;
  const st = jur.stability;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-space-900/70 p-4 pt-[6vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={jur.name}
        className="glass flex max-h-[88vh] w-[680px] max-w-full flex-col overflow-hidden rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-grid/70 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-bold text-ink-100">{jur.name}</h2>
              <StatusChip status={jur.status} />
              {isStale(jur.lastVerified) && <StaleChip />}
            </div>
            <p className="mt-0.5 text-2xs text-ink-500">
              {ft("last_verified")}: {jur.lastVerified}
            </p>
          </div>
          <button
            onClick={() => onCompare(jur.iso3)}
            className={`rounded-btn border px-3 py-1.5 text-xs font-medium transition-colors ${
              inCompare ? "border-gold/50 bg-gold/12 text-gold" : "border-grid text-ink-300 hover:border-gold/40 hover:text-ink-100"
            }`}
          >
            <Icon name="compare" size={13} className="mr-1 inline" />
            {inCompare ? ft("in_compare") : ft("add_compare")}
          </button>
          <button onClick={onClose} aria-label="×" className="rounded-lg p-1.5 text-ink-300 hover:bg-ink-100/5 hover:text-ink-100">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5">
          {jur.status !== "verified" && (
            <div className="mb-4 flex items-start gap-2 rounded-card border border-warning/30 bg-warning/[0.07] px-3 py-2 text-2xs text-ink-300">
              <Icon name="alert" size={13} className="mt-0.5 shrink-0 text-warning" />
              {ft("seed_note")}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Pillar title={ft("pillar_companyTax")} icon="coins">
              <FieldRow label={ft("fld_corporateRate")} field={ct.corporateRate} jurName={jur.name} />
              <FieldRow label={ft("fld_system")} field={ct.system} jurName={jur.name} />
              <FieldRow label={ft("fld_vatStandard")} field={ct.vatStandard} jurName={jur.name} />
              <FieldRow label={ft("fld_capitalGains")} field={ct.capitalGains} jurName={jur.name} />
              <FieldRow label={ft("fld_dividendWHT")} field={ct.dividendWHT} jurName={jur.name} />
              <FieldRow label={ft("fld_specialRegime")} field={ct.specialRegime} jurName={jur.name} />
            </Pillar>

            <Pillar title={ft("pillar_setup")} icon="building">
              <FieldRow label={ft("fld_incorporationDays")} field={su.incorporationDays} jurName={jur.name} />
              <FieldRow label={ft("fld_incorporationCostEUR")} field={su.incorporationCostEUR} jurName={jur.name} />
              <FieldRow label={ft("fld_foreignOwnership100")} field={su.foreignOwnership100} jurName={jur.name} />
              <FieldRow label={ft("fld_remoteIncorporation")} field={su.remoteIncorporation} jurName={jur.name} />
              <FieldRow label={ft("fld_bankingAccess")} field={su.bankingAccess} jurName={jur.name} />
            </Pillar>

            <Pillar title={ft("pillar_founderTax")} icon="percent">
              <FieldRow label={ft("fld_personalIncomeTopRate")} field={ftx.personalIncomeTopRate} jurName={jur.name} />
              <FieldRow label={ft("fld_dividendTax")} field={ftx.dividendTax} jurName={jur.name} />
              <FieldRow label={ft("fld_residencyTrigger")} field={ftx.residencyTrigger} jurName={jur.name} />
              <FieldRow label={ft("fld_newResidentRegime")} field={ftx.newResidentRegime} jurName={jur.name} />
            </Pillar>

            <Pillar title={ft("pillar_compliance")} icon="gavel">
              <FieldRow label={ft("fld_cfcNote")} field={cmp.cfcNote} jurName={jur.name} />
              <FieldRow label={ft("fld_substance")} field={cmp.substance} jurName={jur.name} />
              <FieldRow label={ft("fld_crsParticipant")} field={cmp.crsParticipant} jurName={jur.name} />
              <FieldRow label={ft("fld_pillarTwo")} field={cmp.pillarTwo} jurName={jur.name} />
            </Pillar>

            <Pillar title={ft("pillar_residency")} icon="passport">
              {jur.residency.length === 0 && <p className="py-2 text-sm italic text-ink-500">{ft("no_data")}</p>}
              {jur.residency.map((r, i) => (
                <div key={i} className="border-b border-grid/50 py-2 last:border-0">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-ink-100">{r.type}</span>
                    {r.incomeThresholdEUR && <span className="num shrink-0 text-2xs text-ink-300">≥ {r.incomeThresholdEUR} €/mes</span>}
                  </div>
                  <p className="mt-0.5 text-2xs text-ink-500">{r.summary}</p>
                  {(r.source || r.year) && (
                    <a href={sourceUrl(r.source, `${jur.name} ${r.type}`)} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-0.5 text-2xs text-gold hover:underline">
                      <Icon name="external" size={10} /> {r.source} {r.year ? `· ${r.year}` : ""}
                    </a>
                  )}
                </div>
              ))}
            </Pillar>

            <Pillar title={ft("pillar_living")} icon="globe">
              <FieldRow label={ft("fld_costOfLivingIndex")} field={lv.costOfLivingIndex} jurName={jur.name} />
              <FieldRow label={ft("fld_internetMbps")} field={lv.internetMbps} jurName={jur.name} />
              <FieldRow label={ft("fld_englishProficiency")} field={lv.englishProficiency} jurName={jur.name} />
              <FieldRow label={ft("fld_timezone")} field={lv.timezone ? { value: lv.timezone } : undefined} jurName={jur.name} />
            </Pillar>

            <Pillar title={ft("pillar_stability")} icon="shield">
              <FieldRow label={ft("fld_ruleOfLaw")} field={st.ruleOfLaw} jurName={jur.name} />
              <FieldRow label={ft("fld_politicalStability")} field={st.politicalStability} jurName={jur.name} />
              <FieldRow label={ft("fld_blacklistFlags")} field={st.blacklistFlags} jurName={jur.name} />
            </Pillar>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pillar({ title, icon, children }: { title: string; icon: Parameters<typeof Icon>[0]["name"]; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-gold/12 text-gold">
          <Icon name={icon} size={13} />
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">{title}</h3>
      </div>
      <div className="rounded-card border border-grid bg-space-800/40 px-3 py-1">{children}</div>
    </section>
  );
}
