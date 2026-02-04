import type { Question } from "./types";
import manifest from "./generated/imageManifest.json";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pairing rule:
 * - 1 threat image + 1 neutral image = 1 question-pair base
 * - Left/right position randomized per question
 * - We generate two sets:
 *   - Threat stage questions: correct side = where threat is
 *   - Neutral stage questions: correct side = where neutral is
 */
export function buildTwoStageQuestions() {
  const threat = shuffle(manifest.threat ?? []);
  const neutral = shuffle(manifest.neutral ?? []);

  const pairCount = Math.min(threat.length, neutral.length);

  const threatQuestions: Question[] = [];
  const neutralQuestions: Question[] = [];

  for (let i = 0; i < pairCount; i++) {
    const tImg = threat[i];
    const nImg = neutral[i];

    // randomize placement
    const threatOnLeft = Math.random() < 0.5;

    const leftImage = threatOnLeft ? tImg : nImg;
    const rightImage = threatOnLeft ? nImg : tImg;

    // stage1: pick THREAT
    threatQuestions.push({
      id: `threat_${i + 1}`,
      stage: "threat",
      prompt: "Занал хийсэн утгатай үгийг ол",
      leftImage,
      rightImage,
      correct: threatOnLeft ? "left" : "right",
    });

    // stage2: pick NEUTRAL (same images, same positions, but correct flips)
    neutralQuestions.push({
      id: `neutral_${i + 1}`,
      stage: "neutral",
      prompt: "Энгийн утгатай үгийг ол",
      leftImage,
      rightImage,
      correct: threatOnLeft ? "right" : "left",
    });
  }

  return { threatQuestions, neutralQuestions, pairCount };
}
