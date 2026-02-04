"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Choice = {
  key: "A" | "B";
  word: string;
  img: string;
  isCorrect: boolean;
};

export function TwoChoiceRound(props: {
  prompt: string;
  leftWord: string;
  leftImg: string;
  rightWord: string;
  rightImg: string;
  correctSide: "left" | "right";
  onAnswered: (correct: boolean) => void;
}) {
  const choices = useMemo<Choice[]>(() => {
    const leftCorrect = props.correctSide === "left";
    return [
      { key: "A", word: props.leftWord, img: props.leftImg, isCorrect: leftCorrect },
      { key: "B", word: props.rightWord, img: props.rightImg, isCorrect: !leftCorrect },
    ];
  }, [props]);

  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  const clickChoice = (c: Choice) => {
    if (picked) return;
    setPicked(c.key);
    props.onAnswered(c.isCorrect);
  };

  return (
    <div className="card">
      <div className="prompt">{props.prompt}</div>

      <div className="grid2">
        {choices.map((c) => {
          const state =
            picked === null
              ? ""
              : c.key === picked
              ? c.isCorrect
                ? "pickedCorrect"
                : "pickedWrong"
              : c.isCorrect
              ? "theCorrectOne"
              : "notPicked";

          return (
            <button
              key={c.key}
              className={`choice ${state}`}
              onClick={() => clickChoice(c)}
            >
              <div className="imgWrap">
                <Image
                  src={c.img}
                  alt={c.word}
                  width={420}
                  height={260}
                  className="img"
                />
              </div>
              <div className="word">{c.word}</div>
              <div className="hint">Сонгох</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="feedback">
          {choices.find((x) => x.key === picked)?.isCorrect ? "✅ Зөв!" : "❌ Буруу"}
          <span className="muted"> — зөв хариулт ногооноор тодорсон.</span>
        </div>
      )}
    </div>
  );
}
