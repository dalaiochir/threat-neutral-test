"use client";

import Link from "next/link";

export function ProgressHeader(props: {
  stage: 1 | 2;
  index: number; // 0-based
  total: number;
  elapsedMs: number;
}) {
  const sec = Math.floor(props.elapsedMs / 1000);
  return (
    <div className="topbar">
      <div>
        <div className="title">2 үе шаттай тест</div>
        <div className="muted">
          Үе шат {props.stage}/2 • Асуулт {props.index + 1}/{props.total}
        </div>
      </div>

      <div className="right">
        <div className="time">{sec}s</div>
        <Link className="link" href="/">Нүүр</Link>
      </div>
    </div>
  );
}
