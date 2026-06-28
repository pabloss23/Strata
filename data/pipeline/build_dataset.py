"""
build_dataset.py -- Orquesta el pipeline ETL y escribe data/processed/countries.json
validado contra data/schema/country_schema.json. Copia el resultado a la carpeta
publica del frontend (apps/web/public/data/countries.json).

Flujo:
  1. Metadatos de pais desde el World Bank (/v2/country): iso3, iso2, nombre,
     capital, lat/long, region. (REST Countries v3.1 quedo deprecado en 2025, asi
     que dependemos de una sola fuente robusta y sin clave: el World Bank.)
  2. Indicadores World Bank: 15 metricas (economicas, WGI politicas, sociales).
  3. Poblacion y area como metadatos (indicadores WB).
  4. Bandera via flagcdn a partir del iso2.
  5. Unir por ISO3, construir el JSON y validar contra el esquema.

Nota: los nombres vienen en ingles (fuente World Bank). El chrome de la UI esta
en ES; localizar nombres de pais queda para una fase posterior (i18n).
"""
import json
import shutil
from pathlib import Path
import requests

try:
    from jsonschema import validate as _validate
except Exception:
    _validate = None

from fetch_worldbank import fetch_all as fetch_wb_metrics, fetch_meta as fetch_wb_meta

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "processed" / "countries.json"
PUBLIC = ROOT / "apps" / "web" / "public" / "data" / "countries.json"
SCHEMA = ROOT / "data" / "schema" / "country_schema.json"

# Catalogo de metricas (espejo de docs/METRICS.md). Cada una con dimension,
# direccion y unidad: de ahi salen la normalizacion 0-100 y las escalas de color.
METRIC_CATALOG = [
    # Economica (ambar)
    {"id": "gdp_per_capita", "label": "PIB per capita", "dimension": "economic", "direction": "higher_is_better", "unit": "USD", "source": "World Bank"},
    {"id": "gdp_growth", "label": "Crecimiento del PIB", "dimension": "economic", "direction": "higher_is_better", "unit": "%", "source": "World Bank"},
    {"id": "inflation", "label": "Inflacion", "dimension": "economic", "direction": "lower_is_better", "unit": "%", "source": "World Bank"},
    {"id": "unemployment", "label": "Desempleo", "dimension": "economic", "direction": "lower_is_better", "unit": "%", "source": "World Bank"},
    {"id": "gini", "label": "Desigualdad (Gini)", "dimension": "economic", "direction": "lower_is_better", "unit": "indice 0-100", "source": "World Bank"},
    # Politica (violeta) -- Worldwide Governance Indicators, puntuacion percentil 0-100
    {"id": "rule_of_law", "label": "Estado de derecho", "dimension": "political", "direction": "higher_is_better", "unit": "percentil 0-100", "source": "World Bank WGI"},
    {"id": "control_of_corruption", "label": "Control de la corrupcion", "dimension": "political", "direction": "higher_is_better", "unit": "percentil 0-100", "source": "World Bank WGI"},
    {"id": "voice_accountability", "label": "Voz y rendicion de cuentas", "dimension": "political", "direction": "higher_is_better", "unit": "percentil 0-100", "source": "World Bank WGI"},
    {"id": "political_stability", "label": "Estabilidad politica", "dimension": "political", "direction": "higher_is_better", "unit": "percentil 0-100", "source": "World Bank WGI"},
    {"id": "government_effectiveness", "label": "Eficacia del gobierno", "dimension": "political", "direction": "higher_is_better", "unit": "percentil 0-100", "source": "World Bank WGI"},
    # Social (verde-azulado)
    {"id": "life_expectancy", "label": "Esperanza de vida", "dimension": "social", "direction": "higher_is_better", "unit": "anios", "source": "World Bank"},
    {"id": "internet_users", "label": "Uso de internet", "dimension": "social", "direction": "higher_is_better", "unit": "% poblacion", "source": "World Bank"},
    {"id": "access_electricity", "label": "Acceso a electricidad", "dimension": "social", "direction": "higher_is_better", "unit": "% poblacion", "source": "World Bank"},
    {"id": "child_mortality", "label": "Mortalidad infantil (<5)", "dimension": "social", "direction": "lower_is_better", "unit": "por 1.000 nac.", "source": "World Bank"},
    {"id": "secondary_enrollment", "label": "Escolarizacion secundaria", "dimension": "social", "direction": "higher_is_better", "unit": "% bruto", "source": "World Bank"},
]


