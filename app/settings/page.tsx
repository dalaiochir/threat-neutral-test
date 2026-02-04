"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadBenchmark, saveBenchmark } from "@/lib/storage";

export default function SettingsPage() {
  const [acc, setAcc] = useState(90);
  const [sec, setSec] = useState(60);

  useEffect(() => {
    const b = loadBenchmark();
    setAcc(b.targetAccuracyPct);
    setSec(Math.round(b.targetTimeMs / 1000));
  }, []);

  const save = () => {
    saveBenchmark({
      targetAccuracyPct: Math.max(0, Math.min(100, acc)),
      targetTimeMs: Math.max(1, sec) * 1000,
    });
    alert("Хадгаллаа!");
  };

  return (
    <div className="card">
      <div className="title">Benchmark тохиргоо</div>
      <p className="muted">
        “Зөв хийж гүйцэтгэсэн” загвар үзүүлэлтийг энд тохируулна. Үр дүн дээр харьцуулж (Δ) гарна.
      </p>

      <div className="stats">
        <div className="stat">
          <div className="muted">Зорилтот зөв хувь (%)</div>
          <input
            value={acc}
            onChange={(e) => setAcc(Number(e.target.value))}
            type="number"
            min={0}
            max={100}
            style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "white" }}
          />
        </div>
        <div className="stat">
          <div className="muted">Зорилтот хугацаа (сек)</div>
          <input
            value={sec}
            onChange={(e) => setSec(Number(e.target.value))}
            type="number"
            min={1}
            style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "white" }}
          />
        </div>
        <div className="stat">
          <div className="muted">Тайлбар</div>
          <div style={{ marginTop: 6 }}>
            Таны хугацаа хурдан байх тусам сайн (Δ хугацаа +).<br />
            Таны зөв хувь өндөр байх тусам сайн (Δ хувь +).
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={save}>Хадгалах</button>
        <Link className="btn ghost" href="/">Нүүр</Link>
      </div>
    </div>
  );
}
