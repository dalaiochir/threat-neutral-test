"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TwoChoiceCard from "../../components/TwoChoiceCard";
import { NEUTRAL_QUESTIONS, THREAT_QUESTIONS } from "../../lib/questions";
import styles from "../../styles/Test.module.css";

type Stage = "threat" | "neutral";

export default function TestPage() {
  const router = useRouter();

  const stages = useMemo(() => {
    return [
      { key: "threat" as Stage, title: "1-р үе шат: Занал үг" , questions: THREAT_QUESTIONS },
      { key: "neutral" as Stage, title: "2-р үе шат: Энгийн үг", questions: NEUTRAL_QUESTIONS },
    ];
  }, []);

  const totalQuestions = stages.reduce((acc, s) => acc + s.questions.length, 0);

  const [stageIndex, setStageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [locked, setLocked] = useState(false);

  const [threatCorrect, setThreatCorrect] = useState(0);
  const [neutralCorrect, setNeutralCorrect] = useState(0);

  const startedAtRef = useRef<number | null>(null);

  const stage = stages[stageIndex];
  const q = stage.questions[qIndex];

  const answeredCount =
    stages.slice(0, stageIndex).reduce((acc, s) => acc + s.questions.length, 0) + qIndex;

  const onPick = (side: "left" | "right") => {
    if (locked) return;

    if (startedAtRef.current === null) startedAtRef.current = performance.now();

    setSelected(side);
    setLocked(true);

    const isCorrect = side === q.correct;
    if (stage.key === "threat" && isCorrect) setThreatCorrect((v) => v + 1);
    if (stage.key === "neutral" && isCorrect) setNeutralCorrect((v) => v + 1);
  };

  const goNext = () => {
    // next question within stage
    if (qIndex + 1 < stage.questions.length) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setLocked(false);
      return;
    }

    // next stage
    if (stageIndex + 1 < stages.length) {
      setStageIndex(stageIndex + 1);
      setQIndex(0);
      setSelected(null);
      setLocked(false);
      return;
    }

    // finish
    const ended = performance.now();
    const started = startedAtRef.current ?? ended; // if no answers, 0
    const totalMs = Math.max(0, Math.round(ended - started));

    const threatTotal = THREAT_QUESTIONS.length;
    const neutralTotal = NEUTRAL_QUESTIONS.length;
    const overallCorrect = threatCorrect + neutralCorrect;
    const overallTotal = threatTotal + neutralTotal;
    const accuracyPct = overallTotal ? Math.round((overallCorrect / overallTotal) * 100) : 0;

    const attempt = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      totalMs,
      threat: { correct: threatCorrect, total: threatTotal },
      neutral: { correct: neutralCorrect, total: neutralTotal },
      overall: { correct: overallCorrect, total: overallTotal, accuracyPct },
    };

    sessionStorage.setItem("mk_last_attempt_v1", JSON.stringify(attempt));
    router.push("/result");
  };

  if (!q) {
    return (
      <div className="card">
        <h1>Асуулт олдсонгүй</h1>
        <p>questions.ts доторх өгөгдлөө шалгана уу.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className={styles.topRow}>
        <h1>{stage.title}</h1>
        <div className={styles.progress}>
          {answeredCount}/{totalQuestions}
        </div>
      </div>

      <p className={styles.prompt}>{q.prompt}</p>

      <TwoChoiceCard
        leftSrc={q.leftImage}
        rightSrc={q.rightImage}
        disabled={locked}
        selected={selected}
        correct={locked ? q.correct : null}
        onPick={onPick}
      />

      <div className={styles.footer}>
        {!locked ? (
          <div className={styles.hint}>Нэгийг сонгоно уу.</div>
        ) : (
          <div className={styles.feedback}>
            {selected === q.correct ? "✅ Зөв!" : "❌ Буруу. Зөв хариулт тодорсон."}
          </div>
        )}

        <button className="btn primary" onClick={goNext} disabled={!locked}>
          {stageIndex === stages.length - 1 && qIndex === stage.questions.length - 1
            ? "Дуусгах"
            : "Дараах"}
        </button>
      </div>
    </div>
  );
}
