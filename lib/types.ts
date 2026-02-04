export type Stage = 1 | 2;

export type Trial = {
  id: string;
  threatWord: string;
  neutralWord: string;
  threatImg: string;  // /images/....
  neutralImg: string; // /images/....
};

export type Benchmark = {
  targetAccuracyPct: number; // 0-100
  targetTimeMs: number;
};

export type TestResult = {
  id: string;
  createdAtIso: string;

  totalTimeMs: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracyPct: number;

  stage1Correct: number;
  stage1Questions: number;
  stage2Correct: number;
  stage2Questions: number;

  // харьцуулалт
  benchmarkAccuracyPct: number;
  benchmarkTimeMs: number;
  deltaAccuracyPct: number; // result - benchmark
  deltaTimeMs: number;      // benchmark - result (эерэг байвал та хурдан)
};
