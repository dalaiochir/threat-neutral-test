"use client";

import Image from "next/image";
import styles from "../styles/Cards.module.css";

type Props = {
  leftSrc: string;
  rightSrc: string;
  disabled?: boolean;
  onPick: (side: "left" | "right") => void;
};

export default function TwoChoiceCard({ leftSrc, rightSrc, disabled, onPick }: Props) {
  return (
    <div className={styles.grid}>
      <button className={styles.choice} onClick={() => onPick("left")} disabled={disabled}>
        <Image src={leftSrc} alt="left option" width={520} height={320} className={styles.img} />
      </button>

      <button className={styles.choice} onClick={() => onPick("right")} disabled={disabled}>
        <Image src={rightSrc} alt="right option" width={520} height={320} className={styles.img} />
      </button>
    </div>
  );
}
