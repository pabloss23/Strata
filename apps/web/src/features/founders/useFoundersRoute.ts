// Router mínimo y aislado para Strata Founders (ruta /founders). History API,
// sin dependencias. Base-aware: funciona en raíz (/) y en subruta (GitHub Pages
// /strata/) leyendo import.meta.env.BASE_URL.
import { useEffect, useState } from "react";

export const FOUNDERS_PATH = "/founders";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, ""); // "" o "/strata"

/** Quita el prefijo de base para comparar rutas lógicas. */
function rel(p: string): string {
  let r = p;
  if (BASE && r.startsWith(BASE)) r = r.slice(BASE.length);
  if (!r.startsWith("/")) r = "/" + r;
  return r;
}

export function isFoundersPath(p: string = window.location.pathname): boolean {
  const r = rel(p);
  return r === FOUNDERS_PATH || r.startsWith(FOUNDERS_PATH + "/");
}

/** Navega a una ruta lógica (sin base); añade la base y notifica a los escuchas. */
export function navigate(path: string) {
  const full = (BASE + path).replace(/\/{2,}/g, "/") || "/";
  if (window.location.pathname === full) return;
  window.history.pushState({}, "", full);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useIsFounders(): boolean {
  const [on, setOn] = useState(() => isFoundersPath());
  useEffect(() => {
    const onPop = () => setOn(isFoundersPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return on;
}
