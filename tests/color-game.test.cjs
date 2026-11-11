const { test } = require('node:test');
const assert = require('node:assert/strict');
const { join } = require('node:path');
const { createRound, toggleArtifact, checkRound, LEVEL_COUNT } = require(join(process.env.COLOR_GAME_BUILD, 'color-game.js'));
const { artifacts } = require(join(process.env.COLOR_GAME_BUILD, 'data.js'));
const { colorDistance, mixColors, matchScore } = require(join(process.env.COLOR_GAME_BUILD, 'challenge.js'));

function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

test('all 15 levels have 16 distinct original objects and an exact, available answer', () => {
  const originals = JSON.stringify(artifacts);
  for (let seed = 1; seed <= 50; seed++) {
    for (let level = 1; level <= LEVEL_COUNT; level++) {
      const round = createRound(level, seeded(seed * 97 + level));
      assert.equal(round.palette.length, 16);
      assert.equal(new Set(round.palette.map(a => a.id)).size, 16);
      assert.equal(round.answerIds.length, level);
      assert.equal(new Set(round.answerIds).size, level);
      assert.ok(round.palette.length > round.answerIds.length);
      round.palette.forEach(a => assert.deepEqual(a, artifacts.find(original => original.id === a.id)));
      assert.ok(round.answerIds.every(id => round.palette.some(a => a.id === id)));
      assert.equal(checkRound(round, round.answerIds).similarity, 100);
      assert.equal(round.target, mixColors(round.palette.filter(a => round.answerIds.includes(a.id)).map(a => a.hex)));
    }
  }
  assert.equal(JSON.stringify(artifacts), originals);
});

test('new seeds change the palette and do not expose answers in a fixed card position', () => {
  const rounds = Array.from({ length: 20 }, (_, index) => createRound(1, seeded(index + 1)));
  assert.ok(new Set(rounds.map(r => r.palette.map(a => a.id).join(','))).size > 15);
  assert.ok(new Set(rounds.map(r => r.palette.findIndex(a => a.id === r.answerIds[0]))).size > 5);
});

test('selection limits track each level, and selected cards can always be removed', () => {
  for (let level = 1; level <= 15; level++) {
    const round = createRound(level, seeded(level));
    let selected = [];
    for (const artifact of round.palette) selected = toggleArtifact(round, selected, artifact.id);
    assert.equal(selected.length, level);
    assert.equal(checkRound(round, selected).level, level);
    const removed = selected[0];
    selected = toggleArtifact(round, selected, removed);
    assert.equal(selected.length, level - 1);
    assert.equal(checkRound(round, selected), null);
    assert.deepEqual(toggleArtifact(round, selected, 'not-in-this-palette'), selected);
    assert.equal(toggleArtifact(round, selected, removed).length, level);
  }
});

test('invalid submissions and out-of-range levels are rejected', () => {
  const round = createRound(3, seeded(8));
  assert.equal(checkRound(round, []), null);
  assert.equal(checkRound(round, Array(3).fill(round.palette[0].id)), null);
  assert.equal(checkRound(round, [round.palette[0].id, round.palette[1].id, 'unknown']), null);
  [0, 16, -1, 2.5, NaN].forEach(level => assert.throws(() => createRound(level), RangeError));
});

test('similarity is bounded, symmetric and preserves one decimal place', () => {
  assert.equal(matchScore('#000000', '#000000', 1), 100);
  assert.equal(matchScore('#000000', '#FFFFFF', 1), 0);
  const score = matchScore('#9CAC8F', '#AABDAA', 1);
  assert.equal(score, matchScore('#AABDAA', '#9CAC8F', 1));
  assert.ok(score > 0 && score < 100 && score !== Math.round(score));
  assert.equal(Math.round(score * 10), score * 10);
  assert.equal(matchScore('#9CAC8F', '#AABDAA'), Math.round(score));
});

test('late rounds use a distractor close to an actual answer color', () => {
  for (let seed = 1; seed < 30; seed++) {
    const round = createRound(15, seeded(seed));
    const answer = artifacts.filter(a => round.answerIds.includes(a.id));
    const proximity = a => Math.min(...answer.map(b => colorDistance(a.hex, b.hex)));
    const remaining = artifacts.filter(a => !round.answerIds.includes(a.id)).sort((a, b) => proximity(a) - proximity(b));
    const candidateCount = Math.ceil(remaining.length * .25);
    const distractor = round.palette.find(a => !round.answerIds.includes(a.id));
    assert.ok(proximity(distractor) <= proximity(remaining[candidateCount - 1]) + 1e-12);
  }
});
