"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TRIALS } from "@/lib/data";
import { addToHistory, loadBenchmark } from "@/lib/storage";
import { Benchmark, Stage, TestResult, Trial } from "@/lib/types";
import { ProgressHeader } from "@/components/ProgressHeader";
import { TwoChoiceRound } from "@/components/TwoChoiceRound";
import { useRouter } from "next/navigation";

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
}

export default function TestPage() {
  const router = useRouter();

  const trials = useMemo(() => {
    // shuffle
    const copy = [...TRIALS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);

  const [stage, setStage] = useState<Stage>(1);
  const [index, setIndex] = useState(0);

  const [stage1Correct, setStage1Correct] = useState(0);
  const [stage2Correct, setStage2Correct] = useState(0);

  const [locked, setLocked] = useState(false);

  const startMsRef = useRef<number>(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setBenchmark(loadBenchmark());
    startMsRef.current = performance.now();
    const t = window.setInterval(() => {
      setElapsedMs(performance.now() - startMsRef.current);
    }, 200);
    return () => window.clearInterval(t);
  }, []);

  const totalPerStage = trials.length;
  const current: Trial = trials[index];

  const prompt =
    stage === 1
      ? "Заналхийлсэн (занал хийлсэн) утгатай үгийг сонгоно уу."
      : "Энгийн (нейтрал) утгатай үгийг сонгоно уу.";

  // 2 “зураг” байрлал санамсаргүй солигдоно
  const layout = useMemo(() => {
    const threatOnLeft = Math.random() < 0.5;
    if (threatOnLeft) {
      return {
        leftWord: current.threatWord,
        leftImg: current.threatImg,
        rightWord: current.neutralWord,
        rightImg: current.neutralImg,
        correctSide: stage === 1 ? ("left" as const) : ("right" as const),
      };
    }
    return {
      leftWord: current.neutralWord,
      leftImg: current.neutralImg,
      rightWord: current.threatWord,
      rightImg: current.threatImg,
      correctSide: stage === 1 ? ("right" as const) : ("left" as const),
    };
  }, [current, stage, index]);

  const totalQuestions = totalPerStage * 2;

  const finish = () => {
    const endMs = performance.now();
    const totalTimeMs = Math.max(0, Math.round(endMs - startMsRef.current));

    const totalCorrect = stage1Correct + stage2Correct;
    const accuracyPct = (totalCorrect / totalQuestions) * 100;

    const b = benchmark ?? loadBenchmark();
    const deltaAccuracyPct = accuracyPct - b.targetAccuracyPct;
    const deltaTimeMs = b.targetTimeMs - totalTimeMs;

    const result: TestResult = {
      id: uuid(),
      createdAtIso: new Date().toISOString(),

      totalTimeMs,
      totalCorrect,
      totalQuestions,
      accuracyPct,

      stage1Correct,
      stage1Questions: totalPerStage,
      stage2Correct,
      stage2Questions: totalPerStage,

      benchmarkAccuracyPct: b.targetAccuracyPct,
      benchmarkTimeMs: b.targetTimeMs,
      deltaAccuracyPct,
      deltaTimeMs,
    };

    addToHistory(result);
    sessionStorage.setItem("tn_last_result_v1", JSON.stringify(result));
    router.push("/result");
  };

  const onAnswered = (correct: boolean) => {
    if (locked) return;
    setLocked(true);

    if (stage === 1) setStage1Correct((x) => x + (correct ? 1 : 0));
    else setStage2Correct((x) => x + (correct ? 1 : 0));

    // feedback харагдаад дараагийн үг рүү шилжинэ
    window.setTimeout(() => {
      setLocked(false);

      const isLastInStage = index === trials.length - 1;

      if (!isLastInStage) {
        setIndex((x) => x + 1);
        return;
      }

      // stage дууссан
      if (stage === 1) {
        setStage(2);
        setIndex(0);
        return;
      }

      // stage2 дууссан => finalize
      finish();
    }, 850);
  };

  if (!benchmark) {
    return <div className="card">Ачааллаж байна…</div>;
  }

  return (
    <div>
      <ProgressHeader stage={stage} index={index} total={trials.length} elapsedMs={elapsedMs} />
      <TwoChoiceRound
        prompt={prompt}
        leftWord={layout.leftWord}
        leftImg={layout.leftImg}
        rightWord={layout.rightWord}
        rightImg={layout.rightImg}
        correctSide={layout.correctSide}
        onAnswered={onAnswered}
      />
      <div className="muted" style={{ marginTop: 10 }}>
        Зөв: {stage1Correct + stage2Correct} / {totalQuestions}
      </div>
    </div>
  );
}
