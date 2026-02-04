"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TwoChoiceCard from "../../components/TwoChoiceCard";
import { NEUTRAL_QUESTIONS, THREAT_QUESTIONS } from "../../lib/questions";
import { shuffle } from "../../lib/scoring";
import styles from "../../styles/Test.module.css";

type Stage = "threat" | "neutral";

export default function TestPage() {
  const router = useRouter();

  // ✅ Threat болон Neutral тус тусдаа random (shuffle)
  const stages = useMemo(() => {
    const threatRandom = shuffle(THREAT_QUESTIONS);
    const neutralRandom = shuffle(NEUTRAL_QUESTIONS);

    return [
      { key: "threat" as Stage, title: "1-р үе шат: Занал үг", questions: threatRandom },
      { key: "neutral" as Stage, title: "2-р үе шат: Энгийн үг", questions: neutralRandom },
    ];
  }, []);

  const totalQuestions = useMemo(
    () => stages.reduce((acc, s) => acc + s.questions.length, 0),
    [stages]
  );

  const [stageIndex, setStageIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  const [threatCorrect, setThreatCorrect] = useState(0);
  const [neutralCorrect, setNeutralCorrect] = useState(0);

  const startedAtRef = useRef<number | null>(null);

  const stage = stages[stageIndex];
  const q = stage?.questions?.[qIndex];

  const answeredCount =
    stages.slice(0, stageIndex).reduce((acc, s) => acc + s.questions.length, 0) + qIndex;

  const finishTest = () => {
    const ended = performance.now();
    const started = startedAtRef.current ?? ended;
    const totalMs = Math.max(0, Math.round(ended - started));

    const threatTotal = stages[0]?.questions.length ?? 0;
    const neutralTotal = stages[1]?.questions.length ?? 0;

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

  const goNext = () => {
    // next question within stage
    if (qIndex + 1 < stage.questions.length) {
      setQIndex(qIndex + 1);
      return;
    }

    // next stage
    if (stageIndex + 1 < stages.length) {
      setStageIndex(stageIndex + 1);
      setQIndex(0);
      return;
    }

    // finish
    finishTest();
  };

  // ✅ Дармагц шууд next
  const onPick = (side: "left" | "right") => {
    if (!q) return;

    if (startedAtRef.current === null) startedAtRef.current = performance.now();

    const isCorrect = side === q.correct;
    if (stage.key === "threat" && isCorrect) setThreatCorrect((v) => v + 1);
    if (stage.key === "neutral" && isCorrect) setNeutralCorrect((v) => v + 1);

    // ✅ Шууд дараагийн асуулт руу
    goNext();
  };

  if (!q) {
    return (
      <div className="card">
        <h1>Асуулт олдсонгүй</h1>
        <p>lib/questions.ts доторх асуултууд/зурагны замаа шалгана уу.</p>
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
        disabled={false}
        onPick={onPick}
      />

      {/* Одоо feedback/Next button хэрэггүй, учир нь шууд шилжинэ */}
    </div>
  );
}
