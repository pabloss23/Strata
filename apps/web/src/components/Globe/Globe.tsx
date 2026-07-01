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

  const setHovered = useStore((s) => s.setHovered);
  const selectedIso3 = useStore((s) => s.selectedIso3);
  const hoveredIso3 = useStore((s) => s.hoveredIso3);
  const highContrast = useStore((s) => s.highContrast);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const compareList = useStore((s) => s.compareList);
  const theme = useStore((s) => s.theme);
  const { t, name, metric, lang } = useI18n();
  const reduce = useReducedMotion() || reduceMotion;
  const isLight = theme === "light";

  const isoOf = (f: BorderFeature) => f.properties.iso3 ?? "";

  // Océano como material sólido (sin textura satélite). En claro es un azul suave y
  // luminoso —para que sobre fondo claro parezca un globo, no una bola negra—; en
  // oscuro sigue siendo una joya profunda. El emisivo alto evita el hemisferio negro.
  const globeMaterial = useMemo(() => {
    const light = theme === "light";
    return new THREE.MeshPhongMaterial({
      color: light ? "#A8C1DE" : "#0A1326",
      emissive: light ? "#7E9BC0" : "#070D1C",
      emissiveIntensity: light ? 0.7 : 0.5,
      shininess: light ? 18 : 4,
      specular: new THREE.Color(light ? "#E9F1FA" : "#16223D"),
    });
  }, [theme]);

  // Ilumina la esfera de forma pareja: en claro subimos el ambiente para que el lado
  // en sombra no quede negro; en oscuro se mantiene el contraste de joya.
  useEffect(() => {
    const globe = globeRef.current;
    const scene: THREE.Scene | undefined = globe?.scene?.();
    if (!scene) return;
    const prev = scene.getObjectByName("strata-ambient");
    if (prev) scene.remove(prev);
    const amb = new THREE.AmbientLight(0xffffff, theme === "light" ? 1.15 : 0.55);
    amb.name = "strata-ambient";
    scene.add(amb);
    return () => {
      scene.remove(amb);
    };
  }, [theme, borders]);

  const nodataColor = isLight ? "#8FA1B8" : undefined; // gris medio, distinguible del océano claro
  const capColorFn = useCallback(
    (f: any) => capColor(scoreOf(isoOf(f)), scale, nodataColor),
    [scoreOf, scale, nodataColor]
  );

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
      const active = iso === selectedIso3 || iso === hoveredIso3 || compareList.includes(iso);
      if (active) return isLight ? "#B67A12" : GOLD; // oro más oscuro en claro (contraste)
      return isLight ? "rgba(72,98,132,0.5)" : "rgba(30,41,59,0.6)";
    },
    [selectedIso3, hoveredIso3, compareList, isLight]
  );

  const labelHtml = useCallback(
    (iso: string) => {
      const c = byIso3.get(iso);
      const cname = c ? name(c) : iso || "—";
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

  // El array de polígonos se mantiene ESTABLE durante la interacción (no se
  // reconstruye al pasar el ratón): eso evita que globe.gl rehaga todo en cada
  // hover y mantiene la animación fluida (objetivo 120 fps). El resaltado de
  // selección/hover llega por la IDENTIDAD de los accessors (altitudeFn/strokeFn),
  // que cambian con selectedIso3/hoveredIso3/compareList y globe.gl re-aplica solos.
  const polygons = useMemo(
    () => (borders ? [...borders] : []),
    [borders, def?.id, highContrast]
  );

  // Países SIN polígono en la malla (micro-Estados, islas pequeñas): se muestran
  // como PUNTOS para que sean visibles y clicables (seleccionar/comparar).
  const polyIso = useMemo(() => new Set((borders ?? []).map(isoOf).filter(Boolean)), [borders]);
  const points = useMemo(() => {
    if (!ds) return [] as { iso3: string; lat: number; lng: number }[];
    return ds.countries
      .filter((c) => c.latlng && !polyIso.has(c.iso3))
      .map((c) => ({ iso3: c.iso3, lat: c.latlng![0], lng: c.latlng![1] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds, polyIso, def?.id, highContrast]);

  const pointActive = (iso: string) => iso === selectedIso3 || iso === hoveredIso3 || compareList.includes(iso);
  // Lee el estado MÁS reciente al hacer clic (evita cierres obsoletos del handler
  // que reciba globe.gl): en modo comparar añade/quita; si no, selecciona.
  const onPick = (iso: string) => {
    if (!iso) return;
    const st = useStore.getState();
    if (st.compareOpen) st.toggleCompare(iso);
    else st.selectCountry(iso === st.selectedIso3 ? null : iso);
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={isLight ? "#9FC0E8" : GOLD}
          atmosphereAltitude={isLight ? 0.16 : 0.12}
          animateIn={!reduce}
          polygonsData={polygons}
          polygonAltitude={altitudeFn}
          polygonCapColor={capColorFn}
          polygonSideColor={() => (isLight ? "rgba(120,150,185,0.55)" : "rgba(5,8,20,0.6)")}
          polygonStrokeColor={strokeFn}
          polygonLabel={(f: any) => labelHtml(isoOf(f))}
          polygonsTransitionDuration={ds ? 380 : 0}
          onPolygonClick={(f: any) => onPick(isoOf(f))}
          onPolygonHover={(f: any) => setHovered(f ? isoOf(f) || null : null)}
          pointsData={points}
          pointLat={(d: any) => d.lat}
          pointLng={(d: any) => d.lng}
          pointColor={(d: any) => (pointActive(d.iso3) ? (isLight ? "#B67A12" : GOLD) : capColor(scoreOf(d.iso3), scale, nodataColor))}
          pointAltitude={(d: any) => (pointActive(d.iso3) ? 0.06 : 0.018)}
          pointRadius={(d: any) => (pointActive(d.iso3) ? 0.65 : 0.4)}
          pointResolution={6}
          pointLabel={(d: any) => labelHtml(d.iso3)}
          pointsTransitionDuration={0}
          onPointClick={(d: any) => onPick(d.iso3)}
          onPointHover={(d: any) => setHovered(d ? d.iso3 : null)}
        />
      )}
    </div>
  );
}
