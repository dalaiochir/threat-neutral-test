"use client";

import { useEffect, useState } from "react";
import { loadHistory } from "@/lib/storage";
import { TestResult } from "@/lib/types";
import { HistoryTable } from "@/components/HistoryTable";

export default function HistoryPage() {
  const [items, setItems] = useState<TestResult[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  return <HistoryTable items={items} />;
}
