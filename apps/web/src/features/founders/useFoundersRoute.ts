// Router mínimo y aislado para Strata Founders (ruta /founders). History API,
// sin dependencias. La app principal renderiza <FoundersApp/> cuando esto es true.
import { useEffect, useState } from "react";

export const FOUNDERS_PATH = "/founders";

export function isFoundersPath(p: string = window.location.pathname): boolean {
  return p === FOUNDERS_PATH || p.startsWith(FOUNDERS_PATH + "/");
}

export function navigate(path: string) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
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
