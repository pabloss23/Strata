// Tarjeta de puntuación por dimensión: número que cuenta + barra que se llena.
// Se remonta por país (key con iso3), así re-anima al cambiar de selección.
import { useCountUp } from "@/lib/useCountUp";

interface ScoreCardProps {
  label: string;
  color: string;
  score: number | null;
}

export function ScoreCard({ label, color, score }: ScoreCardProps) {
  const v = useCountUp(score);
  const pct = score == null ? 0 : v ?? 0;

  return (
    <div
      className="rounded-xl border border-ink-100/[0.05] bg-space-900/50 px-2 py-3 text-center transition-transform duration-200 ease-smooth hover:-translate-y-0.5"
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
    >
      <div className="label" style={{ color }}>
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline justify-center gap-0.5">
        <span className="font-display text-[28px] font-medium leading-none text-ink-100">
          {score != null ? Math.round(v ?? 0) : "—"}
        </span>
        {score != null && <span className="text-2xs text-ink-500">/100</span>}
      </div>
      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink-100/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }}
        />
      </div>
    </div>
  );
}
