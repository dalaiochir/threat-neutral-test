"use client";

import Image from "next/image";
import styles from "../styles/Cards.module.css";

type Props = {
  leftSrc: string;
  rightSrc: string;
  disabled?: boolean;
  selected?: "left" | "right" | null;
  correct?: "left" | "right" | null;
  onPick: (side: "left" | "right") => void;
};

export default function TwoChoiceCard({
  leftSrc,
  rightSrc,
  disabled,
  selected,
  correct,
  onPick,
}: Props) {
  const boxClass = (side: "left" | "right") => {
    const base = styles.choice;
    if (!selected || !correct) return base;

    const isCorrect = correct === side;
    const isSelected = selected === side;

    if (isCorrect) return `${base} ${styles.correct}`;
    if (isSelected && !isCorrect) return `${base} ${styles.wrong}`;
    return `${base} ${styles.dim}`;
  };

  return (
    <div className={styles.grid}>
      <button className={boxClass("left")} onClick={() => onPick("left")} disabled={disabled}>
        <Image src={leftSrc} alt="left option" width={520} height={320} className={styles.img} />
      </button>

      <button className={boxClass("right")} onClick={() => onPick("right")} disabled={disabled}>
        <Image src={rightSrc} alt="right option" width={520} height={320} className={styles.img} />
      </button>
    </div>
  );
}
