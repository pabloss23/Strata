"""
fetch_worldbank.py -- Descarga indicadores del World Bank (API sin clave).
Parte del pipeline ETL. Ver docs/DATA_SOURCES.md y docs/METRICS.md.

La API: https://api.worldbank.org/v2/country/all/indicator/{CODE}?format=json
Con mrnev=1 devuelve el ultimo valor no nulo por pais.

Todos los indicadores aqui son del World Bank y NO requieren clave. Incluye los
seis Worldwide Governance Indicators (WGI), que dan profundidad real a la
dimension politica sin depender de fuentes con licencia restrictiva.
"""
import time
import requests

# id interno -> codigo del indicador en World Bank (base de datos por defecto, source=2)
WB_INDICATORS = {
    # --- Economica ---
    "gdp_per_capita": "NY.GDP.PCAP.CD",
    "gdp_growth": "NY.GDP.MKTP.KD.ZG",
    "inflation": "FP.CPI.TOTL.ZG",
    "unemployment": "SL.UEM.TOTL.ZS",
    "gini": "SI.POV.GINI",
    # --- Social ---
    "life_expectancy": "SP.DYN.LE00.IN",
    "internet_users": "IT.NET.USER.ZS",
    "access_electricity": "EG.ELC.ACCS.ZS",
    "child_mortality": "SH.DYN.MORT",
    "secondary_enrollment": "SE.SEC.ENRR",
}

# --- Politica: Worldwide Governance Indicators (source=3) ---
# Usamos la variante ".SC" (puntuacion percentil 0-100, mas legible que el estimate).
WB_WGI_SOURCE = 3
WB_WGI_INDICATORS = {
    "rule_of_law": "GOV_WGI_RL.SC",
    "control_of_corruption": "GOV_WGI_CC.SC",
    "voice_accountability": "GOV_WGI_VA.SC",
    "political_stability": "GOV_WGI_PV.SC",
    "government_effectiveness": "GOV_WGI_GE.SC",
}

# Indicadores que se usan como METADATOS (no como metricas puntuables)
WB_META_INDICATORS = {
    "population": "SP.POP.TOTL",
    "area_km2": "AG.LND.TOTL.K2",
}

BASE = "https://api.worldbank.org/v2"


def fetch_indicator(code: str, source_label: str = "World Bank", per_page: int = 20000,
                    retries: int = 4, source: int | None = None):
    """Devuelve {iso3: {'value': x, 'year': y, 'source': ...}} con el ultimo valor no nulo.

    La API a veces responde 400/429 transitorios bajo rafaga; reintentamos con backoff.
    `source` selecciona una base de datos concreta (p.ej. 3 = Governance Indicators).
    """
    url = f"{BASE}/country/all/indicator/{code}"
    params = {"format": "json", "per_page": per_page, "mrnev": 1}  # most recent non-empty value
    if source is not None:
        params["source"] = source
    last_exc = None
    for attempt in range(retries):
        try:
            r = requests.get(url, params=params, timeout=60)
            r.raise_for_status()
            payload = r.json()
            break
        except Exception as e:  # noqa: BLE001 -- reintentamos cualquier fallo transitorio
            last_exc = e
            time.sleep(0.8 * (attempt + 1))
    else:
        raise last_exc
    if not isinstance(payload, list) or len(payload) < 2 or payload[1] is None:
        return {}
    out = {}
    for row in payload[1]:
        iso3 = row.get("countryiso3code")
        val = row.get("value")
        year = row.get("date")
        if iso3 and val is not None:
            out[iso3] = {"value": val, "year": int(year) if year else None, "source": source_label}
    return out


def fetch_all():
    """Devuelve {metric_id: {iso3: {value, year, source}}} para los indicadores-metrica."""
    result = {}
    for metric_id, code in WB_INDICATORS.items():
        print(f"  World Bank: {metric_id} ({code})...")
        try:
            result[metric_id] = fetch_indicator(code, "World Bank")
        except Exception as e:
            print(f"    ! error con {code}: {e}")
            result[metric_id] = {}
        time.sleep(0.25)  # cortesia con la API
    for metric_id, code in WB_WGI_INDICATORS.items():
        print(f"  World Bank WGI: {metric_id} ({code})...")
        try:
            result[metric_id] = fetch_indicator(code, "World Bank WGI", source=WB_WGI_SOURCE)
        except Exception as e:
            print(f"    ! error con {code}: {e}")
            result[metric_id] = {}
        time.sleep(0.25)
    return result


def fetch_meta():
    """Devuelve {meta_id: {iso3: {value, year, source}}} (poblacion, area)."""
    result = {}
    for meta_id, code in WB_META_INDICATORS.items():
        print(f"  World Bank (meta): {meta_id} ({code})...")
        try:
            result[meta_id] = fetch_indicator(code)
        except Exception as e:
            print(f"    ! error con {code}: {e}")
            result[meta_id] = {}
        time.sleep(0.25)
    return result


if __name__ == "__main__":
    data = fetch_all()
    for m, d in data.items():
        print(f"{m}: {len(d)} paises")
