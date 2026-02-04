"use client";

export default function ProgressBar(props: { value: number; max: number }) {
  const { value, max } = props;
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      style={{
        height: 10,
        borderRadius: 999,
        background: "rgba(15,23,42,.10)",
        overflow: "hidden",
      }}
      aria-label="progress"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      role="progressbar"
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "rgba(15,23,42,.85)",
        }}
      />
    </div>
  );
}
