import { Trial } from "./types";

export const TRIALS: Trial[] = [
  {
    id: "t1",
    threatWord: "Алуурчин",
    neutralWord: "Ном",
    threatImg: "/images/threat-1.png",
    neutralImg: "/images/neutral-1.png",
  },
  {
    id: "t2",
    threatWord: "Занал",
    neutralWord: "Цэцэг",
    threatImg: "/images/threat-2.png",
    neutralImg: "/images/neutral-2.png",
  },
  {
    id: "t3",
    threatWord: "Дайралт",
    neutralWord: "Аяга",
    threatImg: "/images/threat-3.png",
    neutralImg: "/images/neutral-3.png",
  },
  {
    id: "t4",
    threatWord: "Хөнөө",
    neutralWord: "Дэвтэр",
    threatImg: "/images/threat-4.png",
    neutralImg: "/images/neutral-4.png",
  },
  {
    id: "t5",
    threatWord: "Зод",
    neutralWord: "Сандал",
    threatImg: "/images/threat-5.png",
    neutralImg: "/images/neutral-5.png",
  },
];

export const DEFAULT_BENCHMARK = {
  targetAccuracyPct: 90,
  targetTimeMs: 60_000, // 60 секунд
};
