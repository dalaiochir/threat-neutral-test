"use client";

import { useEffect, useState } from "react";
import { TestResult } from "@/lib/types";
import { ResultSummary } from "@/components/ResultSummary";
import Link from "next/link";

export default function ResultPage() {
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("tn_last_result_v1");
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="card">
        <div className="title">Үр дүн олдсонгүй</div>
        <div className="actions">
          <Link className="btn" href="/test">Тест эхлэх</Link>
          <Link className="btn ghost" href="/">Нүүр</Link>
        </div>
      </div>
    );
  }

  return <ResultSummary result={result} />;
}
