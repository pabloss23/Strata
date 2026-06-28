// Piezas compartidas de Founders: chip de fuente/año, "verificar en fuente",
// chip de estado de verificación y fila de dato de un pilar.
import type { Field, VerifyStatus } from "../types";
import { useFoundersI18n } from "../i18n";
import { Icon } from "@/components/ui/Icon";

const SOURCE_URL: Record<string, string> = {
  PwC: "https://taxsummaries.pwc.com/",
  "Tax Foundation": "https://taxfoundation.org/",
  "OECD CRS": "https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/",
  "OECD GloBE": "https://www.oecd.org/tax/beps/",
  "OECD/ATAD": "https://taxation-customs.ec.europa.eu/anti-tax-avoidance-directive_en",
  OECD: "https://www.oecd.org/tax/",
  IRS: "https://www.irs.gov/",
  "e-Residency": "https://www.e-resident.gov.ee/",
  "e-resident.gov.ee": "https://www.e-resident.gov.ee/",
  "World Bank WGI": "https://www.worldbank.org/en/publication/worldwide-governance-indicators",
  Numbeo: "https://www.numbeo.com/cost-of-living/",
  Speedtest: "https://www.speedtest.net/global-index",
  FATF: "https://www.fatf-gafi.org/",
};

export function sourceUrl(source?: string, query?: string): string {
  if (source && SOURCE_URL[source]) return SOURCE_URL[source];
  const q = encodeURIComponent([source, query].filter(Boolean).join(" ") || "official source");
  return `https://www.google.com/search?q=${q}`;
}

/** ¿La verificación supera los 12 meses? (caducidad, C9-BIS #5). */
export function isStale(lastVerified: string): boolean {
  const m = /^(\d{4})-(\d{2})/.exec(lastVerified);
  if (!m) return false;
  const then = new Date(Number(m[1]), Number(m[2]) - 1, 1).getTime();
  return Date.now() - then > 365 * 24 * 3600 * 1000;
}

export function StaleChip() {
  const { ft } = useFoundersI18n();
  return (
    <span title={ft("stale_help")} className="inline-flex items-center gap-1 rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 text-2xs font-medium text-danger">
      <Icon name="alert" size={11} /> {ft("stale_flag")}
    </span>
  );
}

export function StatusChip({ status }: { status: VerifyStatus }) {
  const { status: label } = useFoundersI18n();
  const cls =
    status === "verified"
      ? "border-success/40 bg-success/10 text-success"
      : status === "partial"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-grid bg-space-700/60 text-ink-500";
  const icon = status === "verified" ? "check" : status === "partial" ? "alert" : "lock";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium ${cls}`}>
      <Icon name={icon} size={11} /> {label(status)}
    </span>
  );
}

/** Fila de dato de un pilar: etiqueta + valor + chip de año/fuente + caveat. */
export function FieldRow({ label, field, jurName }: { label: string; field?: Field; jurName: string }) {
  const { ft } = useFoundersI18n();
  if (!field || field.value === "" || field.value == null) {
    return (
      <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
        <span className="text-ink-300">{label}</span>
        <span className="italic text-ink-500">{ft("no_data")}</span>
      </div>
    );
  }
  const v = typeof field.value === "boolean" ? (field.value ? ft("yes") : ft("no")) : String(field.value);
  const unit = field.unit ? ` ${field.unit}` : "";
  return (
    <div className="border-b border-grid/50 py-2 last:border-0">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="shrink-0 text-ink-300">{label}</span>
        <span className="num text-right font-medium text-ink-100">
          {v}
          {unit}
        </span>
      </div>
      {field.note && <p className="mt-0.5 text-2xs text-ink-500">{field.note}</p>}
      {field.caveat && (
        <p className="mt-0.5 flex items-start gap-1 text-2xs text-warning/90">
          <Icon name="alert" size={11} className="mt-0.5 shrink-0" /> {field.caveat}
        </p>
      )}
      {(field.source || field.year) && (
        <div className="mt-1 flex items-center gap-2 text-2xs text-ink-500">
          <span>
            {field.source}
            {field.year ? ` · ${field.year}` : ""}
          </span>
          <a
            href={sourceUrl(field.source, `${jurName} ${label}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-gold hover:underline"
          >
            <Icon name="external" size={10} /> {ft("verify_source")}
          </a>
        </div>
      )}
    </div>
  );
}
