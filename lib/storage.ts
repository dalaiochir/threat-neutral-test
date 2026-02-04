import { Benchmark, TestResult } from "./types";
import { DEFAULT_BENCHMARK } from "./data";

const HISTORY_KEY = "tn_history_v1";
const BENCH_KEY = "tn_benchmark_v1";

export function loadHistory(): TestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TestResult[];
  } catch {
    return [];
  }
}

export function saveHistory(items: TestResult[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function addToHistory(item: TestResult) {
  const list = loadHistory();
  list.unshift(item);
  saveHistory(list.slice(0, 100)); // хамгийн ихдээ 100 бичлэг
}

export function loadBenchmark(): Benchmark {
  if (typeof window === "undefined") return DEFAULT_BENCHMARK;
  try {
    const raw = localStorage.getItem(BENCH_KEY);
    if (!raw) return DEFAULT_BENCHMARK;
    return JSON.parse(raw) as Benchmark;
  } catch {
    return DEFAULT_BENCHMARK;
  }
}

export function saveBenchmark(b: Benchmark) {
  localStorage.setItem(BENCH_KEY, JSON.stringify(b));
}
