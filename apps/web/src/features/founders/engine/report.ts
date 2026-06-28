// Exportación del informe de fundador: Markdown descargable y vista imprimible
// (Guardar como PDF del navegador). Gratis, sin dependencias. Reutiliza el briefing.
import type { FounderProfile } from "../types";
import type { MatchResult } from "./match";
import type { Block, BriefingHelpers } from "./briefing";

function fieldStr(f?: { value: unknown; unit?: string }): string {
  if (!f || f.value === "" || f.value == null) return "—";
  return `${f.value}${f.unit ? ` ${f.unit}` : ""}`;
}

export interface ReportInput {
  profile: FounderProfile;
  results: MatchResult[];
  blocks: Block[];
  nationName: string;
  h: BriefingHelpers & { ft: BriefingHelpers["ft"]; status: (s: import("../types").VerifyStatus) => string };
}

export function buildMarkdown({ profile, results, blocks, nationName, h }: ReportInput): string {
  const L: string[] = [];
  L.push(`# ${h.ft("report_title")}`);
  L.push(`_${h.ft("legal_banner")}_\n`);

  L.push(`## ${h.ft("report_profile")}`);
  L.push(`- ${h.ft("business_q")} ${h.business(profile.business)}`);
  L.push(`- ${h.ft("clients_q")} ${h.clients(profile.clients)}`);
  L.push(`- ${h.ft("nationality_q")} ${nationName}\n`);

  L.push(`## ${h.ft("report_ranking")}`);
  L.push(`| # | ${h.ft("nav_browse")} | ${h.ft("score")} | ${h.ft("fld_corporateRate")} | ${h.ft("fld_personalIncomeTopRate")} | ${h.status("partial")} |`);
  L.push(`|---|---|---|---|---|---|`);
  results.forEach((r, i) => {
    const j = r.jurisdiction;
    const cfc = r.cfcWarning ? " ⚠CFC" : "";
    L.push(
      `| ${i + 1} | ${j.name}${cfc} | ${Math.round(r.score)} | ${fieldStr(j.companyTax.corporateRate)} | ${fieldStr(j.founderTax.personalIncomeTopRate)} | ${h.status(j.status)} |`
    );
  });
  L.push("");

  L.push(`## ${h.ft("briefing_title")}`);
  for (const b of blocks) {
    if ("h" in b) L.push(`### ${b.h}`);
    else if ("p" in b) L.push(`${b.p}\n`);
    else if ("ul" in b) b.ul.forEach((it) => L.push(`- ${it}`));
  }
  L.push("");

  L.push(`## ${h.ft("report_sources")}`);
  results.forEach((r) => {
    L.push(`- ${r.jurisdiction.name}: ${h.status(r.jurisdiction.status)} · ${h.ft("last_verified")} ${r.jurisdiction.lastVerified}`);
  });
  L.push(`\n_${h.ft("seed_note")}_`);
  return L.join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/markdown;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export function buildReportHtml({ profile, results, blocks, nationName, h }: ReportInput): string {
  const rows = results
    .map(
      (r, i) =>
        `<tr><td>${i + 1}</td><td>${esc(r.jurisdiction.name)}${r.cfcWarning ? " ⚠CFC" : ""}</td><td>${Math.round(r.score)}</td><td>${esc(fieldStr(r.jurisdiction.companyTax.corporateRate))}</td><td>${esc(fieldStr(r.jurisdiction.founderTax.personalIncomeTopRate))}</td><td>${esc(h.status(r.jurisdiction.status))}</td></tr>`
    )
    .join("");
  const briefing = blocks
    .map((b) => {
      if ("h" in b) return `<h3>${esc(b.h)}</h3>`;
      if ("p" in b) return `<p>${esc(b.p)}</p>`;
      return `<ul>${b.ul.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>`;
    })
    .join("");
  return `
    <h1>${esc(h.ft("report_title"))}</h1>
    <p class="muted">${esc(h.ft("legal_banner"))}</p>
    <h2>${esc(h.ft("report_profile"))}</h2>
    <ul>
      <li><b>${esc(h.ft("business_q"))}</b> ${esc(h.business(profile.business))}</li>
      <li><b>${esc(h.ft("clients_q"))}</b> ${esc(h.clients(profile.clients))}</li>
      <li><b>${esc(h.ft("nationality_q"))}</b> ${esc(nationName)}</li>
    </ul>
    <h2>${esc(h.ft("report_ranking"))}</h2>
    <table><thead><tr><th>#</th><th>${esc(h.ft("nav_browse"))}</th><th>${esc(h.ft("score"))}</th><th>${esc(h.ft("fld_corporateRate"))}</th><th>${esc(h.ft("fld_personalIncomeTopRate"))}</th><th>${esc(h.status("partial"))}</th></tr></thead><tbody>${rows}</tbody></table>
    <h2>${esc(h.ft("briefing_title"))}</h2>
    ${briefing}
    <p class="muted">${esc(h.ft("seed_note"))}</p>
  `;
}

export function printReport(bodyHtml: string, title: string) {
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
    <style>
      body{font:14px/1.55 -apple-system,Segoe UI,Inter,sans-serif;color:#0D1326;max-width:760px;margin:32px auto;padding:0 20px}
      h1{font-size:24px;margin:0 0 4px} h2{font-size:17px;margin:24px 0 8px;border-bottom:1px solid #DDE3EC;padding-bottom:4px} h3{font-size:14px;margin:14px 0 4px}
      p{margin:6px 0} ul{margin:6px 0;padding-left:20px} li{margin:2px 0}
      table{border-collapse:collapse;width:100%;font-size:13px;margin-top:6px} th,td{border:1px solid #DDE3EC;padding:6px 8px;text-align:left}
      th{background:#F4F6F9} .muted{color:#51607A;font-size:12px}
      @media print{body{margin:0}}
    </style></head><body>${bodyHtml}<script>window.onload=function(){setTimeout(function(){window.print()},200)}<\/script></body></html>`);
  w.document.close();
}
