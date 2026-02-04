"use client";

import { useEffect, useMemo, useState } from "react";
import { loadHistory, saveHistory, TestResult } from "@/lib/storage";
import Link from "next/link";

function fmtMs(ms: number) {
  const sec = Math.round(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<TestResult[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const summary = useMemo(() => {
    if (!items.length) return null;
    const best = [...items].sort((a, b) => (b.accuracy - a.accuracy) || (a.totalMs - b.totalMs))[0];
    const avgAcc = items.reduce((s, x) => s + x.accuracy, 0) / items.length;
    const avgMs = items.reduce((s, x) => s + x.totalMs, 0) / items.length;
    return { best, avgAcc, avgMs };
  }, [items]);

  function clearHistory() {
    saveHistory([]);
    setItems([]);
  }

  return (
    <main className="container" style={{ padding: "28px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Тестийн түүх</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/test"
            style={{
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontWeight: 700,
            }}
          >
            Шинэ тест
          </Link>
          <button
            onClick={clearHistory}
            type="button"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ef4444",
              background: "#fff",
              color: "#ef4444",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Түүх цэвэрлэх
          </button>
        </div>
      </div>

      {summary && (
        <section
          style={{
            marginTop: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 14,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ margin: "0 0 8px" }}>Ерөнхий</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <div style={{ opacity: 0.7, fontSize: 13 }}>Нийт оролдлого</div>
              <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{items.length}</div>
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <div style={{ opacity: 0.7, fontSize: 13 }}>Дундаж зөв хувь</div>
              <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>
                {Math.round(summary.avgAcc * 100)}%
              </div>
            </div>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
              <div style={{ opacity: 0.7, fontSize: 13 }}>Дундаж хугацаа</div>
              <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>
                {fmtMs(summary.avgMs)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10, opacity: 0.9 }}>
            <b>Personal Best:</b>{" "}
            {Math.round(summary.best.accuracy * 100)}% · {fmtMs(summary.best.totalMs)} ·{" "}
            {fmtDate(summary.best.createdAt)}
          </div>
        </section>
      )}

      {!items.length ? (
        <div style={{ marginTop: 16, opacity: 0.8 }}>
          Одоохондоо түүх алга. <Link href="/test">Тест эхлүүлэх</Link>
        </div>
      ) : (
        <div
          style={{
            marginTop: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            background: "#fff",
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(15,23,42,.03)" }}>
                  <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Огноо
                  </th>
                  <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Зөв хувь
                  </th>
                  <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Хугацаа
                  </th>
                  <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Stage1 (Занал)
                  </th>
                  <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Stage2 (Энгийн)
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                      {fmtDate(x.createdAt)}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9", fontWeight: 800 }}>
                      {Math.round(x.accuracy * 100)}% ({x.correct}/{x.total})
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                      {fmtMs(x.totalMs)}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                      {x.stageBreakdown.threat.correct}/{x.stageBreakdown.threat.total}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                      {x.stageBreakdown.neutral.correct}/{x.stageBreakdown.neutral.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
