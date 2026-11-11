import { artifacts } from './data';
import { colorDistance, matchScore, mixColors } from './challenge';
import type { Artifact } from './types';

export const LEVEL_COUNT = 15;
export const PALETTE_SIZE = 16;

export interface ColorRound {
  level: number;
  palette: Artifact[];
  answerIds: string[];
  target: string;
}

export interface RoundResult {
  level: number;
  target: string;
  mixed: string;
  similarity: number;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createRound(level: number, random = Math.random): ColorRound {
  if (!Number.isInteger(level) || level < 1 || level > LEVEL_COUNT) {
    throw new RangeError('Level must be between 1 and 15.');
  }

  const pool = shuffle(artifacts, random);
  const answer = pool.slice(0, level);
  let remaining = pool.slice(level);
  const distractorCount = PALETTE_SIZE - level;

  // Later rounds draw distractors from the colors nearest to an answer color.
  // Keep every object's original color; only the choice of objects changes.
  if (level >= 6) {
    const proximity = (artifact: Artifact) => Math.min(
      ...answer.map(candidate => colorDistance(artifact.hex, candidate.hex)),
    );
    remaining.sort((a, b) => proximity(a) - proximity(b));
    const candidateCount = Math.max(distractorCount, Math.ceil(remaining.length * (1 - level / 20)));
    remaining = shuffle(remaining.slice(0, candidateCount), random);
  }

  return {
    level,
    palette: shuffle([...answer, ...remaining.slice(0, distractorCount)], random),
    answerIds: answer.map(artifact => artifact.id),
    target: mixColors(answer.map(artifact => artifact.hex)),
  };
}

export function toggleArtifact(round: ColorRound, selected: string[], id: string): string[] {
  if (!round.palette.some(artifact => artifact.id === id)) return selected;
  if (selected.includes(id)) return selected.filter(candidate => candidate !== id);
  if (selected.length >= round.level) return selected;
  return [...selected, id];
}

export function selectedColor(round: ColorRound, selected: string[]): string {
  return mixColors(round.palette.filter(artifact => selected.includes(artifact.id)).map(artifact => artifact.hex));
}

export function checkRound(round: ColorRound, selected: string[]): RoundResult | null {
  if (selected.length !== round.level || new Set(selected).size !== round.level) return null;
  if (selected.some(id => !round.palette.some(artifact => artifact.id === id))) return null;
  const mixed = selectedColor(round, selected);
  return { level: round.level, target: round.target, mixed, similarity: matchScore(mixed, round.target, 1) };
}