def fetch_countries_meta():
    """World Bank /v2/country -> metadatos basicos por ISO3 (sin agregados)."""
    url = f"https://api.worldbank.org/v2/country"
    r = requests.get(url, params={"format": "json", "per_page": 400}, timeout=60)
    r.raise_for_status()
    payload = r.json()
    rows = payload[1] if isinstance(payload, list) and len(payload) > 1 else []
    meta = {}
    for c in rows:
        # Saltar agregados regionales/economicos (no son paises)
        if (c.get("region") or {}).get("value", "").strip() == "Aggregates":
            continue
        iso3 = c.get("id")
        iso2 = (c.get("iso2Code") or "").strip()
        if not iso3 or len(iso3) != 3:
            continue
        try:
            lat = float(c["latitude"]) if c.get("latitude") else None
            lon = float(c["longitude"]) if c.get("longitude") else None
        except (TypeError, ValueError):
            lat = lon = None
        meta[iso3] = {
            "iso3": iso3,
            "iso2": iso2 or None,
            "name": c.get("name"),
            "region": (c.get("region") or {}).get("value", "").strip() or None,
            "capital": c.get("capitalCity") or None,
            "latlng": [lat, lon] if lat is not None and lon is not None else None,
            "flag": f"https://flagcdn.com/{iso2.lower()}.svg" if iso2 else None,
            "population": None,
            "area_km2": None,
            "metrics": {},
        }
    # Limpiar claves None (el esquema no acepta capital/flag = null como string)
    for c in meta.values():
        for k in ("iso2", "name", "region", "capital", "flag", "latlng"):
            if c.get(k) is None:
                c.pop(k, None)
    return meta


def build():
    print(">>> 1. Metadatos de pais (World Bank /country)...")
    countries = fetch_countries_meta()
    print(f"    {len(countries)} paises")

    print(">>> 2. Indicadores-metrica (World Bank)...")
    for metric_id, by_iso in fetch_wb_metrics().items():
        for iso3, mv in by_iso.items():
            if iso3 in countries:
                countries[iso3]["metrics"][metric_id] = mv

    print(">>> 3. Metadatos numericos (poblacion, area)...")
    meta = fetch_wb_meta()
    for iso3, mv in meta.get("population", {}).items():
        if iso3 in countries:
            countries[iso3]["population"] = mv["value"]
    for iso3, mv in meta.get("area_km2", {}).items():
        if iso3 in countries:
            countries[iso3]["area_km2"] = mv["value"]

    # Conservar solo paises con al menos una metrica (evita filas vacias)
    kept = {k: v for k, v in countries.items() if v["metrics"]}
    print(f"    {len(kept)} paises con datos")

    dataset = {
        "schemaVersion": "1.0",
        "generatedAt": __import__("datetime").date.today().isoformat(),
        "metricCatalog": METRIC_CATALOG,
        "countries": sorted(kept.values(), key=lambda c: c.get("name") or c["iso3"]),
    }

    if _validate:
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        _validate(instance=dataset, schema=schema)
        print(">>> Validado contra el esquema.")
    else:
        print(">>> (jsonschema no instalado; salto validacion)")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f">>> Escrito {OUT} ({len(dataset['countries'])} paises)")

    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(OUT, PUBLIC)
    print(f">>> Copiado a {PUBLIC}")


if __name__ == "__main__":
    build()
