"use client";

import { useEffect, useMemo, useState } from "react";
import { Baseline, loadBaseline, saveBaseline, loadHistory, TestResult } from "@/lib/storage";
import Link from "next/link";
import styles from "./result.module.css";

function fmtMs(ms: number) {
  const sec = Math.round(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ResultPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [baseline, setBaseline] = useState<Baseline | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("mk_last_result_v1");
    if (raw) setResult(JSON.parse(raw));
    setBaseline(loadBaseline());
  }, []);

  const personalBest = useMemo(() => {
    const h = loadHistory();
    if (!h.length) return null;
    // “best” гэдгийг accuracy өндөр, тэнцвэл хугацаа бага гэж үзэв
    return [...h].sort((a, b) => (b.accuracy - a.accuracy) || (a.totalMs - b.totalMs))[0];
  }, []);

  if (!result) {
    return (
      <main className={styles.wrap}>
        <h1>Үр дүн олдсонгүй</h1>
        <Link href="/">Нүүр</Link>
      </main>
    );
  }

  const setAsBaseline = () => {
    saveBaseline({ accuracy: result.accuracy, totalMs: result.totalMs });
    setBaseline({ accuracy: result.accuracy, totalMs: result.totalMs });
  };

  return (
    <main className={styles.wrap}>
      <h1 className={styles.h1}>Үр дүн</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.label}>Нийт хугацаа</div>
          <div className={styles.value}>{fmtMs(result.totalMs)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Зөв хувь</div>
          <div className={styles.value}>{Math.round(result.accuracy * 100)}%</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Stage 1 (Занал)</div>
          <div className={styles.value}>
            {result.stageBreakdown.threat.correct}/{result.stageBreakdown.threat.total}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Stage 2 (Энгийн)</div>
          <div className={styles.value}>
            {result.stageBreakdown.neutral.correct}/{result.stageBreakdown.neutral.total}
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.h2}>Харьцуулалт</h2>

        <div className={styles.compare}>
          <div className={styles.row}>
            <span>Baseline</span>
            {baseline ? (
              <b>
                {Math.round(baseline.accuracy * 100)}% · {fmtMs(baseline.totalMs)}
              </b>
            ) : (
              <i>Тохируулаагүй</i>
            )}
          </div>

          <div className={styles.row}>
            <span>Personal Best</span>
            {personalBest ? (
              <b>
                {Math.round(personalBest.accuracy * 100)}% · {fmtMs(personalBest.totalMs)}
              </b>
            ) : (
              <i>Одоохондоо байхгүй</i>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} onClick={setAsBaseline} type="button">
            Энэ үр дүнг Baseline болгох
          </button>
          <Link className={styles.linkBtn} href="/test">Дахин тест өгөх</Link>
          <Link className={styles.linkBtn} href="/history">Түүх харах</Link>
        </div>
      </section>
    </main>
  );
}
