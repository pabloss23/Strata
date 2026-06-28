"""
gen_iso_numeric.py -- Genera apps/web/src/lib/isoNumeric.ts

Puente ISO 3166-1 numerico -> alpha-3. El globo (world-atlas) identifica cada
pais por su codigo numerico; el dataset de Strata se indexa por iso3. Este mapa
los une. Es DATO DE REFERENCIA estable (no estadisticas), por eso se commitea.

Fuente: lukes/ISO-3166-Countries-with-Regional-Codes (dominio publico).
"""
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "apps" / "web" / "src" / "lib" / "isoNumeric.ts"
SRC = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json"


def build():
    rows = requests.get(SRC, timeout=60).json()
    m = {}
    for x in rows:
        code, a3 = x.get("country-code"), x.get("alpha-3")
        if code and a3:
            m[str(int(code))] = a3  # sin ceros a la izquierda (como world-atlas)
    m["-99"] = "XKX"  # Kosovo (convencion Natural Earth / world-atlas)

    body = "".join(f'  "{k}": "{v}",\n' for k, v in sorted(m.items(), key=lambda kv: int(kv[0])))
    ts = (
        "// GENERADO automaticamente (ISO 3166-1 numeric -> alpha-3).\n"
        "// Fuente: lukes/ISO-3166-Countries-with-Regional-Codes (dominio publico).\n"
        "// Puente para unir las fronteras de world-atlas (id numerico) con el dataset (iso3).\n"
        "// Regenerar con: python data/pipeline/gen_iso_numeric.py\n\n"
        "export const NUMERIC_TO_ISO3: Record<string, string> = {\n" + body + "};\n\n"
        "export function iso3FromNumeric(id: string | number | undefined | null): string | undefined {\n"
        "  if (id == null) return undefined;\n"
        "  return NUMERIC_TO_ISO3[String(Number(id))];\n"
        "}\n"
    )
    OUT.write_text(ts, encoding="utf-8")
    print(f">>> Escrito {OUT} ({len(m)} entradas)")


if __name__ == "__main__":
    build()
