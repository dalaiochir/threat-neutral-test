"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { THREAT_WORDS, NEUTRAL_WORDS } from "@/data/words";
import ChoiceCard from "@/components/ChoiceCard";
import ProgressBar from "@/components/ProgressBar";
import { buildRounds, Round } from "@/lib/quiz";
import { addHistory, TestResult } from "@/lib/storage";

import styles from "./test.module.css";

type PickState = {
  pickedId: string | null;
  revealed: boolean;
};

type TransitionState = null | { title: string; subtitle?: string };

export default function TestPage() {
  const router = useRouter();

  const rounds: Round[] = useMemo(
    () =>
      buildRounds({
        threatWords: THREAT_WORDS,
        neutralWords: NEUTRAL_WORDS,
        perStage: 5, // хүсвэл өөрчил
      }),
    []
  );

  const threatTotal = useMemo(
    () => rounds.filter((x) => x.stage === "THREAT").length,
    [rounds]
  );
  const neutralTotal = useMemo(
    () => rounds.filter((x) => x.stage === "NEUTRAL").length,
    [rounds]
  );

  const stage1EndIndex = threatTotal - 1;

  const [i, setI] = useState(0);
  const [pick, setPick] = useState<PickState>({ pickedId: null, revealed: false });
  const [transition, setTransition] = useState<TransitionState>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [threatCorrect, setThreatCorrect] = useState(0);
  const [neutralCorrect, setNeutralCorrect] = useState(0);

  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  const total = rounds.length;
  const r = rounds[i];

  function handlePick(chosenId: string) {
    if (!r) return;
    if (pick.revealed) return;
    if (transition) return;

    const isCorrect = chosenId === r.correctId;

    // reveal
    setPick({ pickedId: chosenId, revealed: true });

    // counters update
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      if (r.stage === "THREAT") setThreatCorrect((c) => c + 1);
      if (r.stage === "NEUTRAL") setNeutralCorrect((c) => c + 1);
    }

    // after reveal -> next
    window.setTimeout(() => {
      const nextIndex = i + 1;

      // still has more rounds
      if (nextIndex < total) {
        // Stage 1 -> Stage 2 transition (exact boundary)
        if (i === stage1EndIndex) {
          setTransition({
            title: "Stage 1 дууслаа",
            subtitle: "Stage 2: Энгийн (нейтраль) утгатай үгийг олох гэж байна",
          });

          // reset pick immediately so next stage starts clean
          setPick({ pickedId: null, revealed: false });

          window.setTimeout(() => {
            setTransition(null);
            setI(nextIndex);
          }, 1200);

          return;
        }

        // normal next question
        setI(nextIndex);
        setPick({ pickedId: null, revealed: false });
        return;
      }

      // finish
      const end = performance.now();
      const totalMs = Math.max(0, Math.round(end - startRef.current));

      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;

      const finalThreatCorrect =
        r.stage === "THREAT" && isCorrect ? threatCorrect + 1 : threatCorrect;

      const finalNeutralCorrect =
        r.stage === "NEUTRAL" && isCorrect ? neutralCorrect + 1 : neutralCorrect;

      const result: TestResult = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        totalMs,
        correct: finalCorrect,
        total,
        accuracy: total > 0 ? finalCorrect / total : 0,
        stageBreakdown: {
          threat: { correct: finalThreatCorrect, total: threatTotal },
          neutral: { correct: finalNeutralCorrect, total: neutralTotal },
        },
      };

      addHistory(result);
      sessionStorage.setItem("mk_last_result_v1", JSON.stringify(result));
      router.push("/result");
    }, 800);
  }

  if (!r) {
    return (
      <main className={styles.wrap}>
        <h1 className={styles.h1}>Тест</h1>
        <p className={styles.prompt}>Асуулт олдсонгүй. Датагаа шалгана уу.</p>
      </main>
    );
  }

  const isStage1 = i <= stage1EndIndex;
  const stageLabel = isStage1 ? "Stage 1/2" : "Stage 2/2";

  const leftState =
    !pick.revealed
      ? "idle"
      : r.left.id === r.correctId
      ? "correct"
      : pick.pickedId === r.left.id
      ? "wrong"
      : "idle";

  const rightState =
    !pick.revealed
      ? "idle"
      : r.right.id === r.correctId
      ? "correct"
      : pick.pickedId === r.right.id
      ? "wrong"
      : "idle";

  return (
    <main className={styles.wrap}>
      {transition && (
        <div className={styles.overlay} role="dialog" aria-live="polite">
          <div className={styles.overlayCard}>
            <div className={styles.overlayTitle}>{transition.title}</div>
            {transition.subtitle && (
              <div className={styles.overlaySubtitle}>{transition.subtitle}</div>
            )}
            <div className={styles.overlayHint}>Түр хүлээнэ үү…</div>
          </div>
        </div>
      )}

      <div className={styles.top}>
        <div>
          <h1 className={styles.h1}>Тест</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.85 }}>
            <span>{stageLabel}</span>
            <span>•</span>
            <span>
              Асуулт: {i + 1}/{total}
            </span>
            <span>•</span>
            <span>Зөв: {correctCount}</span>
          </div>
        </div>
      </div>

      <div style={{ margin: "12px 0 10px" }}>
        <ProgressBar value={i} max={total} />
      </div>

      <p className={styles.prompt}>{r.prompt}</p>

      <div className={styles.grid}>
        <ChoiceCard
          label={r.left.word}
          disabled={pick.revealed || !!transition}
          state={leftState as any}
          onClick={() => handlePick(r.left.id)}
        />
        <ChoiceCard
          label={r.right.word}
          disabled={pick.revealed || !!transition}
          state={rightState as any}
          onClick={() => handlePick(r.right.id)}
        />
      </div>

      {pick.revealed && (
        <div className={styles.feedback}>
          {pick.pickedId === r.correctId ? "✅ Зөв!" : "❌ Буруу."} Зөв хариулт:{" "}
          <b>{r.correctId === r.left.id ? r.left.word : r.right.word}</b>
        </div>
      )}
    </main>
  );
}
