"use client";

import { useEffect, useMemo, useState } from "react";
import { Baseline, loadBaseline, saveBaseline, loadHistory } from "@/lib/storage";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function fmtMs(ms: number) {
  const sec = Math.round(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SettingsPage() {
  const [baseline, setBaseline] = useState<Baseline | null>(null);

  const [accPct, setAccPct] = useState<number>(85); // %
  const [min, setMin] = useState<number>(0);
  const [sec, setSec] = useState<number>(45);

  useEffect(() => {
    const b = loadBaseline();
    setBaseline(b);
    if (b) {
      setAccPct(Math.round(b.accuracy * 100));
      const totalSec = Math.round(b.totalMs / 1000);
      setMin(Math.floor(totalSec / 60));
      setSec(totalSec % 60);
    }
  }, []);

  const personalBest = useMemo(() => {
    const h = loadHistory();
    if (!h.length) return null;
    return [...h].sort((a, b) => (b.accuracy - a.accuracy) || (a.totalMs - b.totalMs))[0];
  }, []);

  function applyBaseline() {
    const a = clamp(accPct, 0, 100) / 100;
    const totalSec = clamp(min, 0, 999) * 60 + clamp(sec, 0, 59);
    const totalMs = totalSec * 1000;

    const b: Baseline = { accuracy: a, totalMs };
    saveBaseline(b);
    setBaseline(b);
    alert("Baseline хадгалагдлаа.");
  }

  function setFromPersonalBest() {
    if (!personalBest) return;
    const b: Baseline = { accuracy: personalBest.accuracy, totalMs: personalBest.totalMs };
    saveBaseline(b);
    setBaseline(b);

    setAccPct(Math.round(b.accuracy * 100));
    const totalSec = Math.round(b.totalMs / 1000);
    setMin(Math.floor(totalSec / 60));
    setSec(totalSec % 60);

    alert("Personal Best-ийг Baseline болголоо.");
  }

  return (
    <main className="container" style={{ padding: "28px 16px" }}>
      <h1 style={{ fontSize: 34, margin: 0 }}>Тохиргоо</h1>
      <p style={{ opacity: 0.8, marginTop: 8, lineHeight: 1.5, maxWidth: 780 }}>
        Baseline гэдэг нь таны “зорилтот/лавлах” үзүүлэлт. Тестийн үр дүнг дуусахад энэ baseline-тэй харьцуулж харуулна.
      </p>

      <section
        style={{
          marginTop: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 14,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          maxWidth: 720,
        }}
      >
        <h2 style={{ margin: "0 0 10px" }}>Baseline тохируулах</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>Зөв хувь (%)</span>
            <input
              type="number"
              value={accPct}
              min={0}
              max={100}
              onChange={(e) => setAccPct(Number(e.target.value))}
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 16,
              }}
            />
          </label>

          <div style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>Хугацаа (мм:сс)</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                value={min}
                min={0}
                max={999}
                onChange={(e) => setMin(Number(e.target.value))}
                style={{
                  width: "50%",
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 16,
                }}
                aria-label="minutes"
              />
              <input
                type="number"
                value={sec}
                min={0}
                max={59}
                onChange={(e) => setSec(Number(e.target.value))}
                style={{
                  width: "50%",
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 16,
                }}
                aria-label="seconds"
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button
            type="button"
            onClick={applyBaseline}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Хадгалах
          </button>

          <button
            type="button"
            onClick={setFromPersonalBest}
            disabled={!personalBest}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              color: "#111827",
              fontWeight: 800,
              cursor: personalBest ? "pointer" : "not-allowed",
              opacity: personalBest ? 1 : 0.6,
            }}
          >
            Personal Best-ийг Baseline болгох
          </button>
        </div>

        <div style={{ marginTop: 12, opacity: 0.85 }}>
          <b>Одоогийн Baseline:</b>{" "}
          {baseline ? (
            <>
              {Math.round(baseline.accuracy * 100)}% · {fmtMs(baseline.totalMs)}
            </>
          ) : (
            <i>Тохируулаагүй</i>
          )}
        </div>
      </section>
    </main>
  );
}
