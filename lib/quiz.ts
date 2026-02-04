import { WordItem } from "@/data/words";

export type StageType = "THREAT" | "NEUTRAL";

export type Round = {
  stage: StageType;
  prompt: string; // жишээ: "Заналхийлсэн үгийг сонго"
  left: WordItem;
  right: WordItem;
  correctId: string;
};

export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRounds(params: {
  threatWords: WordItem[];
  neutralWords: WordItem[];
  perStage: number; // нэг stage-д хэдэн асуулт
}): Round[] {
  const { threatWords, neutralWords, perStage } = params;

  const t = shuffle(threatWords).slice(0, perStage);
  const n = shuffle(neutralWords).slice(0, perStage);

  const stage1: Round[] = t.map((tw, idx) => {
    const distractor = n[idx % n.length];
    const pair = shuffle([tw, distractor]);
    return {
      stage: "THREAT",
      prompt: "Заналхийлсэн утгатай үгийг сонгоно уу",
      left: pair[0],
      right: pair[1],
      correctId: tw.id,
    };
  });

  const stage2: Round[] = n.map((nw, idx) => {
    const distractor = t[idx % t.length];
    const pair = shuffle([nw, distractor]);
    return {
      stage: "NEUTRAL",
      prompt: "Энгийн утгатай үгийг сонгоно уу",
      left: pair[0],
      right: pair[1],
      correctId: nw.id,
    };
  });

  return [...stage1, ...stage2];
}
