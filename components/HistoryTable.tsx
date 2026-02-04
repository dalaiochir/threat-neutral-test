"use client";

import Link from "next/link";
import { TestResult } from "@/lib/types";

function fmtMs(ms: number) {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function HistoryTable({ items }: { items: TestResult[] }) {
  if (items.length === 0) {
    return (
      <div className="card">
        <div className="title">Түүх</div>
        <div className="muted">Одоогоор хадгалсан тест алга байна.</div>
        <div className="actions">
          <Link className="btn" href="/test">Эхлэх</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="title">Тестүүдийн түүх</div>

      <div className="table">
        <div className="row head">
          <div>Огноо</div>
          <div>Хугацаа</div>
          <div>Зөв хувь</div>
          <div>Δ Хугацаа</div>
          <div>Δ Хувь</div>
        </div>

        {items.map((x) => (
          <div className="row" key={x.id}>
            <div className="muted">{new Date(x.createdAtIso).toLocaleString()}</div>
            <div>{fmtMs(x.totalTimeMs)}</div>
            <div>{x.accuracyPct.toFixed(1)}%</div>
            <div>{x.deltaTimeMs >= 0 ? `+${fmtMs(x.deltaTimeMs)}` : `-${fmtMs(Math.abs(x.deltaTimeMs))}`}</div>
            <div>{x.deltaAccuracyPct >= 0 ? `+${x.deltaAccuracyPct.toFixed(1)}%` : `${x.deltaAccuracyPct.toFixed(1)}%`}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <Link className="btn" href="/test">Шинэ тест</Link>
        <Link className="btn ghost" href="/">Нүүр</Link>
      </div>
    </div>
  );
}
