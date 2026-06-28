// Cuenta animada de 0 al valor objetivo (easeOutCubic). Respeta reduced-motion.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./motion";
import { useStore } from "@/store/useStore";

export function useCountUp(target: number | null, duration = 750): number | null {
  const reduce = useReducedMotion() || useStore((s) => s.reduceMotion);
  const [val, setVal] = useState<number | null>(reduce ? target : target == null ? null : 0);
  const raf = useRef<number>();

  useEffect(() => {
    if (target == null) {
      setVal(null);
      return;
    }
    if (reduce) {
      setVal(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, reduce]);

  return val;
}
