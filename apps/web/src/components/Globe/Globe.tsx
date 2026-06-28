// Globo de datos: océanos oscuros + países en rampa ORO + atmósfera sutil.
// No es un simulador espacial; es la herramienta para navegar los datos.
//  - Hover: eleva el país + tooltip con valor y ranking.  Click: selecciona.
//  - Sin dato: gris oscuro.  prefers-reduced-motion / reducir animaciones: sin giro.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { useBorders, type BorderFeature } from "@/data/useBorders";
import { useActiveColoring, useDataset } from "@/data/useDataset";
import { useStore } from "@/store/useStore";
import { capColor } from "@/lib/colorScale";
import { GOLD } from "@/lib/theme";
import { formatValue } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

export default function GlobeView() {
  const globeRef = useRef<any>();
  const { ref: wrapRef, size } = useElementSize();
  const { data: borders } = useBorders();
  const { ds, byIso3 } = useDataset();
  const { def, scale, scoreOf, rankOf } = useActiveColoring();

  const selectCountry = useStore((s) => s.selectCountry);
  const setHovered = useStore((s) => s.setHovered);
  const selectedIso3 = useStore((s) => s.selectedIso3);
  const hoveredIso3 = useStore((s) => s.hoveredIso3);
  const highContrast = useStore((s) => s.highContrast);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const compareOpen = useStore((s) => s.compareOpen);
  const compareList = useStore((s) => s.compareList);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const { t, name, metric, lang } = useI18n();
  const reduce = useReducedMotion() || reduceMotion;

  const isoOf = (f: BorderFeature) => f.properties.iso3 ?? "";

  // Océano oscuro (material sólido, sin textura satélite).
  const globeMaterial = useMemo(() => {
    const m = new THREE.MeshPhongMaterial({
      color: "#0A1326",
      emissive: "#070D1C",
      emissiveIntensity: 0.5,
      shininess: 4,
      specular: new THREE.Color("#16223D"),
    });
    return m;
  }, []);

  const capColorFn = useCallback((f: any) => capColor(scoreOf(isoOf(f)), scale), [scoreOf, scale]);

  const altitudeFn = useCallback(
    (f: any) => {
      const iso = isoOf(f);
      if (iso === selectedIso3 || compareList.includes(iso)) return 0.1;
      if (iso === hoveredIso3) return 0.05;
      return 0.006;
    },
    [selectedIso3, hoveredIso3, compareList]
  );

  const strokeFn = useCallback(
    (f: any) => {
      const iso = isoOf(f);
      return iso === selectedIso3 || iso === hoveredIso3 || compareList.includes(iso)
        ? GOLD
        : "rgba(30,41,59,0.6)";
    },
    [selectedIso3, hoveredIso3, compareList]
  );

  const labelFn = useCallback(
    (f: any) => {
      const iso = isoOf(f);
      const c = byIso3.get(iso);
      const cname = c ? name(c) : f.properties.name ?? iso ?? "—";
      const raw = def ? c?.metrics[def.id] : undefined;
      const reading = def && raw?.value != null ? formatValue(raw.value, def) : t("no_data");
      const swatch = capColor(scoreOf(iso), scale);
      const rank = rankOf(iso);
      const rankLine = rank
        ? `<div style="margin-top:6px;font-size:12px;color:#94A3B8">${t("rank_of", { r: rank.rank, t: rank.total })}</div>`
        : "";
      return `
        <div style="font-family:Geist,Inter,sans-serif;background:rgba(8,16,31,0.92);
          border:1px solid rgba(229,184,91,0.45);border-radius:16px;padding:12px 14px;color:#F8FAFC;
          box-shadow:0 18px 50px rgba(0,0,0,0.6);backdrop-filter:blur(10px);min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="width:10px;height:10px;border-radius:3px;background:${swatch}"></span>
            <span style="font-size:16px;font-weight:700;letter-spacing:-0.01em">${cname}</span>
          </div>
          <div style="font-size:11px;color:#94A3B8">${def ? metric(def) : ""}</div>
          <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-top:1px">${reading}</div>
          ${rankLine}
          <div style="margin-top:8px;font-size:11px;color:#E5B85B;font-weight:500">${t("explore_hint")}</div>
        </div>`;
    },
    [byIso3, def, scale, scoreOf, rankOf, lang]
  );

  // Auto-rotación suave; se pausa al interactuar y se desactiva si se reduce el movimiento.
  useEffect(() => {
    const controls = globeRef.current?.controls?.();
    if (!controls) return;
    controls.autoRotate = !reduce && !hoveredIso3 && !selectedIso3;
    controls.autoRotateSpeed = 0.3;
    controls.enableDamping = true;
    controls.minDistance = 180;
    controls.maxDistance = 520;
  }, [reduce, hoveredIso3, selectedIso3, borders]);

  useEffect(() => {
    if (borders && globeRef.current) {
      globeRef.current.pointOfView({ lat: 25, lng: 10, altitude: 2.4 }, 0);
    }
  }, [borders]);

  useEffect(() => {
    if (!selectedIso3 || !globeRef.current) return;
    const ll = byIso3.get(selectedIso3)?.latlng;
    if (ll) globeRef.current.pointOfView({ lat: ll[0], lng: ll[1], altitude: 1.9 }, reduce ? 0 : 900);
  }, [selectedIso3, byIso3, reduce]);

  // Nueva referencia del array al cambiar el coloreado → globe.gl re-evalúa el color.
  const polygons = useMemo(() => (borders ? [...borders] : []), [borders, def?.id, highContrast]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={GOLD}
          atmosphereAltitude={0.1}
          animateIn={!reduce}
          polygonsData={polygons}
          polygonAltitude={altitudeFn}
          polygonCapColor={capColorFn}
          polygonSideColor={() => "rgba(5,8,20,0.6)"}
          polygonStrokeColor={strokeFn}
          polygonLabel={labelFn}
          polygonsTransitionDuration={ds ? 380 : 0}
          onPolygonClick={(f: any) => {
            const iso = isoOf(f);
            if (!iso) return;
            if (compareOpen) toggleCompare(iso);
            else selectCountry(iso === selectedIso3 ? null : iso);
          }}
          onPolygonHover={(f: any) => setHovered(f ? isoOf(f) || null : null)}
        />
      )}
    </div>
  );
}
