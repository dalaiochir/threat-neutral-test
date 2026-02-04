"use client";

import Link from "next/link";
import { TestResult } from "@/lib/types";

function fmtMs(ms: number) {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function ResultSummary({ result }: { result: TestResult }) {
  return (
    <div className="card">
      <div className="title">Тестийн үр дүн</div>

      <div className="stats">
        <div className="stat">
          <div className="muted">Нийт хугацаа</div>
          <div className="big">{fmtMs(result.totalTimeMs)}</div>
        </div>
        <div className="stat">
          <div className="muted">Зөв хувь</div>
          <div className="big">{result.accuracyPct.toFixed(1)}%</div>
        </div>
        <div className="stat">
          <div className="muted">Зөв/Нийт</div>
          <div className="big">
            {result.totalCorrect}/{result.totalQuestions}
          </div>
        </div>
      </div>

      <div className="hr" />

      <div className="title2">Benchmark-тэй харьцуулалт</div>
      <div className="stats">
        <div className="stat">
          <div className="muted">Benchmark хугацаа</div>
          <div className="big">{fmtMs(result.benchmarkTimeMs)}</div>
        </div>
        <div className="stat">
          <div className="muted">Benchmark зөв хувь</div>
          <div className="big">{result.benchmarkAccuracyPct.toFixed(1)}%</div>
        </div>
        <div className="stat">
          <div className="muted">Таны давуу тал</div>
          <div className="big">
            {result.deltaTimeMs >= 0 ? `+${fmtMs(result.deltaTimeMs)} хурдан` : `-${fmtMs(Math.abs(result.deltaTimeMs))} удаан`}
            <div className="muted">
              {result.deltaAccuracyPct >= 0
                ? `+${result.deltaAccuracyPct.toFixed(1)}% нарийвчлал`
                : `${result.deltaAccuracyPct.toFixed(1)}% нарийвчлал`}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <Link className="btn" href="/test">Дахин өгөх</Link>
        <Link className="btn ghost" href="/history">Түүх харах</Link>
        <Link className="btn ghost" href="/settings">Benchmark тохируулах</Link>
      </div>
    </div>
  );
}
