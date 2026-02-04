"use client";

import styles from "./ChoiceCard.module.css";

export default function ChoiceCard(props: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  state?: "idle" | "correct" | "wrong" | "reveal";
}) {
  const { label, onClick, disabled, state = "idle" } = props;
  return (
    <button
      className={`${styles.card} ${styles[state]}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={label}
    >
      <div className={styles.word}>{label}</div>
    </button>
  );
}
