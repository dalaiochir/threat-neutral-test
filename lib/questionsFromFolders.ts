import type { Question, StageType } from "./types";
import manifest from "./generated/imageManifest.json";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunkPairs(images: string[]) {
  // 2 зураг = 1 асуулт (pair)
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i + 1 < images.length; i += 2) {
    pairs.push([images[i], images[i + 1]]);
  }
  return pairs;
}

function buildStageQuestions(stage: StageType, images: string[], prompt: string): Question[] {
  const shuffled = shuffle(images);
  const pairs = chunkPairs(shuffled);

  return pairs.map(([left, right], idx) => {
    const correct = Math.random() < 0.5 ? "left" : "right"; // зөв тал random
    return {
      id: `${stage}_${idx + 1}`,
      stage,
      prompt,
      leftImage: left,
      rightImage: right,
      correct,
    };
  });
}

export function getThreatQuestions(): Question[] {
  return buildStageQuestions(
    "threat",
    manifest.threat ?? [],
    "Занал хийсэн утгатай үгийг ол"
  );
}

export function getNeutralQuestions(): Question[] {
  return buildStageQuestions(
    "neutral",
    manifest.neutral ?? [],
    "Энгийн утгатай үгийг ол"
  );
}
