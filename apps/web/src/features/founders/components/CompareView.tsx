// Comparar 2–4 jurisdicciones: tabla de los datos clave lado a lado. Sin dato = gris.
import type { Field, Jurisdiction } from "../types";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";
import { StatusChip } from "./bits";

export default function CompareView({
  jurs,
  onRemove,
  onOpen,
}: {
  jurs: Jurisdiction[];
  onRemove: (iso3: string) => void;
  onOpen: (j: Jurisdiction) => void;
}) {
  const { ft } = useFoundersI18n();

  if (jurs.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-grid bg-space-800/40 px-6 py-16 text-center">
        <Icon name="compare" size={28} className="mx-auto text-ink-500" />
        <p className="mt-3 text-sm text-ink-300">{ft("compare_empty")}</p>
      </div>
    );
  }

  const rows: { label: string; get: (j: Jurisdiction) => Field | undefined }[] = [
    { label: ft("fld_corporateRate"), get: (j) => j.companyTax.corporateRate },
    { label: ft("fld_system"), get: (j) => j.companyTax.system },
    { label: ft("fld_personalIncomeTopRate"), get: (j) => j.founderTax.personalIncomeTopRate },
    { label: ft("fld_vatStandard"), get: (j) => j.companyTax.vatStandard },
    { label: ft("fld_incorporationDays"), get: (j) => j.setup.incorporationDays },
    { label: ft("fld_bankingAccess"), get: (j) => j.setup.bankingAccess },
    { label: ft("fld_cfcNote"), get: (j) => j.compliance.cfcNote },
    { label: ft("fld_crsParticipant"), get: (j) => j.compliance.crsParticipant },
    { label: ft("fld_costOfLivingIndex"), get: (j) => j.living.costOfLivingIndex },
    { label: ft("fld_ruleOfLaw"), get: (j) => j.stability.ruleOfLaw },
  ];

  const fmtVal = (f?: Field): string => {
    if (!f || f.value === "" || f.value == null) return "—";
    if (typeof f.value === "boolean") return f.value ? ft("yes") : ft("no");
    return `${f.value}${f.unit ? ` ${f.unit}` : ""}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-space-900/0 p-2 text-left" />
            {jurs.map((j) => (
              <th key={j.iso3} className="p-2 align-bottom">
                <div className="rounded-card border border-grid bg-space-800/60 p-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => onOpen(j)} className="text-left text-sm font-bold text-ink-100 hover:text-gold">
                      {j.name}
                    </button>
                    <button onClick={() => onRemove(j.iso3)} aria-label={ft("remove")} className="rounded p-0.5 text-ink-500 hover:text-danger">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="mt-1.5">
                    <StatusChip status={j.status} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 ? "bg-ink-100/[0.02]" : ""}>
              <td className="p-2 align-top text-2xs font-medium uppercase tracking-wide text-ink-500">{row.label}</td>
              {jurs.map((j) => {
                const f = row.get(j);
                const missing = !f || f.value === "" || f.value == null;
                return (
                  <td key={j.iso3} className={`num p-2 align-top ${missing ? "italic text-ink-500" : "text-ink-100"}`}>
                    {fmtVal(f)}
                    {f?.note && <span className="mt-0.5 block text-2xs font-normal not-italic text-ink-500">{f.note}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
