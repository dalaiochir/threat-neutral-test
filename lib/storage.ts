export type TestResult = {
  id: string;
  createdAt: string; // ISO
  totalMs: number;
  accuracy: number; // 0..1
  correct: number;
  total: number;
  stageBreakdown: {
    threat: { correct: number; total: number };
    neutral: { correct: number; total: number };
  };
};

export type Baseline = {
  accuracy: number; // 0..1
  totalMs: number;
};

const KEY_HISTORY = "mk_test_history_v1";
const KEY_BASELINE = "mk_test_baseline_v1";

export function loadHistory(): TestResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY_HISTORY);
  if (!raw) return [];
  try { return JSON.parse(raw) as TestResult[]; } catch { return []; }
}

export function saveHistory(items: TestResult[]) {
  localStorage.setItem(KEY_HISTORY, JSON.stringify(items));
}

export function addHistory(result: TestResult) {
  const items = loadHistory();
  items.unshift(result);
  saveHistory(items);
}

export function loadBaseline(): Baseline | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_BASELINE);
  if (!raw) return null;
  try { return JSON.parse(raw) as Baseline; } catch { return null; }
}

export function saveBaseline(b: Baseline) {
  localStorage.setItem(KEY_BASELINE, JSON.stringify(b));
}
